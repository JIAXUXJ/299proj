"use strict";

/*
 * Bot Interface - Functionality required to get conduct a
 * Go game with an AI player.
 *
 * Written by Charlie Friend <cdfriend@uvic.ca>
 */

class BotInterface {

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
        throw new Error("Interface method - not callable.");
    }

}

module.exports = BotInterface;