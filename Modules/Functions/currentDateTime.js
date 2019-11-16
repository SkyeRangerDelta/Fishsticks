//----CURRENT DATE AND TIME----
const syslog = require('./syslog.js');

exports.run = (fishsticks) => {
    let dateObj = new Date();
    let date = (dateObj.getMonth() + 1) + "/" + dateObj.getDate() + "/" + dateObj.getFullYear() + " @ ";
    let hour = dateObj.getHours();
    let minute = dateObj.getMinutes();
    let meridian = "AM";
    
    if (hour > 12) {
        hour = dateObj.getHours() - 12;
        meridian = "PM";
    }

    if (minute < 10) {
        minute = "0" + minute;
    }

    time = hour + ":" + minute + meridian;

    let currDate = date + time;

    syslog.run(fishsticks, "[DT-MOD] Generated current date and time: " + currDate);

    return currDate;
}