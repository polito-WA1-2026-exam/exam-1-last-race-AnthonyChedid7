import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve('db', 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if(err)
        console.log(err.message);
    else
        console.log('Connected to database');
});

export default db;