"use strict";

/* 
 * MongoDB Interface
 */

//imports
var mongoClient = require('mongodb').MongoClient;
var ObjectId    = require('mongodb').ObjectId;
var DBInterface = require('./DBInterface.js');

//constants
var COLLECTION_USER = "users";
var COLLECTION_GAME = "games";

class MongoDB extends DBInterface {
    
    constructor(u, p, db, host, port) {
        
        super();
        
        this._user = u;
        this._password = p;
        this._dbName = db;
        this._host = host || "localhost";
        this._port = port || 27017;
        
        this._db = null;
        
        // state can be either CONNECTED or DISCONNECTED
        this._state = 'DISCONNECTED';
        
    }
    
    get state() { 
        return this._state;
    }
    
    /*
     * Sets up any connections or other data that may be needed to interact with
     * the database.  CALL THIS BEFORE MAKING ANY OTHER CALLS TO THIS CLASS.
     *
     * @param cb {function} Function to be called when the operation is complete.
     *     Takes an "error" parameter, which will be undefined if the operation is successful.
     */
    init(cb) {
        
        var thisObj = this;
        var mongoUrl = "mongodb://" + this._host + ":" + this._port + "/" + this._dbName;
        
        mongoClient.connect(
        
            mongoUrl, 
            
            function(err, db) {
                
                if (err) {
                    console.log("WARN: failed to connect to Mongo database (" + mongoUrl + ")");
                    console.log(err);
                    thisObj._db = null;
                    thisObj._state = 'DISCONNECTED';
                    
                    if (cb) cb(err);
                }
                else {
                    console.log("INFO: connected to Mongo database (" + mongoUrl + ")");
                    thisObj._db = db;
                    thisObj._state = 'CONNECTED';
                    
                    if (cb) cb();
                }
                
            }
        
        );
        
    }
    
    /*
     * Cleans up any connections or other data that may cause you grief when re-connecting
     * to the database later on. CALL THIS BEFORE TERMINATING THE APPPLICATION.
     *
     * @param cb {function} Function to be called when the operation is complete.
     */
    close(cb) {
        var thisObj = this;
        this._db.close(function(err, res) {
            if (cb && err) cb(err);

            console.log("Successfully disconnected from Mongo.");

            thisObj._db = null;
            thisObj._state = 'DISCONNECTED';

            if (cb) cb();
        });
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
        
        //TODO: verify data
        
        var collection = this._db.collection(COLLECTION_GAME);
        
        collection.insertOne(data, function(err, res) {
            
            if (err) {
                cb(null);
            }
            else {
                cb(res.insertedId);
            }
            
        });
        
    }
    
    /*
     * Updates information about a game by id.
     *
     * @param id {number} The id of the game to update in the database.
     * @param data {object} An object containing the fields to update and their new values.
     * @param cb {function} A function to be called when the operation completes.
     *      Takes a single boolean "success" parameter.
     *
     * @throws {Error} Thrown if an invalid  or non-existent field is specified in the input data.
     */
    updateGameById(id, data, cb) {
        
        // TODO: verify data
        
        var collection = this._db.collection(COLLECTION_GAME);
        
        collection.findOneAndUpdate({_id : new ObjectId(id)}, {$set : data}, function(err, r) {
            if (err) {
                cb(false);
            }
            else {
                cb(true);
            }
        });
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
        
		//TODO: verify move data
		
		var collection = this._db.collection(COLLECTION_GAME);
		
		collection.findOneAndUpdate({_id: new ObjectId(id)}, {$push : {moves : data}}, function(err, r) {
			
			if (err) {
				cb(false);
			}
			else if (r.value.State !== "ACTIVE") {
				throw new Error("Game is no longer active.  Moves should not be pushed!");
			}
			else {
				cb(true);
			}
			
		});
		
    }
    
    /*
     * Gets a game object by its id in the database.
     * 
     * @param id {number} The id number of the desired game.
     * @param cb {function} The function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be NULL if the operation fails.
     */
    getGameById(id, cb) {
        
        var collection = this._db.collection(COLLECTION_GAME);
        
        collection.find({_id: new ObjectId(id)}).limit(1).next(function(err, doc) {
            
            if (err) {
                cb(null);
            }
            else {
                cb(doc);
            }
            
        });
        
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
        
        //TODO: verify data
        
        var collection = this._db.collection(COLLECTION_USER);
        
        collection.insertOne(data, function(err, res) {
            
            if (err) {
                cb(null);
            }
            else {
                cb(res.insertedId);
            }
            
        });
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
        
        //TODO: verify data
        
        var collection = this._db.collection(COLLECTION_PLAYER);
        
        collection.findOneAndUpdate({_id : new ObjectId(id)}, {$set : data}, function(err, r) {
            if (err) {
                cb(false);
            }
            else {
                cb(true);
            }
        });
        
    }
    
    /*
     * Gets a player object by its id in the database.
     * 
     * @param id {number} The id number of the desired player.
     * @param cb {function} The function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be NULL if the operation fails.
     */
    getPlayerById(id, cb) {
        
        var collection = this._db.collection(COLLECTION_PLAYER);
        
        collection.find({_id: new ObjectId(id)}).limit(1).next(function(err, doc) {
            
            if (err) {
                cb(null);
            }
            else {
                cb(doc);
            }
            
        });
        
    }
    
}

module.exports = MongoDB;