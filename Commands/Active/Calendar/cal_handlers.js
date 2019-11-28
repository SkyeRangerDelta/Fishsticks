//Calendar Handlers

const fs = require('fs');
const readline = require('readline');

//GOOGLE AUTH AND SENDS
const {google} = require('googleapis');
const {credentials, calendarID} = require('../../../Modules/Calendar/config.json');

//Check ID
if (!calendarID) calendarID = "primary";

//Define Scopes and Token
const SCOPE = ['https://www.googleapis.com/auth/calendar'];
const TOKEN = './Commands/Active/auth/googleAuthToken.json';

//Build the OAuth2 Object
async function authorize(credentials, msg) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const OAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
    );

    return new Promise((done, failed) => {
        fs.readFile(TOKEN, async (err, token) => {
            if (err) {
                //No token in file or error
                getAccessUrl(OAuth2Client, msg)
            }
            else {
                //Token does exist
                try {
                    OAuth2Client.setCredentials(JSON.parse(token));
                    done(OAuth2Client);
                } catch (error) {
                    getAccessUrl(OAuth2Client, msg);
                }
            }
        });
    });
}

//Get a new token and save it
async function getAccessUrl(OAuth2Client, msg) {
    const authURL = OAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPE,
    });

    msg.channel.send(`VALIDATION REQUIRED! Open this link to do so: ${authURL}\nReply to this message with '!token-key [your token]' to finish this process.`);
    msg.channel.send(`Event creation halted pending validation...`).then(sent => fishsticks.calendarAuthID = sent.id);
}

async function getAccessToken(code) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const OAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
    );

    return new Promise((done, failed) => {
        OAuth2Client.getToken(code, (err, token) => {
            if (err) failed(err)
            if (token === null) failed("Unknown/Invalid Token Key")

            //Store good token
            fs.writeFile(TOKEN, JSON.stringify(token), (err) => {
                if (err) failed(err)
                console.log("[EVENT] Token saved at ", TOKEN);
            });
            done("Authed!");
        });
    });
}

function listEvents(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    return new Promise((done, failed) => {
        calendar.events.list({
            calendarID,
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (err) failed("[EVENT] API No go: " + err)
            const events = res.data.items;

            if (events.lenth) {
                let eventString = 'Slated Events: \n';
                events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;
                    eventString += `\n${i+1}. ${event.summary} - ${start}   (id: ${event.id})`
                });
                done(eventString);
            }
            else {
                done("No slated events!");
            }
        });
    })
}

function createEvent(auth, event) {
    const calendar = google.calendar({version: 'v3', auth});

    return new Promise((done, failed) => {
        calendar.events.insert({
            auth: auth,
            calendarId: calendarID,
            resource: event
        }, function (err, newEvent) {
            if (err) {
                failed(`There was an API service error: ${err}`);
            }
            done(`Event created! ${newEvent.data.htmlLink}`);
        });
    });
}

function deleteEvent(auth, id) {
    const calendar = google.calendar({version: 'v3', auth});

    return new Promise((done, failed) => {
        calendar.events.delete({
            calendarID,
            eventId: id
        }, function(err) {
            if (err) {
                failed(`There was an API service error: ${err}`);
            }
            done(`Event deleted!`);
        });
    });
}

function globalize(id) {
    fishsticks.calendarAuthID = id;
}

module.exports = {
    authorize,
    credentials,
    listEvents,
    createEvent,
    deleteEvent,
    getAccessToken
}