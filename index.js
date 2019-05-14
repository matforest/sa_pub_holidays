console.log('Running calendar stuff');

var express = require('express');
var app = express();

const https = require('https');
const filter = require('./lib/filter')

app.get("/calendar/saholidays", sendSACalendar);
function sendSACalendar(req, res) {

    let holidayUrl = "https://calendar.google.com/calendar/ical/en.australian%23holiday%40group.v.calendar.google.com/public/basic.ics";
    https.get(holidayUrl, (incomingMessage) => {

        incomingMessage.setEncoding('UTF-8');
        let rawData = '';
        incomingMessage.on('data', (chunk) => {
            rawData += chunk;
        });
        incomingMessage.on('end', () => {
            try {
                let saCalendar = filter.filterCalendar(rawData);
                res.send(saCalendar);
            } catch (e) {
                console.error('Error!', e.message, e);
            }
        });
    });
}


// TESTING FIXME
app.get('/', (req, res) => {
    res.send('ok');
});

let port = process.argv[2];
let httpServer = app.listen(port, function () {
    console.log("Listening on port " + port);
});

process.on('exit', function () {
    console.log('About to close');
    httpServer.close();
});

