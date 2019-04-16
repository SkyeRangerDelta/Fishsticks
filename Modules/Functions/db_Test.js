//----TEST CONNECTION TO DATABASE----
const db = require('mysql');
const dbInfo = require("../Core/db.json");

exports.run = (fishsticks) => {

    console.log("[DB-TEST] Testing connection...");

    var dbConnection = db.createConnection({
        host: dbInfo.db_host,
        port: dbInfo.db_port,
        user: dbInfo.db_user,
        password: dbInfo.db_pass,
        database: dbInfo.db_db
    });

    dbConnection.connect(function(err) {
        if (err) {
            console.error("[DB-TEST] Connection failed.\n" + err);
            fishsticks.dbaseConnection = false;
            return;
        }

        console.log("[DB-TEST] Connection successful.\n[DB-TEST] Logged ID: " + dbConnection.threadId);
        fishsticks.dbaseConnection = true;
    });

    if (fishsticks.dbaseConnection == false) return;

    dbConnection.end(function(err) {
        if (err) {
            console.error("[DB-TEST] Disconnection failed.\n" + err);
            fishsticks.dbaseConnection = false;
            return;
        }

        console.log("[DB-TEST] Disconnect successful.");
    });

}