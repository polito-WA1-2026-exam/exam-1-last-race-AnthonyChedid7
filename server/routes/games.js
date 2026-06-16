import express from 'express';
import { createGame, getGameById, completeGame } from '../dao/games-dao.js';
import { getStations, getSegments, getEvents } from '../dao/network-dao.js';

const router = express.Router();

function buildGraph(segments){
    const graph = {};

    segments.forEach(s => {
        if(!graph[s.station1_id])
            graph[s.station1_id] = [];

        if(!graph[s.station2_id])
            graph[s.station2_id] = [];

        graph[s.station1_id].push(s.station2_id);
        graph[s.station2_id].push(s.station1_id);
    });

    return graph;
}

function shortestDistance(graph, startId, destinationId){
    const queue = [{ station: startId, distance: 0 }];
    const visited = new Set([startId]);

    while(queue.length > 0){
        const current = queue.shift();

        if(current.station === destinationId)
            return current.distance;

        const neighbours = graph[current.station] || [];

        neighbours.forEach(n => {
            if(!visited.has(n)){
                visited.add(n);
                queue.push({
                    station: n,
                    distance: current.distance + 1
                });
            }
        });
    }

    return Infinity;
}

function findSegmentById(segments, id){
    return segments.find(s => s.id === id);
}

function isInterchangeStation(stationId, segments){
    const lines = new Set();

    segments.forEach(s => {
        if(s.station1_id === stationId || s.station2_id === stationId)
            lines.add(s.line_id);
    });

    return lines.size > 1;
}

function validateRoute(route, segments, startStationId, destinationStationId){
    if(route.length === 0)
        return false;

    const usedSegments = new Set();
    let currentStation = startStationId;
    let currentLineId = null;

    for(const segmentId of route){

        if(usedSegments.has(segmentId))
            return false;

        const segment = findSegmentById(segments, segmentId);

        if(!segment)
            return false;

        if(currentLineId !== null && segment.line_id !== currentLineId){
            if(!isInterchangeStation(currentStation, segments))
                return false;
        }

        if(segment.station1_id === currentStation)
            currentStation = segment.station2_id;
        else if(segment.station2_id === currentStation)
            currentStation = segment.station1_id;
        else
            return false;

        currentLineId = segment.line_id;
        usedSegments.add(segmentId);
    }

    return currentStation === destinationStationId;
}

function applyRandomEvents(route, segments, events){
    let coins = 20;
    const steps = [];

    route.forEach(segmentId => {
        const segment = findSegmentById(segments, segmentId);
        const event = events[Math.floor(Math.random() * events.length)];

        coins = coins + event.coin_effect;

        steps.push({
            segment_id: segment.id,
            from: segment.station1_name,
            to: segment.station2_name,
            event: event.description,
            effect: event.coin_effect,
            coins_after_step: coins
        });
    });

    return {
        finalScore: Math.max(0, coins),
        steps
    };
}

function isLoggedIn(req, res, next){
            if(req.isAuthenticated())
                return next();

            return res.status(401).json({ error: 'Not authenticated' });
        }

        router.post('/games/start', isLoggedIn, async (req, res) => {
            try{
        const stations = await getStations();
        const segments = await getSegments();
        const graph = buildGraph(segments);

        let startStationId;
        let destinationStationId;
        let distance = 0;

        while(distance < 3){
            const start = stations[Math.floor(Math.random() * stations.length)];
            const destination = stations[Math.floor(Math.random() * stations.length)];

            if(start.id !== destination.id){
                startStationId = start.id;
                destinationStationId = destination.id;
                distance = shortestDistance(graph, startStationId, destinationStationId);
            }
        }

        const gameId = await createGame(req.user.id, startStationId, destinationStationId);

        res.json({
            id: gameId,
            start_station_id: startStationId,
            destination_station_id: destinationStationId
        });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.post('/games/:id/submit', isLoggedIn, async (req, res) => {
    try{
        const game = await getGameById(req.params.id);

        if(!game)
            return res.status(404).json({ error: 'Game not found' });

        if(game.user_id !== req.user.id)
            return res.status(403).json({ error: 'Forbidden' });

        const route = req.body.route;

        if(!Array.isArray(route))
            return res.status(400).json({ error: 'Invalid route format' });

        const segments = await getSegments();
        const events = await getEvents();

        const valid = validateRoute(
            route,
            segments,
            game.start_station_id,
            game.destination_station_id
        );

        if(!valid){
            await completeGame(game.id, 0);

            return res.json({
                valid: false,
                final_score: 0,
                steps: []
            });
        }

        const result = applyRandomEvents(route, segments, events);

        await completeGame(game.id, result.finalScore);

        res.json({
            valid: true,
            message: 'Game completed',
            final_score: result.finalScore,
            steps: result.steps
        });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

       

export default router;