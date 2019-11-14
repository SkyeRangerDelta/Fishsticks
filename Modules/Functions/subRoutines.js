const colors = require('colors');
const query = require("./db/query.js");

exports.run = async (fishsticks) => {

    //SUBROUTINES CHECK
    console.log("Initiating system self diagnostic...");

    let currSubroutinesResponse = await query.run(fishsticks, "SELECT * FROM fs_subroutines;");


    let on = 0;
    let off = 0;
    let systems = (currSubroutinesResponse.length - 2);
    let eff;

    for (routine in currSubroutinesResponse) {
        if (currSubroutinesResponse[routine].state == 1) {
            console.log("Subroutine " + currSubroutinesResponse[routine].name + ": Online");
            on++;
        }
        else {
            console.log("Subroutine " + currSubroutinesResponse[routine].name + ": Offline");
            off++;
        }
    }

    eff = on / systems;
    eff = eff * 100;
    eff = eff.valueOf();

    if (eff == Infinity) {
        fishsticks.eff = 100;
    }
    else {
        fishsticks.eff = eff;
    }

    fishsticks.eff = Math.round(fishsticks.eff);

    console.log(colors.yellow("Fishsticks is operating at " + fishsticks.eff + "% efficiency."));
}