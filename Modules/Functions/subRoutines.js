const colors = require('colors');

exports.run = (fishsticks) => {

    //SUBROUTINES CHECK
    console.log(colors.red("Initiating system self diagnostic..."));
    let on = 0;
    let off = 0;
    let systems = (fishsticks.subroutines.size - 2);
    let eff;

    for (let routine of fishsticks.subroutines.keys()) {
        if (fishsticks.subroutines.get(routine)) {
            console.log(colors.magenta("Subroutine " + routine + ": Online"));
            on++;
        }
        else {
            console.log(colors.magenta("Subroutine " + routine + ": Offline"));
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

    console.log(colors.yellow("Fishsticks is operating at " + fishsticks.eff + "% efficiency."));
}