console.log('Running calendar stuff');

const ical = require('icalendar');
const https = require('https');

let holidayUrl = "https://calendar.google.com/calendar/ical/en.australian%23holiday%40group.v.calendar.google.com/public/basic.ics";

https.get(holidayUrl, (incomingMessage) => {
    console.log('Get completed');

    incomingMessage.setEncoding('UTF-8');
    let rawData = '';
    incomingMessage.on('data', (chunk) => { rawData += chunk; });
    incomingMessage.on('end', () => {
        try {
            console.log(`Message ended`);
            filterCalendar(rawData);
        } catch (e) {
            console.error('Error!', e.message, e);
        }
    });
});

// TODO move to its own module
function filterCalendar(iCalString) {

    console.log('\nParsing');

    let allholidays = ical.parse_calendar(iCalString);
    let events = allholidays.events();

    console.log(`Pre SA filter ${events.length} events`);
    events = events.filter(e => {
        
        //
        let desc = e.properties.DESCRIPTION[0].value;
        let filter = desc.indexOf('South Australia') >= 0;
        if (!filter) {
            filter = desc == "";
        }
        if (!filter) {
            console.log(`Removing ${e.properties.SUMMARY[0].value}`);
            console.log(`  Description: ${desc} \n`);
        }
        return filter;
    });
    events.forEach(printEvent);

    console.log(`Post SA filter ${events.length} events remain`);
}

function printEvent(event) {

    console.log("Summary:", event.properties.SUMMARY[0].value);
    console.log("   Time:", event.properties.DTSTART[0].value);
    console.log("   Desc:", event.properties.DESCRIPTION[0].value);
    console.log("----");
}