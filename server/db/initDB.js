import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite3.Database('./db/database.sqlite');

function hashPassword(password, salt){
    return crypto.scryptSync(password, salt, 32).toString('hex');
}

db.serialize(() => {

    db.run("DROP TABLE IF EXISTS games");
    db.run("DROP TABLE IF EXISTS events");
    db.run("DROP TABLE IF EXISTS segments");
    db.run("DROP TABLE IF EXISTS lines");
    db.run("DROP TABLE IF EXISTS stations");
    db.run("DROP TABLE IF EXISTS users");

    db.run(`
        CREATE TABLE users( id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL )
    `);

    db.run(`
        CREATE TABLE stations( id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE )
    `);

    db.run(`
        CREATE TABLE lines(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            color TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE segments(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            line_id INTEGER NOT NULL,
            station1_id INTEGER NOT NULL,
            station2_id INTEGER NOT NULL,
            position INTEGER NOT NULL,

            FOREIGN KEY(line_id) REFERENCES lines(id),
            FOREIGN KEY(station1_id) REFERENCES stations(id),
            FOREIGN KEY(station2_id) REFERENCES stations(id)
        )
    `);

    db.run(`
        CREATE TABLE events(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            coin_effect INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE games(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            start_station_id INTEGER NOT NULL,
            destination_station_id INTEGER NOT NULL,
            final_score INTEGER NOT NULL,
            played_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(start_station_id) REFERENCES stations(id),
            FOREIGN KEY(destination_station_id) REFERENCES stations(id)
        )
    `);

  


 const users = [
        ['Anthony', 'password'],
        ['Maria', 'password'],
        ['Luca', 'password']
    ];

    users.forEach(user => {
        const salt = crypto.randomBytes(16).toString('hex');
        const password_hash = hashPassword(user[1], salt);

        db.run(
            `INSERT INTO users(username, password_hash, salt)
             VALUES (?, ?, ?)`,
            [user[0], password_hash, salt]
        );
    });

    const stations = [
        'Duomo',
        'Cordusio',
        'Cairoli',
        'Cadorna',
        'Conciliazione',
        "Sant'Ambrogio",
        "Sant'Agostino",
        'Porta Genova',
        'Romolo',
        'Missori',
        'Crocetta',
        'Porta Romana',
        'Lodi',
        'San Babila',
        'Dateo'
    ];

    stations.forEach(station => {
        db.run(
            `INSERT INTO stations(name) VALUES (?)`,
            [station]
        );
    });

    const lines = [
        ['M1 Red', 'red'],
        ['M2 Green', 'green'],
        ['M3 Yellow', 'yellow'],
        ['M4 Blue', 'blue']
    ];

    lines.forEach(line => {
        db.run(
            `INSERT INTO lines(name, color) VALUES (?, ?)`,
            line
        );
    });

    const segments = [
        [1, 1, 2, 1],
        [1, 2, 3, 2],
        [1, 3, 4, 3],
        [1, 4, 5, 4],

        [2, 4, 6, 1],
        [2, 6, 7, 2],
        [2, 7, 8, 3],
        [2, 8, 9, 4],

        [3, 1, 10, 1],
        [3, 10, 11, 2],
        [3, 11, 12, 3],
        [3, 12, 13, 4],

        [4, 14, 1, 1],
        [4, 1, 6, 2],
        [4, 6, 15, 3]
    ];

    segments.forEach(segment => {
        db.run(
            `INSERT INTO segments(line_id, station1_id, station2_id, position)
             VALUES (?, ?, ?, ?)`,
            segment
        );
    });

    const events = [
        ['Quiet journey', 0],
        ['Wrong platform', -2],
        ['Kind passenger', 1],
        ['Ticket inspection', -3],
        ['Found some coins', 2],
        ['Missed connection', -1],
        ['Fast transfer', 3],
        ['Lost wallet', -4]
    ];

    events.forEach(event => {
        db.run(
            `INSERT INTO events(description, coin_effect)
             VALUES (?, ?)`,
            event
        );
    });

    const games = [
        [1, 1, 13, 18],
        [1, 14, 9, 22],
        [2, 5, 10, 12],
        [2, 15, 13, 25]
    ];

    games.forEach(game => {
        db.run(
            `INSERT INTO games(user_id, start_station_id, destination_station_id, final_score)
             VALUES (?, ?, ?, ?)`,
            game
        );
    });

    console.log("Database created and seeded");
});



db.close();