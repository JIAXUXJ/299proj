"use strict";

/*
 * Database Interface - Functionality required for the application to
 * interact with a database or other method of storing information.
 *
 * The database should be able to store, edit and retrieve data on 
 * players, moves and games.
 *
 * Created by Charlie Friend <cdfriend@uvic.ca>.
 */

class DBInterface {
    
    /*
     * Sets up any connections or other data that may be needed to interact with
     * the database.  CALL THIS BEFORE MAKING ANY OTHER CALLS TO THIS CLASS.
     */
    init() {
        throw new Error("Interface method - not callable.");
    }
    
    /*
     * Cleans up any connections or other data that may cause you grief when re-connecting
     * to the database later on. CALL THIS BEFORE TERMINATING THE APPPLICATION.
     */
    close() {
        throw new Error("Interface method - not callable.");
    }
    
    /*
     * Saves a new game object in the database.
     * 
     * @param data {object} The game data to be saved.
     * @param cb {function} A function to be called when the operation is complete.
     *      Takes a single "id" parameter, which will be NULL if the operation fails.
     * 
     * @throws {Error} Thrown if the data passed does not match the "Game" schema detailed
     *                 in {@link ../../doc/game.json}.
     */
    newGame(data, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    /*
     * Updates information about a game by id.
     *
     * @param id {number} The id of the game to update in the database.
     * @param data {object} An object containing the fields to update and their new values.
     * @param cb {function} A function to be called when the operation completes.
     *      Takes a single boolean "success" parameter.
     *
     * @throws {Error} Thrown if an invalid or non-existent field is specified in the input data.
     */
    updateGameById(id, data, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    /*
     * Adds a move to an active game specified by its id.
     * 
     * @param id {number} The id number of the desired game in the database.
     * @param data {object} The move data to be added to the game.
     * @param cb {function} A function to be called when the operation completes/
     *      Takes a single boolean "success" parameter.
     * 
     * @throws {Error} Thrown if the move does not match the schema specified in 
     *                 {@link ../../doc/move.json} or if the game is no longer in
     *                 an ACTIVE state.
     */
    appendGameMoveById(id, data, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    /*
     * Gets a game object by its id in the database.
     * 
     * @param id {number} The id number of the desired game.
     * @param cb {function} The function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be NULL if the operation fails.
     */
    getGameById(id, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    /*
     * Gets game objects for which 'status' is 'done' (completed).
     * 
     * @param cb {function} The function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be NULL if the operation fails.
     */
    getDoneGames(cb) {
        throw new Error("Interface method - not callable.");
    }
    
    /*
     * Gets game objects for which 'status' is 'active' (ongoing).
     * 
     * @param cb {function} The function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be NULL if the operation fails.
     */
    getActiveGames(cb) {
        throw new Error("Interface method - not callable.");
    }
    
    /*
     * Saves a new player object in the database.
     * 
     * @param data {object} The game data to be saved.
     * @param cb {function} A function to be called when the operation is complete.
     *      Takes a single "id" parameter, which will be NULL if the operation fails.
     * 
     * @throws {Error} Thrown if the data passed does not match the "Player" schema detailed
     *                 in {@link ../../doc/user.json}.
     */
    newPlayer(data, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    /*
     * Updates information about a player by id.
     *
     * @param id {number} The id of the player to update in the database.
     * @param data {object} An object containing the fields to update and their new values.
     * @param cb {function} A function to be called when the operation completes.
     *      Takes a single boolean "success" parameter.
     *
     * @throws {Error} Thrown if an invalid or non-existent field is specified in the input data.
     */
    updatePlayerById(id, data, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    /*
     * Gets a player object by its id in the database.
     * 
     * @param id {number} The id number of the desired player.
     * @param cb {function} The function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be NULL if the operation fails.
     */
    getPlayerById(id, cb) {
        throw new Error("Interface method - not callable.");
    }

    /*
     * Gets data on all ACTIVE sessions from the database (i.e. players
     * which can be challenged).  Excludes the requesting session if provided.
     *
     * @param cb {function} Function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be an array of sessions
     *      or NULL if the operation fails.
     *
     * @param exclId {String} Id of the user requesting the data.  This session
     *                        will be excluded from the returned list.
     */
    getActiveSessions(cb, exclId) {
        throw new Error("Interface method - not callable.");
    }

    /*
     * Gets data on all WAITING sessions from the database (i.e. players
     * which are actively waiting for an opponent). Excludes the requesting
     * session if provided.
     *
     * @param cb {function} Function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be an array of sessions
     *      or NULL if the operation fails.
     *
     * @param exclId {String} Id of the user requesting the data.  This session
     *                        will be excluded from the returned list.
     */
    getWaitingSessions(cb) {
        throw new Error("Interface method - not callable.");
    }

    /*
     * Gets data on a single session by ID.
     *
     * @param id {int} The id of the desired session.
     * @param cb {function} Function to be called when the operation completes.
     *      Takes a single "data" parameter which will contain the session data
     *      in question or NULL if the operation fails.
     */
    getSessionById(id, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    /*
     * Set a session's associated account. Set it to NULL to make the session anon.
     *
     * @param id {int} The id of the desired session.
     * @param acct {ObjectID} the _id field of the associated account.
     * @param cb {function} The function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be NULL if the operation fails.
     */
    setSessionAccount(id, acct, cb) {
    	throw new Error("Interface method - not callable.");
    }
    
    /*
     * Gets a player object by its username. Warning! this may be slow - use sparingly.
     *
     * @param name {string} The username of the desired player.
     * @param cb {function} The function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be NULL if the operation fails.
     */
    getPlayerByUserName(name, cb) {
    	throw new Error("Interface method - not callable.");
    }
    
}

module.exports = DBInterface;
