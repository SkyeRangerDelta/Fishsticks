//----TEST CONNECTION TO DATABASE----
const db = require('promise-mysql');
const dbInfo = require("../db/db.json");

exports.run = (fishsticks) => {

    console.log("[DB-TEST] Testing connection...");

    var dbConnection;
    
    db.createConnection({
        host: dbInfo.db_host,
        port: dbInfo.db_port,
        user: dbInfo.db_user,
        password: dbInfo.db_pass,
        database: dbInfo.db_db
    }).then(function(connected) {
        dbConnection = connected;
        return dbConnection.query(`SELECT * FROM fs_subroutines WHERE name = 'online'`)
    }).then(function(result) {
        dbConnection.end();
        if (result[0].state == 1) {
            fishsticks.dbaseConnection = true;
            return;
        } else {
            fishsticks.dbaseConnection = false;
        }
    });

}