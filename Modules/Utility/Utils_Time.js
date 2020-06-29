// ---- Time Utility ----

//Imports

//Exports

module.exports = {
	systemDate,
	systemTime,
	systemTimestamp,
	convertMs,
	convertMsFull
};

function systemDate(date) {
	return date.toDateString();
}

function systemTime(date) {
	let minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = '0' + minutes;
	}

	return date.getHours() + ':' + minutes;
}

function systemTimestamp(date) {
	return systemDate(date) + ' - ' + systemTime(date);
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
    let hour, minute, seconds;

    seconds = Math.floor(ms / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
	minute = minute % 60;

	const day = Math.floor(hour / 24);

	hour = hour % 24;

    return `${day} Days, ${hour} Hrs, ${minute} Minutes, ${seconds} Seconds`;
}