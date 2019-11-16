//----EDIT----
const db = require('promise-mysql');

const logger = require("../syslog.js");
const fsoOpen = require('../FSO/openConnection.js');

exports.run = async (fishsticks, inquery) => {
    logger.run(fishsticks, "[DB-QRY] Verifying connection.", 3);

    if (!fishsticks.FSOConnection || fishsticks.FSOConnection == undefined) {
        logger.run(fishsticks, "[DB-QRY] None found, opening new conduit.", 3);
        fishsticks.FSOConnection = await fsoOpen.run(fishsticks);
    }

    logger.run(fishsticks, "[DB-QRY] Executing query.", 3);
    let response = await fishsticks.FSOConnection.query(inquery);

    return response;
}