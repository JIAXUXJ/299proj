"use strict";

//imports
var dtUtils = require("./dateTimeUtils.js");

//constants
const CONSOLE_PRINT_ACTION = console.log;
const TIME_FORMAT = "[dd/mm/yy hr:mi:ss]";

class Logger {

    constructor(action) {
        this._action = action;
    }

    debug(msg) {
        var out = dtUtils.formatDateTime(new Date, TIME_FORMAT) +
                  " DEBUG: " + msg;
        this._action(out);
    }

    info(msg) {
        var out = dtUtils.formatDateTime(new Date, TIME_FORMAT) +
            " INFO: " + msg;
        this._action(out);
    }

    warning(msg) {
        var out = dtUtils.formatDateTime(new Date, TIME_FORMAT) +
            " WARNING: " + msg;
        this._action(out);
    }

    critical(msg) {
        var out = dtUtils.formatDateTime(new Date, TIME_FORMAT) +
            " CRITICAL: " + msg;
        this._action(out);
    }

}

// create logger singleton
var consoleLogger = new Logger(CONSOLE_PRINT_ACTION);

module.exports = consoleLogger;