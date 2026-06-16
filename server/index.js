import express from "express";
import cors from "cors";
import session from "express-session";

import passport from "./passport/passport.js";
import authRouter from "./routes/auth.js";

const app = express();
const port = 3001;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: "last-race-secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authRouter);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});