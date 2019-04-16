//----CREATE CONNECTION----
const db = require('mysql');

const dbInfo = require("../../Core/db.json");
const logger = require("../syslog.js");

exports.run = (fishsticks) => {
    logger.run(fishsticks, "[DB-SYS] Attempting to create connection info...", 2);

    let dbConn = db.createConnection({
        host: dbInfo.db_host,
        user: dbInfo.db_user,
        password: dbInfo.db_pass,
        post: dbInfo.db_port,
        database: dbInfo.db_db
    });

    return dbConn;
}