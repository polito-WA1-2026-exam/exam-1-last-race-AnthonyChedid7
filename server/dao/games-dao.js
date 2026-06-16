import db from '../db/db.js';

export function createGame(userId, startStationId, destinationStationId){
    return new Promise((resolve, reject) => {

        db.run(
            `INSERT INTO games(user_id, start_station_id, destination_station_id, status)
             VALUES (?, ?, ?, ?)`,
            [userId, startStationId, destinationStationId, 'started'],
            function(err){
                if(err)
                    reject(err);
                else
                    resolve(this.lastID);
            }
        );

    });
}

export function getGameById(gameId){
    return new Promise((resolve, reject) => {

        db.get(
            `SELECT *
             FROM games
             WHERE id = ?`,
            [gameId],
            (err, row) => {
                if(err)
                    reject(err);
                else
                    resolve(row);
            }
        );

    });
}

export function completeGame(gameId, finalScore){
    return new Promise((resolve, reject) => {

        db.run(
            `UPDATE games
             SET status = ?, final_score = ?, completed_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            ['completed', finalScore, gameId],
            function(err){
                if(err)
                    reject(err);
                else
                    resolve(this.changes);
            }
        );

    });
}

export function getRanking(){
    return new Promise((resolve, reject) => {

        db.all(
            `SELECT 
                users.username,
                MAX(games.final_score) AS best_score
             FROM games
             JOIN users ON games.user_id = users.id
             WHERE games.status = 'completed'
             GROUP BY games.user_id
             ORDER BY best_score DESC`,
            [],
            (err, rows) => {
                if(err)
                    reject(err);
                else
                    resolve(rows);
            }
        );

    });
}