//INITIALIZE STORED POLLS

const fs = require('fs');
const colors = require('colors');
const syslog = require('../Functions/syslog.js');

exports.run = (fishsticks, flag) => {

    let pollFile = JSON.parse(fs.readFileSync(`${__dirname}/polls.json`, 'utf8'));

    if (flag == "init") {
        //Init poll IDs
        for (poll in pollFile.polls) {
            fishsticks.currentPolls.push(pollFile.polls[poll].pollID);
            console.log(colors.white("[POLL-SYS] Initialized Poll ID " + pollFile.polls[poll].pollID));
        }
    }
}