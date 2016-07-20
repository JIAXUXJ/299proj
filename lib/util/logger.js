"use strict";

//imports
var dtUtils = require("./dateTimeUtils.js");

//constants
const CONSOLE_PRINT_ACTION = console.log;
const TIME_FORMAT = "[dd/mm/yy hr:mi:ss]";

/*
 * Logger: Singleton object which can be used to send messages from
 * various parts of the application at various severities.
 *
 * Severities:
 *     DEBUG:    For use only during development, no relevance during
 *               regular program function.
 *     INFO:     Messages sent from the application regarding its regular
 *               functions at runtime.
 *     WARNING:  Events at runtime that may cause adverse effects, but will
 *               not ultimately cause a failure of the program.
 *     CRITICAL: Events following which the program is no longer able to
 *               function.
 *
 * Written by Charlie Friend <cdfriend@uvic.ca>
 */
class Logger {

    /*
     * Creates a new logger object and defines its method of output.
     *
     * @param action {function} The method to be called which prints
     *                          a line of output to the log.
     */
    constructor(action) {
        this._action = action;
    }

    /*
     * Sends a message with DEBUG severity to the log.
     *
     * @param msg {String} Message to be sent to the log.
     */
    debug(msg) {
        var out = dtUtils.formatDateTime(new Date, TIME_FORMAT) +
                  " DEBUG: " + msg;
        this._action(out);
    }


    /*
     * Sends a message with INFO severity to the log.
     *
     * @param msg {String} Message to be sent to the log.
     */
    info(msg) {
        var out = dtUtils.formatDateTime(new Date, TIME_FORMAT) +
            " INFO: " + msg;
        this._action(out);
    }

    /*
     * Sends a message with WARNING severity to the log.
     *
     * @param msg {String} Message to be sent to the log.
     */
    warning(msg) {
        var out = dtUtils.formatDateTime(new Date, TIME_FORMAT) +
            " WARNING: " + msg;
        this._action(out);
    }

    /*
     * Sends a message with CRITICAL severity to the log.
     *
     * @param msg {String} Message to be sent to the log.
     */
    critical(msg) {
        var out = dtUtils.formatDateTime(new Date, TIME_FORMAT) +
            " CRITICAL: " + msg;
        this._action(out);
    }

}

// create logger singleton
var consoleLogger = new Logger(CONSOLE_PRINT_ACTION);

module.exports = consoleLogger;