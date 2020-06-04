//----MINUTES----
//Taking minutes for the meeting eh?

const fs = require(`fs`);
const minutesDir = require(`../../Modules/Minutes/`);

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    /*
        Syntax:
        !minutes -create
        !minutes -add -Stuff
        !minutes -edit 1 -Stuff
        !minutes -remove 1
    */

    //Parse intentions
    let flag = cmd[0].trim().toLowerCase();
    flag = flag.split(` `);

    let action = flag[0];

    switch (action) {
        case `add`:
            minutesAdd(cmd);
            break;
        case `edit`:
            minutesEdit(cmd);
            break;
        case `new`:
            minutesCreate(cmd);
            break;
        case `remove`:
            minutesRemove(cmd);
            break;
        case `delete`:
            minutesRemove(cmd);
            break;
        default:
            return msg.reply(`You said something, but none of it made...like any sense. Perhaps try that again.`).then(sent => sent.delete({timeout: 10000}));
    }
}

//Add a point to the minutes.
function minutesAdd(cmd) {
    
}

//Create a new Minutes file
function minutesCreate(cmd) {
    let creationDate = new Date();

    let fileName = creationDate.toDateString();
    fileName = fileName.replace(` `, `-`);

    let filePath = `${minutesDir}${fileName}.json`;
    let fileContent = {
        "Minutes": fileName
    }

    fs.writeFileSync(filePath, JSON.stringify(fileContent));
}

//Edit a point in the minutes
function minutesEdit(cmd) {

}

//Remove a minute
function minutesRemove(cmd) {

}