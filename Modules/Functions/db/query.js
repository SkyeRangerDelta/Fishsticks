//----EDIT----
const db = require('promise-mysql');

const dbInfo = require("../db/db.json");
const logger = require("../syslog.js");

exports.run = async (fishsticks, inquery) => {
    logger.run(fishsticks, "[DB-SYS] Attempting stable connection...", 3);
    logger.run(fishsticks, "[DB-SYS] Executing the SQL query...", 3);

    function submitQuery() {

        let connection;

        return db.createConnection({
            host: dbInfo.db_host,
            user: dbInfo.db_user,
            password: dbInfo.db_pass,
            port: dbInfo.db_port,
            database: dbInfo.db_db,
            supportBigNumbers: true
        }).then(async conn => {
            console.log("[DB-SYS] Created Connection");
            connection = conn;
            let response = connection.query(inquery);
            return response;
        }).then(result => {
            console.log("[DB-SYS] SQL Response:");
            console.log(result);
            return result;
        });
    }

    return await submitQuery();
}