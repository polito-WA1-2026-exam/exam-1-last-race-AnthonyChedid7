import express from 'express';
import { getStations, getLines, getSegments, getEvents } from '../dao/network-dao.js';

const router = express.Router();

router.get('/network', async (req, res) => {
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

router.get('/events', async (req, res) => {
    try{
        const events = await getEvents();
        res.json(events);
    }
    catch(err){
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;