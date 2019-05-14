const ical = require('icalendar');

function filterCalendar(iCalString) {

    let allholidays = ical.parse_calendar(iCalString);
    let events = allholidays.events();

    console.log(`Pre SA filter ${events.length} events`);
    events = events.filter(e => {

        // Keep events with blank descriptions or that contain SA
        let desc = e.properties.DESCRIPTION[0].value;
        let keepEvent = desc.trim() == "" || desc.indexOf('South Australia') >= 0;

        // if (!keepEvent) {
        //     console.log(`Removing ${e.properties.SUMMARY[0].value}`);
        //     console.log(`  Description: ${desc} \n`);
        // }
        return keepEvent;
    });

    // events.forEach(printEvent);
    console.log(`Post SA filter ${events.length} events remain`);

    // Create a new calendar
    var resultCalendar = new ical.iCalendar();
    events.forEach(e => resultCalendar.addComponent(e));
    return resultCalendar.toString();
}

function printEvent(event) {

    console.log("Summary:", event.properties.SUMMARY[0].value);
    console.log("   Time:", event.properties.DTSTART[0].value);
    console.log("   Desc:", event.properties.DESCRIPTION[0].value);
    console.log("----");
}

exports.filterCalendar = filterCalendar;