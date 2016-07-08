"use strict";

var assert      = require('assert');
var MongoClient = require('mongodb').MongoClient;
var ObjectId    = require('mongodb').ObjectId;
var db          = require('../lib/db/MongoDB.js');

describe('db', function() {
    
    // db interface instance
    var dbInst = null;
    
    // separate mongo connection to verify data
    var dbCon = null;
    
    before(function(done) {
        dbInst = new db(null, null, 'test', 'localhost', 27017);

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

        dbCon.collection("games").remove({}, function(err) {
            if (err) done(err);
            dbCon.collection("players").remove({}, function(err) {
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
                dbCon.collection("games").count({}, function(err, res) {
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
                dbCon.collection("games").count({_id : new ObjectId(id)}, function(err, res) {
                    if (err) throw err;
                    assert.equal(res, 1);
                    done();
                });

            });

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
                dbCon.collection("users").count({}, function (err, res) {
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
                dbCon.collection("users").count({_id: new ObjectId(id)}, function (err, res) {
                    if (err) throw err;
                    assert.equal(res, 1);
                    done();
                });

            });
        });
    });


    after(function(done) {
        dbInst.close(function(err) {
            if (err) done(err);
            else dbCon.close(done);
        });
    });
	
});