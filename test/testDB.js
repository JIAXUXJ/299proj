"use strict";

var assert      = require('assert');
var mongoServer = require('mongodb').Server;
var mongoDb     = require('mongodb').Db;
var db          = require('../lib/db/MongoDB.js');

describe('db', function() {
    
    //start test mongoDB server
    var server = new mongoDb('test', new mongoServer('localhost', 21707));
    
    var dbInst;
    
    beforeEach(function() {
         dbInst = new db(null, null, 'test', 'localhost', 21707);
         dbInst.init();
    });
    
    afterEach(function() {
        dbInst.close();
        dbInst = null;
    });

	describe('#init()', function() {
        
        it('should be CONNECTED after initialization', function() {
            assert.equal(db.state, 'CONNECTED');
        });
        
    });
	
});