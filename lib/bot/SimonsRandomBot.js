"use strict";

/*
 * Simon's Random Bot - implementation of the bot interface to interact
 * with Simon's Go AI.
 */

//IMPORTS
var http         = require('http');
var botConfig    = require('../../config.js').bot;
var BotInterface = require('./BotInterface.js');

class SimonsRandomBot extends BotInterface {

    /**
     * Sends a board state to the bot and defines a callback to
     * be used when it responds.
     *
     * @param boardState {Array[][]} The current board state.
     * @param cb {function(x, y, pass)} A function to be called when the operation completes.
     *      - Takes an object specifying the AI's response move. Fields are:
     *          x {int}: Number of squares from left side of the board.
     *          y {int}: Number of squares from the top of the board.
     *          pass {boolean}: Whether or not the AI chose to "pass" on its move.
     */
    move(boardState, cb) {

        var options = {
            host: botConfig.SIMONS_BOT_LOC,
            port: botConfig.SIMONS_BOT_PORT,
            path: botConfig.SIMONS_RANDOM_BOT_ROUTE,
            method: 'POST'
        };

        var data = {
            size: boardState.length,
            board: boardState,
            //TODO: last move x, y, c
        };

        var onDataRecieved = function(response) {

            var respData = '';

            response.on('data', function(chunk) {
                respData += chunk;
            });

            response.on('end', function(end) {

                if (respData === "Invalid request format.") {
                    throw new Error("Game sent invalid board state.");
                }

                var resp = JSON.parse(respData);
                cb(resp.x, resp.y, resp.pass);

            });

        };



    }

}

module.exports = SimonsRandomBot;