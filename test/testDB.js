"use strict";

var assert      = require('assert');
var mongoServer = require('mongodb').Server;
var mongoDb     = require('mongodb').Db;
var db          = require('../lib/db/MongoDB.js');

describe('db', function() {
    
    //start test mongoDB server
    var server = new mongoDb('test', new mongoServer('localhost', 27017));
    
    var dbInst = null;
    
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
	
});