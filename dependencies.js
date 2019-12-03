//----Dependencies----
//Developer: <Audwin Thomas>

//Dependencies 1
const sys = require(‘../../Modules/fs_systems.json’);
const gapi = require(‘../../Modules/GoogleCalAPI.json’);
const perms = require(‘../../Modules/Functions/permissionsCheck.js’);
const syslog = require(‘../../Modules/Functions/syslog.js’);
const Discord = require(‘discord.js’);
const convertTime = require(‘convert-time’);
 

const {ListEvents, handleCreateEvent,
DeleteEvent, handleTokenKey} = require(‘./Calendar/cal_events.js’);

exports.run = async (fishsticks, msg, cmd) => {
    msg.delete()

    //Permissions Functions
    let pms = {
        “perms”: [“Staff”, “Bot”, “Event Coordinator”]
    }
    let verification = perms.run(fishsticks, msg.member, pms);

    if (!verification) {
        return msg.reply(“You are not authorized to run this command!”);
    }

    //DEPENDENCIES 2
    //Setup log method
    function log(msg, level) {
        syslog.run(fishsticks, “[EVENT-SYS] “ + msg, level)
    }

    //Deploy log message that the command is now executing
    log(“Beginning event construction and deployment.”, 2);

    //Event Object
    let event = {
        name: “”,
        host: “”,
        day: 1,
        month: 1,
        year: 2000,
        time_HR: 12,
        time_HR24: 12,
        time_M: 0,
        meridiem: “”,
        desc: “”,
        url_date: “”,
        url_endDate: “”,
        date: null,
        startTime: null,
        endTime: null
    }

    //Command Breakup
    let cmdAlt = msg.content.split(‘-‘); //Set – as delimiter
    log(“Parameters Collected: “ + cmdAlt, 2); //Log the parameters

    let selector = cmdAlt[1].toLowerCase().trim();
    console.log(“Selector “ + selector);

    if (selector == “list”) {
        log(“List”, 2);
        let events = await ListEvents(msg);
        return msg.channel.send(events);
    }
    if (selector == “delete”) {
        log(“Delete”, 2);
        let deleteMsg = await DeleteEvent(cmdAlt[2], msg);
        return msg.channel.send(deleteMsg);
    }
    if (selector == “token”) {
        log(“Token”, 2);
        const tokenKey = cmdAlt[2];
        let authMsg = await handleTokenKey(tokenKey, msg);
        return msg.channel.send(“Authed Response: “ + authMsg);
    }

    log(“Create”, 2);
    event.host = msg.author.username; //Set message author as host
    //CHECK FUNCTIONS
    //Deploy log message to notify that checks are in progress
    log(“Verifying command integrity…”, 2);
 

    //Verify name field not invalid
    if (cmdAlt[1] == null || cmdAlt[1] == undefined || 
 typeof cmdAlt[1] != typeof “blah”) {
        return msg.reply(“I don’t have a name for the event! 
 How can you host an event with no name?”)
        .then(sent => sent.delete(10000)); //If no parameter, return with error
    } else {
        event.name = cmdAlt[1]; //Else, set name
    }