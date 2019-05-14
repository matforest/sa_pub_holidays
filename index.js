console.log('Running calendar stuff');

const https = require('https');
const filter = require('./lib/filter')

let holidayUrl = "https://calendar.google.com/calendar/ical/en.australian%23holiday%40group.v.calendar.google.com/public/basic.ics";

https.get(holidayUrl, (incomingMessage) => {
    console.log('Get completed');

    incomingMessage.setEncoding('UTF-8');
    let rawData = '';
    incomingMessage.on('data', (chunk) => { rawData += chunk; });
    incomingMessage.on('end', () => {
        try {
            console.log(`Message ended`);
            filter.filterCalendar(rawData);
        } catch (e) {
            console.error('Error!', e.message, e);
        }
    });
});

