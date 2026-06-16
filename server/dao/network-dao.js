import db from '../db/db.js';

export function getStations(){
    return new Promise((resolve, reject) => {

        db.all(`SELECT * FROM stations`, [], (err, rows) => {
            if(err)
                reject(err);
            else
                resolve(rows);
        });

    });
}

export function getLines(){
    return new Promise((resolve, reject) => {

        db.all(`SELECT * FROM lines`, [], (err, rows) => {
            if(err)
                reject(err);
            else
                resolve(rows);
        });

    });
}

export function getSegments(){
    return new Promise((resolve, reject) => {

        db.all(
            `SELECT 
                segments.id,
                segments.line_id,
                lines.name AS line_name,
                segments.station1_id,
                s1.name AS station1_name,
                segments.station2_id,
                s2.name AS station2_name,
                segments.position
             FROM segments
             JOIN lines ON segments.line_id = lines.id
             JOIN stations s1 ON segments.station1_id = s1.id
             JOIN stations s2 ON segments.station2_id = s2.id
             ORDER BY segments.line_id, segments.position`,
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

export function getEvents(){
    return new Promise((resolve, reject) => {

        db.all(`SELECT * FROM events`, [], (err, rows) => {
            if(err)
                reject(err);
            else
                resolve(rows);
        });

    });
}