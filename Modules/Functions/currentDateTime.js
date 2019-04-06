//----CURRENT DATE AND TIME----

exports.run = () => {
    let dateObj = new Date();
    let date = dateObj.getMonth() + "/" + dateObj.getDate() + "/" + dateObj.getFullYear() + " @ ";
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

    return currDate;
}