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
     * @param lastMove {Object} The last move made on the board. Should contain x, y, c and pass.
     * @param cb {function(x, y, pass)} A function to be called when the operation completes.
     *      - Takes an object specifying the AI's response move. Fields are:
     *          x {int}: Number of squares from left side of the board.
     *          y {int}: Number of squares from the top of the board.
     *          pass {boolean}: Whether or not the AI chose to "pass" on its move.
     */
    move(boardState, lastMove, cb) {

        //prepare request options and data
        var options = {
            host: botConfig.SIMONS_BOT_LOC,
            port: botConfig.SIMONS_BOT_PORT,
            path: botConfig.SIMONS_RANDOM_BOT_ROUTE,
            method: 'POST'
        };

        var data = {
            size: boardState.length,
            board: boardState,
            last: {
                x : lastMove.x,
                y : lastMove.y,
                c : lastMove.c,
                pass : lastMove.pass
            }
        };

        // prepare response callback
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

        var req = http.request(options, onDataRecieved);
        req.write(data);
        req.end;

    }

}

module.exports = SimonsRandomBot;