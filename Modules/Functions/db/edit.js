//----EDIT----
const db = require('mysql');

const dbInfo = require("../db/db.json");
const create = require("./create.js");
const logger = require("../../Functions/syslog.js");

exports.run = (fishsticks, inquery, msg, cmd) => {
    logger.run(fishsticks, "[DB-SYS] Attempting stable connection...", 3);
    logger.run(fishsticks, "[DB-SYS] Running the following SQL: " + inquery, 3);

    let dbConnection = create.run(fishsticks);

    dbConnection.connect(function(err) {
        if (err) {
            logger.run(fishsticks, "[DB-SYS] Connection errored.", 3);
            if (fishsticks.dbaseConnection) {
                logger.run(fishsticks, "[DB-SYS] Fishsticks runtime DB-TEST was successful earlier, perhaps there is an info error?", 3);
            } else {
                logger.run(fishsticks, "[DB-SYS] Fishsticks had failed it's DB-TEST earlier, why are we still trying to connect?", 3);
            }

            fishsticks.dbaseConnection = false;
            return;
        }

        logger.run(fishsticks, "[DB-SYS] Connection Successful.", 3);
    });

    if (fishsticks.dbConnection == false) return;

    dbConnection.query(inquery, function(err, results, fields) {
        if (err) {
            logger.run(fishsticks, "[DB-SYS] Query failed: \n" + err, 4);
            msg.reply("DB Connection failed! **ChEcK ThE LoGG!** " + fishsticks.ranger);
            return;
        }

        logger.run(fishsticks, "[DB-SYS] Query successful.\nResults: \n" + results + "\nFields: \n" + fields, 3);

    });
}