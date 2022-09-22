module.exports = function JustADate(initDate) {
    var utcMidnightDateObj = null
    // if no date supplied, use Now.
    if (!initDate)
        initDate = new Date();

    // if initDate specifies a timezone offset, or is already UTC, just keep the date part, reflecting the date _in that timezone_
    if (typeof initDate === "string" && initDate.match(/((\+|-)\d{2}:\d{2}|Z)$/gm)) {
        utcMidnightDateObj = new Date(initDate.substring(0, 10) + 'T00:00:00Z');
    } else {
        // if init date is not already a date object, feed it to the date constructor.
        if (!(initDate instanceof Date))
            initDate = new Date(initDate);
        // Vital Step! Strip time part. Create UTC midnight dateObj according to local timezone.
        utcMidnightDateObj = new Date(Date.UTC(initDate.getFullYear(), initDate.getMonth(), initDate.getDate()));
    }

    return {
        toISOString: () => utcMidnightDateObj.toISOString(),
        getUTCDate: () => utcMidnightDateObj.getUTCDate(),
        getUTCDay: () => utcMidnightDateObj.getUTCDay(),
        getUTCFullYear: () => utcMidnightDateObj.getUTCFullYear(),
        getUTCMonth: () => utcMidnightDateObj.getUTCMonth(),
        setUTCDate: (arg) => utcMidnightDateObj.setUTCDate(arg),
        setUTCFullYear: (arg) => utcMidnightDateObj.setUTCFullYear(arg),
        setUTCMonth: (arg) => utcMidnightDateObj.setUTCMonth(arg),
        addDays: (days) => {
            utcMidnightDateObj.setUTCDate(utcMidnightDateObj.getUTCDate + days)
        },
        toString: () => utcMidnightDateObj.toString(),
        toLocaleDateString: (locale, options) => {
            const options2 = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            options = options || options2;
            options.timeZone = "UTC";
            locale = locale || "en-EN";
            return utcMidnightDateObj.toLocaleDateString(locale, options)
        }
    }
}