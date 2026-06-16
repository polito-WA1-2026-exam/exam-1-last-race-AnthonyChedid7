import express from 'express';
import { getRanking } from '../dao/games-dao.js';

const router = express.Router();

router.get('/ranking', async (req, res) => {
    try{
        const ranking = await getRanking();
        res.json(ranking);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

export default router;