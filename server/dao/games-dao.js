import db from '../db/db.js';

export function saveGame(userId, startStationId, destinationStationId, finalScore){
    return new Promise((resolve, reject) => {

        db.run(
            `INSERT INTO games(user_id, start_station_id, destination_station_id, final_score)
             VALUES (?, ?, ?, ?)`,
            [userId, startStationId, destinationStationId, finalScore],
            function(err){
                if(err)
                    reject(err);
                else
                    resolve(this.lastID);
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