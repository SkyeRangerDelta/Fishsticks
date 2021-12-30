// ---- Time Utility ----

//Imports
const DATE = require('date-and-time');
const { DateTime } = require('luxon');

//Exports

module.exports = {
	systemDate,
	systemTime,
	systemTimestamp,
	convertMs,
	convertMsFull,
	flexTime,
	timeSinceDate
};

//Returns the given date: Wed Jul 28 1993
function systemDate(date) {
	return date.toDateString();
}

//Returns system time: 12:38
function systemTime(date) {
	let minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = '0' + minutes;
	}

	return date.getHours() + ':' + minutes + ':' + date.getSeconds();
}

//Returns a timestamp: Wed Jul 28 1993 - 12:38:00
function systemTimestamp(date) {
	if (!date) {
		this.date = new Date();
	}

	return flexTime(date);
}

//Returns a 'date-and-time' date obj
function flexTime(date) {
	if (!date) {
		const newFlex = DateTime.now().toLocaleString(DateTime.DATETIME_MED);

		return newFlex;
	}
	else {
		const newFlex = new DateTime(date.toISOString()).toLocaleString(DateTime.DATETIME_MED);

		return newFlex;
	}
}

function convertMs(ms) {
    ms = ms * -1;
    let hour, minute, seconds;

    seconds = Math.floor(ms / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
	minute = minute % 60;

	const day = Math.floor(hour / 24);

	hour = hour % 24;

    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}

function convertMsFull(ms) {
    ms = ms * -1;
    let hour, minute, seconds, day, month, year;

    seconds = Math.floor(ms / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
	minute = minute % 60;

	day = Math.floor(hour / 24);
	day = day % 24;

	month = Math.floor(day / 30);
	month = month % 30;

	year = Math.floor(month / 12);
	year = year % 12;

	hour = hour % 24;

    return `${year} Years, ${month} Months, ${day} Days, ${hour} Hrs, ${minute} Minutes, ${seconds} Seconds`;
}

//Returns a string of the time in Years, Months, Days, Hours, Minutes, Seconds since the date provided
function timeSinceDate(ms) {
	const date = new Date(ms);
	let impDate = DateTime.fromISO(date.toISOString());
	impDate = impDate.setZone('UTC-5');
	const now = DateTime.now().setZone('UTC-5');

	const diff = now.diff(impDate, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);
	const values = diff.values;


	return `${values.years} Years, ${values.months} Months, ${values.days} Days, ${values.hours} Hrs, ${values.minutes} Minutes, ${values.seconds} Seconds`;
}