"use strict";

/*
 * Date/Time Utils: assorted functions for formatting and handling
 * Javascript's Date object.
 *
 * Written by Charlie Friend <cdfriend@uvic.ca>
 */

/*
 * Abbreviations for creating date and time formats to render into
 * strings.
 */
const DT_ABBREVS = {
    DAY : "dd",
    MONTH : "mm",
    YEAR : "yy",
    HOUR : "hr",
    MINUTE: "mi",
    SECOND: "ss",
    MILLISECOND: "ms"
};

/*
 * Renders a specified date and/or time to a string in the
 * specified format.  Replaces the specified string abbreviations
 * with their respective values.
 *
 * @param date {Date} The date to render.
 * @param format {String} The format to render the date into.
 *      Hours, minutes, seconds, etc. should correspond to their
 *      respective abbreviations in @see DT_ABBREVS.
 */
function formatDateTime(date, format) {
    var out = format;
    return out.replace(DT_ABBREVS.DAY, date.getDay())
        .replace(DT_ABBREVS.MONTH, date.getMonth())
        .replace(DT_ABBREVS.YEAR, date.getFullYear())
        .replace(DT_ABBREVS.HOUR, date.getHours())
        .replace(DT_ABBREVS.MINUTE, date.getMinutes())
        .replace(DT_ABBREVS.SECOND, date.getSeconds())
        .replace(DT_ABBREVS.MILLISECOND, date.getMilliseconds());
}

module.exports = {
    formatDateTime: formatDateTime
};