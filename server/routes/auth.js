import express from 'express';
import passport from '../passport/passport.js';

const router = express.Router();

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'Not authenticated' });
}

router.post('/sessions', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
});

router.get('/sessions/current', isLoggedIn, (req, res) => {
    res.json(req.user);
});

router.delete('/sessions/current', isLoggedIn, (req, res) => {

    req.logout((err) => {
        if(err)
            return res.status(500).json({ error: 'Logout error' });

        res.status(200).json({ message: 'Logged out' });
    });

});

export default router;