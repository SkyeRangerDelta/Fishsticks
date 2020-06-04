//-----EVENT COMMAND------

const Discord = require('discord.js');
const fsSystems = require('../../Modules/fs_systems.json');
const https = require('https');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    return msg.reply("Command Disabled until further notice.");

    if (msg.channel != fishsticks.consoleChannel) {
        return msg.reply("Event commands must be sent in the " + fishsticks.consoleChannel + " channel!").then(sent => sent.delete({timeout: 15000}));
    }

    if (!(msg.member.roles.find('name', 'Staff'))) {
        return msg.reply("You must be a staff member to add events!").then(sent => sent.delete({timeout: 15000}));
    } else if (msg.member.roles == null) {
        return;
    }

    const refCmd = msg.content.split('-');
    console.log("refCmd: " + refCmd)

    /*
        Syntax:
        Quick Event:
        !event -q -[name] -[host]

        Detailed Event (Preferred):
        !event -d -[name] -[startTime] -[eventDescription]
    */

    let eventType;
    let eventName;
    let eventHost;
    let eventDay;
    let eventMonth;
    let eventYear;
    let eventTimeHr;
    let eventTimeHr24;
    let eventTimeM;
    let eventZone;
    let eventDescription;

    if (refCmd[1] != null || refCmd[1] != undefined) {
        eventType = refCmd[1].trim();
    } else {
        return msg.reply("You need to specify an event type! (Quick (`q`, `quick`) or Detailed (`d`, `detail`, `detailed`)?)").then(sent => sent.delete({timeout: 15000}));
    }

    if (refCmd[2] != null || refCmd[2] != undefined) {
        eventName = refCmd[2].trim();
    } else {
        return msg.reply("You need to specify an event name!").then(sent => sent.delete({timeout: 15000}));
    }

    if (eventType.toLowerCase() == "q" || eventType.toLowerCase() == "quick") {

        if (refCmd[3] != null || refCmd[3] != undefined) {
            eventHost = refCmd[3].trim();
        } else {
            return msg.reply("You need to specify an event host!").then(sent => sent.delete({timeout: 15000}));
        }

        quickURL = fsSystems.fsCalendarHook.replace("{event}", "FS_CalEventQuick");
        quickURL = quickURL.concat(`?value1=${eventName}&value2=${eventHost}`);
        https.get(quickURL, (res) => {
            console.log("[EVENT-SUBR] Status Code: " + res.statusCode);

            res.on("data", (d) => {
                console.log(d);
            })
        }).on('error', (eventGetError) => {
            console.log(eventGetError);
        });
    } else if (eventType.toLowerCase() == "d" || eventType.toLowerCase() == "detail" || eventType.toLowerCase() == "detailed") {

        let todaysDate = new Date();

        if (refCmd[3] != null || refCmd[3] != undefined) {
            let time = refCmd[3].trim();
            time = time.split(":");

            //CALCULATE MONTH
            if (time[0] > 0 && time[0] < 13 && time[0] != null && time[0] != undefined) {
                eventMonth = parseInt(time[0]);
                console.log("EventMonth: " + eventMonth);
            } else {
                return msg.reply("[EVENT-TIME] Month specifier must be between 01 and 12!");
            }

            //CALCULATE DAY (With Feb. Exceptions)
            if (eventMonth != 2) {
                if (time[1] > 0 && time[1] < 33 && (time[1] != null || time[1] != undefined)) {
                    eventDay = parseInt(time[1]);
                    console.log("EventDay: " + eventDay);
                } else {
                    return msg.reply("[EVENT-TIME] Day specifier must be between 01 and 32 (except if February).");
                }
            } else if (eventMonth == 2) {
                if (time[1] > 0 && time[1] < 29 && (time[1] != null || time[1] != undefined)) {
                    eventDay = parseInt(time[1]);
                    console.log("EventDay: " + eventDay);
                }
                else {
                    return msg.reply("You nit, February doesn't have more than 29 days! (Including leap year.)");
                }
            } else {
                return msg.reply("[EVENT-TIME] Month specifier must be between 01 and 12!");
            }

            //CALCULAte YEAR
            if (time[2] < todaysDate.getFullYear() && (time[2] != null || time[2] != undefined)) {
                return msg.reply("You can't set event in the past! (Year)");
            } else if (time[2] > 999 && time[2] < 10000) {
                eventYear = parseInt(time[2]);
                console.log("EventYear: " + eventYear);
            } else {
                return msg.reply("Years...that I shoul dhave to deal with only have 4 digits!");
            }

            //CALCULATE HOUR
            if (time[3] > 0 && time[3] < 13 && (time[3] != null || time[3] != undefined)) {
                eventTimeHr = parseInt(time[3]);
                console.log("EventTimeHr: " + eventTimeHr);
            } else if (time[3] > 12 && time[3] < 24) {
                return msg.reply("I don't do any of that 24 mess, give me an actual time please.");
            } else {
                return msg.replay("That...doesn't look like an hour on the clock.");
            }

            //CALCLUATE MINUTE
            if (time[4] >= 0 && time[4] <=  59 && (time[4] != null || time[4] != undefined)) {
                eventTimeM = parseInt(time[4]);
                console.log("EventTimeM: " + eventTimeM);
            } else {
                return msg.reply("Mmmmmmmmmmmmmmmmmmmmmmmmmminutes....only run from 0 to 59.");
            }

            //CALCULATE MERIDIEM
            if (time[5].toLowerCase() == "pm" || time[5].toLowerCase() == "am") {
                eventZone = time[5];
                console.log("EventZone: " + eventZone);
            } else {
                return msg.reply("I operate on a 12hr clock here. Give me a proper meridiem.");
            }

            if (eventZone.toLowerCase() == "pm") {
                eventTimeHr24 = eventTimeHr + 12;
                console.log("EventTimeHr24: " + eventTimeHr24);
            }

            //CREATE CURRENT DATE
            console.log("Current Date: " + todaysDate);
            let currMonth = todaysDate.getMonth() + 1;
            let currDate = todaysDate.getDay() + 1;
            let currHr = todaysDate.getHours();
            let currMin = todaysDate.getMinutes();

            //CALCULATE VALIDITY
            if (eventMonth < currMonth) {
                return msg.reply("You can't set a date in the past! (Month)");
            } else if (eventDay < currDate) {
                return msg.reply("You can't set a date in the past! (Day)");
            } else if (eventTimeHr24 < currHr) {
                return msg.reply("You can't set a date in the past! (Hour)");
            } else if (eventTimeM < currMin) {
                return msg.reply("You can't set a date in the past! (Minute)");
            }

            //CREATE EVENT START TIME (3/20/2019,4:15PM)
            let eventStart = `${eventMonth}/${eventDay}/${eventYear} ${eventTimeHr}:${eventTimeM}${eventZone}`;

            //CALCULATE END TIME
            let eventEndTime = `${eventMonth}/${eventDay}/${eventYear} ${eventTimeHr+1}:${eventTimeM}${eventZone}`;

            //COLLECT DESCRIPTION
            if (refCmd[4] != null || refCmd[4] != undefined) {
                eventDescription = refCmd[4].trim();
            }
            
            //ATTEMPT HTTPS SEND
            try {


                console.log("[EVENT-SUBR] Attempting event send.")

                //V1 = Event Title
                //V2 = Start Time
                //V3 = Description

                //Default is set to not an all-day event, and carries no location, attendees, or end time.

                //quickURL = fsSystems.fsCalendarHook.replace("{event}", "FS_CalEventQuick");
                //quickURL = quickURL.concat(`?value1=${eventName}&value2=${eventHost}`);

                let detailedURL = fsSystems.fsCalendarHook;
                detailedURL = detailedURL.concat(`?value1=${eventName}&value2=${eventStart}&value3=${eventDescription}&value4=${eventEndTime}`);

                console.log("[EVENT-SUBR] Sending request with: " + detailedURL);

                https.get(detailedURL, (res) => {
                    console.log("[EVENT-SUBR] Status Code: " + res.statusCode);

                    res.on("data", (d) => {
                        console.log(d);
                    })
                }).on('error', (eventGetError) => {
                    console.log(eventGetError);
                });
                
            } catch (HTTPSSend) {
                console.log("[EVENT-SUBR] Uhhhh...\n\n" + HTTPSSend);
            }


        } else {
            return msg.reply("You need to specify an event start time! (In MO:DD:YYYY:HH:MM:APM format)").then(sent => sent.delete({timeout: 15000}));
        }

    }

}