//----NEW EVENT----

//Dependencies 1
const sys = require('../../Modules/fs_systems.json');
const gapi = require('../../Modules/GoogleCalAPI.json');
const perms = require('../../Modules/Functions/permissionsCheck.js');
const syslog = require('../../Modules/Functions/syslog.js');
const Discord = require('discord.js');
const convertTime = require('convert-time');

const {ListEvents, handleCreateEvent, DeleteEvent, handleTokenKey} = require('./Calendar/cal_events.js');

exports.run = async (fishsticks, msg, cmd) => {
    msg.delete()

    //Permissions Functions
    let pms = {
        "perms": ["Staff", "Bot", "Event Coordinator"]
    }
    let verification = perms.run(fishsticks, msg.member, pms);

    if (!verification) {
        return msg.reply("You are not authorized to run this command!");
    }

    //DEPENDENCIES 2
    //Setup log method
    function log(msg, level) {
        syslog.run(fishsticks, "[EVENT-SYS] " + msg, level)
    }

    //Deploy log message that the command is now executing
    log("Beginning event construction and deployment.", 2);

    //Event Object
    let event = {
        name: "",
        host: "",
        day: 1,
        month: 1,
        year: 2000,
        time_HR: 12,
        time_HR24: 12,
        time_M: 0,
        meridiem: "",
        desc: "",
        url_date: "",
        url_endDate: "",
        date: null,
        startTime: null,
        endTime: null
    }

    //Command Breakup
    let cmdAlt = msg.content.split('-'); //Set - as delimiter
    log("Parameters Collected: " + cmdAlt, 2); //Log the parameters

    let selector = cmdAlt[1].toLowerCase().trim();
    console.log("Selector " + selector);

    if (selector == "list") {
        log("List", 2);
        let events = await ListEvents(msg);
        return msg.channel.send(events);
    }
    if (selector == "delete") {
        log("Delete", 2);
        let deleteMsg = await DeleteEvent(cmdAlt[2], msg);
        return msg.channel.send(deleteMsg);
    }
    if (selector == "token") {
        log("Token", 2);
        const tokenKey = cmdAlt[2];
        let authMsg = await handleTokenKey(tokenKey, msg);
        return msg.channel.send("Authed Response: " + authMsg);
    }

    log("Create", 2);
    event.host = msg.author.username; //Set message author as host

    //CHECK FUNCTIONS
    //Deploy log message to notify that checks are in progress
    log("Verifying command integrity...", 2);

    //Verify name field not invalid
    if (cmdAlt[1] == null || cmdAlt[1] == undefined || typeof cmdAlt[1] != typeof "blah") {
        return msg.reply("I don't have a name for the event! How can you host an event with no name?")
        .then(sent => sent.delete(10000)); //If no parameter, return with error
    } else {
        event.name = cmdAlt[1]; //Else, set name
    }

    //UTILITY LOGIC
    //Generate the date
    let currDate = new Date();

    //Get date from command
    let time = cmdAlt[2].trim(); //Remove whitespace
    time = time.split(":"); //Set : as delimiter

    //Date format: MM:DD:YYYY:HrHr:MiMi:Meridiem
    //Verify that time even exists
    if ((cmdAlt[2] == undefined || cmdAlt[2] == null) && typeof cmdAlt[2] == typeof "blah") {
        return msg.reply("Events don't get planned like this without a date. Hit me with something here.")
        .then(sent => sent.delete(10000)); //If not, return error response
    }

    //Calculate month
    //Verify valid
    if ((time[0] > 0 && time[0] < 13) && time[1] != undefined) {
        event.month = parseInt(time[0]);
    } else {
        return msg.reply("You know there are only 12 months right? (Has to be a unmber too.)")
        .then(sent => sent.delete(10000));
    }

    //Calculate day
    //NOTE: This system assumes that with the exception of Feb. only, each month has 32 days.
    if (event.month != 2) {
        if ((time[1] > 0 && time[1] < 33) && time[1] != undefined) {
            event.day = parseInt(time[1]);
        } else {
            return msg.reply("That's not a day in this month! C'mon.")
            .then(sent => sent.delete(10000));
        }
    } else if (event.month == 2) {
        if ((time[1] > 0 && time[1] < 29) && time[1] != undefined) {
            event.day = parseInt(time[1]);
        } else {
            return msg.reply("February only has 28 days (and in my system there are no leap years).")
            .then(sent => sent.delete(10000));
        }
    } else {
        return msg.reply("Something...wait, how did you get here. Try that one again.")
        .then(sent => sent.delete(10000));
    }

    //Calculate year
    if ((time[2] < currDate.getFullYear()) && time[2] != undefined) {
        return msg.reply("We live in " + currDate.getFullYear() + ". Can't schedule before that.")
        .then(sent => sent.delete(10000));
    } else if (time[2] > 9999) {
        return msg.reply("Wow, trying to schedule a game night for your 18x grandkids? No, go get another bot for that.")
        .then(sent => sent.delete(10000));
    } else {
        event.year = parseInt(time[2]);
    }

    //Calculate hour
    if ((time[3] > 0 && time[3] < 13) && time[3] != undefined) {
        event.time_HR = parseInt(time[3]);
    } else if (time[3] > 12 && time[3] < 24 && time[3] != undefined) {
        return msg.reply("Hey hey, I don't do any of that tWeNtY-fOuR hOuR mess. I want actual hours.")
        .then(sent => sent.delete(10000));
    } else {
        return msg.reply("You...have gone horribly wrong somewhere. We're not working with relativity here, just a standard clock.")
        .then(sent => sent.delete(10000));
    }

    //Calculate minute
    if (time[4] >= 0 && time[4] <= 59 && (time[4] != undefined)) {
        event.time_M = parseInt(time[4]);
    } else {
        return msg.reply("Mmmmmmmmmmmmmmmmmmmmmmmmmminutes...only run from 0 to 59.")
        .then(sent => sent.delete(10000));
    }

    //Calulate meridiem
    if (time[5].toLowerCase() == "am" | time[5].toLowerCase() == "pm") {
        event.meridiem = time[5];
    } else {
        return msg.reply("Remember. 12. Hours. I'm gonna need either AM or PM.")
        .then(sent => sent.delete(10000));
    }

    if (event.meridiem.toLowerCase() == "pm") {
        event.time_HR24 = event.time_HR + 12;
    }

    //Build date for verification
    let month = currDate.getMonth()+1;
    let date = currDate.getDay()+1;
    let hr = currDate.getHours();
    let min = currDate.getMinutes();

    if (event.month < month) {
        return msg.reply("[Month] No dates in the past!")
        .then(sent => sent.delete(10000))
    } else if (event.day < date) {
        return msg.reply("[Day] No dates in the past!")
        .then(sent => sent.delete(10000))
    } else if (event.time_HR24 < hr) {
        return msg.reply("[Hour] No dates in the past!")
        .then(sent => sent.delete(10000))
    } else if (event.time_M < min) {
        return msg.reply("[Minute] No dates in the past!")
        .then(sent => sent.delete(10000))
    }

    //Build payload date
    event.url_date = `${event.month}/${event.day}/${event.year} ${event.time_HR}:${event.time_M}${event.meridiem}`;
    event.url_endDate = `${event.month}/${event.day}/${event.year} ${event.time_HR+1}:${event.time_M}${event.meridiem}`;

    console.log(event.url_date);
    console.log(`${event.year}-${event.month-1}-${event.day}-${convertTime(event.time_HR + event.meridiem, 'HH')}-${event.time_M}-0`);

    event.startTime = new Date(event.year, event.month - 1, event.day, convertTime(event.time_HR + event.meridiem, 'HH'), event.time_M, 0);
    event.endTime = new Date(event.year, event.month - 1, event.day, convertTime((event.time_HR + 1) + event.meridiem, 'HH'), event.time_M, 0)

    log("Setting times:\n\tStart: " + event.startTime + "\n\tEnd: " + event.endTime, 2);

    //Build description
    event.desc = cmdAlt[3].trim();

    //Verify event using Embed
    let eventPanel = new Discord.RichEmbed();
        eventPanel.setTitle("New Event: " + event.name);
        eventPanel.setDescription(event.desc);
        eventPanel.addField("Save the Date!", `${event.month}/${event.day}/${event.year} at ${event.time_HR}:${event.time_M}${event.meridiem}`);
        eventPanel.setFooter("Coordinated by " + event.host + ". Automated by yours truely.");
    
    msg.channel.send({embed: eventPanel});

    try {
        var eventLink = await handleCreateEvent(event, msg);
    } catch (error) {
        var eventLink = error;
    }

    msg.channel.send(eventLink);
}
