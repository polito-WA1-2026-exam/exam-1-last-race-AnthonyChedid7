import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';

import { getUserByUsername, getUserById } from '../dao/users-dao.js';

function checkPassword(password, salt, hash){
    const calculatedHash = crypto.scryptSync(password, salt, 32).toString('hex');
    return calculatedHash === hash;
}

passport.use(new LocalStrategy.Strategy(
    async function(username, password, done){
        try{
            const user = await getUserByUsername(username);

            if(!user)
                return done(null, false, { message: 'Incorrect username' });

            const validPassword = checkPassword(password, user.salt, user.password_hash);

            if(!validPassword)
                return done(null, false, { message: 'Incorrect password' });

            return done(null, {
                id: user.id,
                username: user.username
            });
        }
        catch(err){
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try{
        const user = await getUserById(id);
        done(null, user);
    }
    catch(err){
        done(err);
    }
});

export default passport;