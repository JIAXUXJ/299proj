"use strict";

//constants
const CONSOLE_PRINT_ACTION = console.log;

class Logger {

    constructor(action) {
        this.action = action;
    }

}

// create logger singleton
var consoleLogger = new Logger(CONSOLE_PRINT_ACTION);

module.exports = consoleLogger;