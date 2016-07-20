"use strict";

var assert      = require('assert');
var dbConfig    = require('../config.js').db;
var MongoClient = require('mongodb').MongoClient;
var ObjectId    = require('mongodb').ObjectId;
var db          = require('../lib/db/MongoDB.js');

describe('db', function() {

    const COLLECTION_GAME = dbConfig.GAME_COLLECTION;
    const COLLECTION_USER = dbConfig.USER_COLLECTION;
    
    // db interface instance
    var dbInst = null;
    
    // separate mongo connection to verify data
    var dbCon = null;

    before(function(done) {
        dbInst = db;

        MongoClient.connect("mongodb://localhost:27017/test", function(err, db) {
            if (err) {
                done(err);
            }
            else {
                dbCon = db;
                dbInst.init(done);
            }
        });

    });

    // start each test with a clean collection
    beforeEach(function(done) {

        dbCon.collection(COLLECTION_GAME).remove({}, function(err) {
            if (err) done(err);
            dbCon.collection(COLLECTION_USER).remove({}, function(err) {
                if (err) done(err);
                else done();
            });
        });


    });

	describe('#init()', function() {
        
        it('should be CONNECTED after initialization', function() {
            assert.equal(dbInst.state, 'CONNECTED');
        });
        
    });
    
    describe('#newGame()', function() {
        
        it('should create a single game entry', function(done) {
            
            // SETUP
            var gameData = {          
              "gameID": "",
              "TimeStart": new Date(),
              "TimeEnd": new Date(),
              "BoardSize": 9,
              "moves": [],
              "PWhiteId": 0,
              "PBlackId": 1,
              "State": 'ACTIVE',
            };
            
            // EXEC
            dbInst.newGame(gameData, function() {
                
                //VERIFY
                dbCon.collection(COLLECTION_GAME).count({}, function(err, res) {
                    if (err) throw err;
                    assert.equal(res, 1);
                    done();
                });

            });

        });

        it('should return a valid game id', function(done) {

            var gameData = {
                "gameID": "",
                "TimeStart": new Date(),
                "TimeEnd": new Date(),
                "BoardSize": 9,
                "moves": [],
                "PWhiteId": 0,
                "PBlackId": 1,
                "State": 'ACTIVE',
            };

            // EXEC
            dbInst.newGame(gameData, function(id) {

                //VERIFY
                dbCon.collection(COLLECTION_GAME).count({_id : new ObjectId(id)}, function(err, res) {
                    if (err) throw err;
                    assert.equal(res, 1);
                    done();
                });

            });

        });
        
    });

    describe('#updateGameById()', function() {

        it('should update specified fields in a document', function(done) {

            //SETUP
            var gameData = {
                "gameID": "",
                "TimeStart": new Date(),
                "TimeEnd": new Date(),
                "BoardSize": 9,
                "moves": [],
                "PWhiteId": 0,
                "PBlackId": 1,
                "State": 'ACTIVE',
            };

            var updateData = {
                "PWhiteId": 5,
                "PBlackId": 6
            };

            dbInst.newGame(gameData, function(id) {

                //EXEC
                dbInst.updateGameById(id, updateData, function(success) {

                    //VERIFY
                    dbCon.collection(COLLECTION_GAME).find({_id: new ObjectId(id)}).limit(1).next(function(err, doc) {
                        assert.equal(doc.PWhiteId, 5);
                        assert.equal(doc.PBlackId, 6);
                        done();
                    });

                });

            });

        });

        //TODO: should throw an error if invalid field is updated

        //TODO: should throw an error if invalid game id is specified

    });

    describe('#getGameById()', function() {

        it('should return the a game object with the specified id', function(done) {

            var gameData = {
                "TimeStart": new Date(),
                "TimeEnd": new Date(),
                "BoardSize": 9,
                "moves": [],
                "PWhiteId": 0,
                "PBlackId": 1,
                "State": 'ACTIVE',
            };

            dbInst.newGame(gameData, function(id) {

                if (id === null)
                    throw new Error('Insert operation failed');

                dbInst.getGameById(id, function(data) {

                    //id match
                    assert.equal(id, data._id.toHexString());

                    //fields match
                    for (var key in gameData) {
                        assert.deepEqual(data[key], gameData[key]);
                    }

                    done();

                });

            });

            //TODO: edge cases

        });

    });

    describe('#newPlayer()', function() {

        it('should create a single player entry', function(done) {

            // SETUP
            var playerData = {
                "userName": "jim10",
                "pwHash": "foobar",
                "games": [],
                "NumWins": 10,
                "NumLosses": 10
            };

            // EXEC
            dbInst.newPlayer(playerData, function () {

                //VERIFY
                dbCon.collection(COLLECTION_USER).count({}, function (err, res) {
                    if (err) throw err;
                    assert.equal(res, 1);
                    done();
                });

            });

        });

        it('should return a valid player id', function(done) {

            // SETUP
            var playerData = {
                "userName": "jim10",
                "pwHash": "foobar",
                "games": [],
                "NumWins": 10,
                "NumLosses": 10
            };

            // EXEC
            dbInst.newPlayer(playerData, function (id) {

                //VERIFY
                dbCon.collection(COLLECTION_USER).count({_id: new ObjectId(id)}, function (err, res) {
                    if (err) throw err;
                    assert.equal(res, 1);
                    done();
                });

            });
        });
    });

    describe('#updatePlayerById()', function() {

        it('should update specified fields in a document', function(done) {

            //SETUP
            var playerData = {
                "userName": "jim10",
                "pwHash": "foobar",
                "games": [],
                "NumWins": 10,
                "NumLosses": 10
            };

            var updateData = {
                "NumWins": 15,
                "NumLosses": 16
            };

            dbInst.newPlayer(playerData, function(id) {

                //EXEC
                dbInst.updatePlayerById(id, updateData, function(success) {

                    //VERIFY
                    dbCon.collection(COLLECTION_USER).find({_id: new ObjectId(id)}).limit(1).next(function(err, doc) {
                        assert.equal(doc.NumWins, 15);
                        assert.equal(doc.NumLosses, 16);
                        done();
                    });

                });

            });

        });

        //TODO: should throw an error if invalid field is updated

        //TODO: should throw an error if invalid player id is specified

    });

    describe('#getPlayerById()', function() {

        it('should return a player object with the specified id', function (done) {

            var playerData = {
                "userName": "jim10",
                "pwHash": "foobar",
                "games": [],
                "NumWins": 10,
                "NumLosses": 10
            };

            dbInst.newPlayer(playerData, function (id) {

                if (id === null)
                    throw new Error('Insert operation failed');

                dbInst.getPlayerById(id, function (data) {

                    //id match
                    assert.equal(id, data._id.toHexString());

                    //fields match
                    for (var key in playerData) {
                        assert.deepEqual(data[key], playerData[key]);
                    }

                    done();

                });

            });

            //TODO: edge cases

        });

    });

    after(function(done) {
        dbInst.close(function(err) {
            if (err) done(err);
            else dbCon.close(done);
        });
    });
	
});