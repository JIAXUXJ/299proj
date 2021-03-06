"use strict";

/* 
 * MongoDB Interface - handles interaction between a Mongo database
 * and game functionality.
 *
 * Written by Charlie Friend <cdfriend@uvic.ca>
 */

//imports
var dbConfig    = require('../../config.js').db;
var mmConfig    = require('../../config.js').matchmaking;
var mongoClient = require('mongodb').MongoClient;
var ObjectId    = require('mongodb').ObjectId;
var DBInterface = require('./DBInterface.js');
var logger      = require('../util/logger.js');

//constants
var config = require('./../../config.js');

var MONGO_HOST = dbConfig.HOST;
var MONGO_PORT = dbConfig.PORT;
var DB_NAME = dbConfig.NAME;
var COLLECTION_USER = dbConfig.USER_COLLECTION;
var COLLECTION_GAME = dbConfig.GAME_COLLECTION;
var COLLECTION_SESSION = dbConfig.SESSION_COLLECTION;

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
                    logger.warning("failed to connect to Mongo database (" + mongoUrl + ")");
                    logger.warning(err);
                    thisObj._db = null;
                    thisObj._state = 'DISCONNECTED';
                    
                    if (cb) cb(err);
                }
                else {
                    logger.info("connected to Mongo database (" + mongoUrl + ")");
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

            logger.info("Successfully disconnected from Mongo.");

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
            	logger.debug('MongoDB/newGame:\n\t' + err);
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
        
        // Prevent "mod on _id" errors in mongo 2.x
        if(data._id){
        	delete data._id;
        }
        var collection = this._db.collection(COLLECTION_GAME);
        
        collection.findOneAndUpdate({_id : id}, {$set : data}, function(err, r) {
            if (err) {
            	logger.debug('MongoDB/updateGameById:\n\t' + err);
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
		
		collection.findOneAndUpdate({_id: id}, {$push : {moves : data}}, function(err, r) {
			
			if (err) {
				logger.debug('MongoDB/appendGameMoveById:\n\t' + err);
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
        
        collection.find({_id: id}).limit(1).next(function(err, doc) {
            
            if (err) {
            	logger.debug('MongoDB/getGameById:\n\t' + err);
                cb(null);
            }
            else {
                cb(doc);
            }
            
        });
        
    }
    
    /*
     * Gets game objects for which 'status' is 'done' (completed).
     * TODO: range limit the query.
     * 
     * @param cb {function} The function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be NULL if the operation fails.
     */
    getDoneGames(cb) {
        
        var collection = this._db.collection(COLLECTION_GAME);
        
        collection.find({State: "DONE"}).next(function(err, doc) {
            if (err) {
            	logger.debug('MongoDB/getDoneGames:\n\t' + err);
                cb(null);
            }
            else {
                cb(doc);
            }
            
        });
        
    }
    
    /*
     * Gets game objects for which 'status' is 'active' (ongoing).
     * TODO: range limit the query.
     * 
     * @param cb {function} The function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be NULL if the operation fails.
     */
    getActiveGames(cb) {
        
        var collection = this._db.collection(COLLECTION_GAME);
        
        collection.find({State: "ACTIVE"}).next(function(err, doc) {
            
            if (err) {
           		logger.debug('MongoDB/getActiveGames:\n\t' + err);
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
            	logger.debug('MongoDB/newPlayer:\n\t' + err);
                cb(null);
            }
            else {
            	logger.debug('MongoDB/newPlayer: good create:\n\t' + res);
                cb(res);
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
        
        var collection = this._db.collection(COLLECTION_USER);
        
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
        
        var collection = this._db.collection(COLLECTION_USER);
        
        collection.find({_id: id}).limit(1).next(function(err, doc) {
            
            if (err) {
                cb(null);
            }
            else {
                cb(doc);
            }
            
        });
        
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

        var collection = this._db.collection(COLLECTION_SESSION);

        var data = [];

        var cursor = collection.find({"_id" : {$ne : exclId}}, {"_id" : 0, "expires" : 0});

        cursor.each(function(err, doc) {
            if (doc != null) {
                var sessData = JSON.parse(doc.session);
                if (sessData.gameState == mmConfig.playerStates.ACTIVE) {
                    data.push(sessData);
                }
            }
            else if (err) {
                logger.warning(err);
                cb(null);
            }
            else {
                cb(data);
            }
        });

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
    getWaitingSessions(cb, exclId) {

        var collection = this._db.collection(COLLECTION_SESSION);

        var data = [];

        var cursor = collection.find({"_id" : {$ne : exclId}}, {"_id" : 0, "expires" : 0});

        cursor.each(function(err, doc) {
            if (doc != null) {
                var sessData = JSON.parse(doc.session);
                if (sessData.gameState == mmConfig.playerStates.WAITING) {
                    data.push(sessData);
                }
            }
            else if (err) {
                logger.warning(err);
                cb(null);
            }
            else {
                cb(data);
            }
        });
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

        var collection = this._db.collection(COLLECTION_SESSION);

        collection.find({_id: id}).limit(1).next(function(err, data) {
            if (err) {
            	logger.warn(err);
                cb(null);
            }
            else {
                cb(data);
            }
        });

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
    	var collection = this._db.collection(COLLECTION_SESSION);
    	collection.updateOne({_id: id}, {$set: { account : acct }}, function(err, data) {
    		if(err){
    			cb(null);
    		} else {
    			cb(data);
    		}
    	});
    }
    
    /*
     * Gets a player object by its username. Warning! this may be slow - use sparingly.
     *
     * @param name {string} The username of the desired player.
     * @param cb {function} The function to be called when the operation completes.
     *      Takes a single "data" parameter, which will be NULL if the operation fails.
     */
    getPlayerByUserName(uname, cb) {
    	var collection = this._db.collection(COLLECTION_USER);
    	collection.find({UserName: uname}).limit(1).next(function(err, doc) {
    		if(err){
    			logger.debug('MongoDB/getPlayerByUserName:\n\t' + err);
    			cb(null);
    		} else {
    			cb(doc);
    		}
    	});
    }
}

var mongoInst = new MongoDB(null, null, DB_NAME, MONGO_HOST, MONGO_PORT);
mongoInst.init();

module.exports = mongoInst;

