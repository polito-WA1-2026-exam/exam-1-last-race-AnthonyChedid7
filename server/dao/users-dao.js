import db from '../db/db.js';

export function getUserByUsername(username){
    return new Promise((resolve, reject) => {

        db.get(
            `SELECT * FROM users WHERE username = ?`,
            [username],
            (err, row) => {
                if(err)
                    reject(err);
                else
                    resolve(row);
            }
        );

    });
}

export function getUserById(id){
    return new Promise((resolve, reject) => {

        db.get(
            `SELECT id, username FROM users WHERE id = ?`,
            [id],
            (err, row) => {
                if(err)
                    reject(err);
                else
                    resolve(row);
            }
        );

    });
}