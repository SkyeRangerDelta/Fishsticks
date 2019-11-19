//----EDIT----
const db = require('promise-mysql');

const logger = require("../syslog.js");
const fsoOpen = require('../FSO/openConnection.js');

exports.run = async (fishsticks, inquery) => {
    logger.run(fishsticks, "[DB-QRY] Verifying connection.", 3);

    let response;

    if (!fishsticks.FSOConnection || fishsticks.FSOConnection == undefined) {
        logger.run(fishsticks, "[DB-QRY] None found, opening new conduit.", 3);
        fishsticks.FSOConnection = await fsoOpen.run(fishsticks);
    }

    try {
        logger.run(fishsticks, "[DB-QRY] Executing query.", 3);
        response = await fishsticks.FSOConnection.query(inquery);
    } catch (FSO_QueryErr) {
        logger.run(fishsticks, "[DB-QRY] Something screwy happened, some FSO error. Attempting to open a fresh conduit.", 3);
        console.log(FSO_QueryErr);
        fishsticks.FSOConnection = await fsoOpen.run(fishsticks);

        logger.run(fishsticks, "[DB-QRY] Executing query.", 3);
        response = await fishsticks.FSOConnection.query(inquery);
    }

    return response;
}