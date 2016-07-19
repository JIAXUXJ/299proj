"use strict";

/*
 * Simon's Random Bot - implementation of the bot interface to interact
 * with Simon's Go AI.
 */

//IMPORTS
var BotInterface = require('./BotInterface.js');

class SimonsRandomBot extends BotInterface {

    /**
     * Sends a board state to the bot and defines a callback to
     * be used when it responds.
     *
     * @param boardState {Array[][]} The current board state.
     * @param cb {function(x, y)} A function to be called when the operation completes.
     *      - Takes two parameters, "x" and "y", specifying the bot's move position from
     *        the top and left sides of the board, respectively.
     */
    move(boardState, cb) {
        throw new Error("Not implemented yet.");
    }

}

module.exports = SimonsRandomBot;