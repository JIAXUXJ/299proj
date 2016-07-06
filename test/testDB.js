"use strict";

var assert      = require('assert');
var MongoClient = require('mongodb').MongoClient;
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
    
    after(function(done) {
        dbInst.close(function(err) {
            if (err) done(err);
            else dbCon.close(done);
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
        
    });
	
});