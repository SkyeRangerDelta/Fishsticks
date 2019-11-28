//Calendar Events

const convertTime = require('convert-time');
const {authorize, listEvents, credentials, createEvent, deleteEvent, getAccessToken} = require('./cal_handlers.js');

let auth;

async function ListEvents(msg) {
    msg.channel.send("Hold a moment while I scribble this down...");
    if (!auth) {
        try {
            auth = await authorize(credentials, msg);
        } catch (error) {
            return error;
        }
    }

    try {
        return await listEvents(auth);
    } catch (error) {
        return error;
    }
}

async function CreateEvent(event, msg) {
    msg.channel.send("Creating new event...");
    if(!auth) {
        try {
            auth = await authorize(credentials, msg);
        } catch (error) {
            return error;
        }
    }

    try {
        return await createEvent(auth, event);
    } catch (error) {
        return error;
    }
}

async function handleCreateEvent(event, msg) {
    eventDetails = {
        description: event.description,
        summary: event.name,
        start: {dateTime: event.startTime},
        end: {dateTime: event.endTime}
    }

    try {
        return await CreateEvent(eventDetails, msg);
    } catch (error) {
        return error;
    }
}

async function DeleteEvent(content, msg) {
    msg.channel.send("Trying to remove event...");
    if (!auth) {
        try {
            auth = await authorize(credentials, msg);
        } catch (error) {
            return error;
        }
    }

    try {
        return await deleteEvent(auth, content);
    } catch (error) {
        return error;
    }
}

async function handleTokenKey(tokenKey, msg) {
    if (auth) {
        return "Already Authed!"
    }

    try {
        return await getAccessToken(tokenKey);
    } catch (error) {
        return error;
    }
}

module.exports = {
    ListEvents,
    CreateEvent,
    handleCreateEvent,
    DeleteEvent,
    handleTokenKey
}