import express from 'express';
import { getStations, getLines, getSegments, getEvents } from '../dao/network-dao.js';

const router = express.Router();

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'Not authenticated' });
}

router.get('/network',isLoggedIn, async (req, res) => {
    try{
        const stations = await getStations();
        const lines = await getLines();
        const segments = await getSegments();

        res.json({ stations, lines, segments });
    }
    catch(err){
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/events',isLoggedIn, async (req, res) => {
    try{
        const events = await getEvents();
        res.json(events);
    }
    catch(err){
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;