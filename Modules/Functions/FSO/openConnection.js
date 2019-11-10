//----FSO CREATE CONDUIT----

const mysql = require('promise-mysql');
const db = require('../db/db.json');

exports.run = async (fishsticks) => {

    console.log("[DB-SYS] Opening a new global conduit.");

    let FSOConnection = await mysql.createConnection({
        host: db.db_host,
        user: db.db_user,
        password: db.db_pass,
        port: db.db_port,
        database: db.db_db,
        supportBigNumbers: true
    }).then(console.log("[DB-SYS] Conduit Opened."));

    console.log("[DB-SYS] Testing connection...");
    let testResponse = await FSOConnection.query(`SELECT state FROM fs_subroutines WHERE name = "online";`);

    if (testResponse[0].state != 1) {
        console.log("[DB-SYS] Connection failed!");
    } else {
        console.log("[DB-SYS] Connection good!");
        fishsticks.FSOConnection = FSOConnection;
    }

    return FSOConnection;
}