//----SUBROUTINE CHECK----
// Run to determine state of a subroutine, system carries over after restart via SQL

const syslog = require('./syslog.js');
const query = require('./db/query.js');

exports.run = async (fishsticks, subroutine) => {
    syslog.run(fishsticks, "[DB-SYS] Submitting subroutine check...");

    let response = await query.run(fishsticks, `SELECT * FROM fs_subroutines WHERE name = '${subroutine}'`);
    
    console.log("SUB CHECK: ");
    console.log(response);

    if (response[0].state == 1) {
        syslog.run(fishsticks, "[DB-SYS] Check returned " + response + ". Returning online.", 2);
        return true;
    } else {
        syslog.run(fishsticks, "[DB-SYS] Check returned " + response + ". Returning offline.", 2);
        return false;
    }
}