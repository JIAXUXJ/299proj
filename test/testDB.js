"use strict";

var assert      = require('assert');
var mongoServer = require('mongodb').Server;
var mongoDb     = require('mongodb').Db;
var db          = require('../lib/db/MongoDB.js');

describe('db', function() {
    
    // db interface instance
    var dbInst = null;
    
    // separate mongo connection to verify data
    var dbCon = null;
    
    before(function(done) {
        dbInst = new db(null, null, 'test', 'localhost', 27017);
        dbInst.init(done);
    });
    
    after(function(done) {
        dbInst.close(done);
        dbInst = null;
    });

	describe('#init()', function() {
        
        it('should be CONNECTED after initialization', function() {
            assert.equal(dbInst.state, 'CONNECTED');
        });
        
    });
    
    describe('#newGame()', function() {
        
        it('should create a single game entry', function() {
            
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
            dbInst.newGame(gameData, function(id) {
                
                //VERIFY
                
            });

        });
        
    });
	
});