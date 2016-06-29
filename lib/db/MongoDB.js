/* 
 * MongoDB Interface
 */

var mongoClient = require('mongodb').MongoClient;
var DBInterface = require('./DBInterface.js');

class MongoDB extends DBInterface {
    
    constructor(u, p, db, host, port) {
        
        this._user = u;
        this._password = p;
        this._db = db;
        this._host = host || "localhost";
        this.port = port || 21707;
        
        this._db = null;
        
    }
    
}

module.exports = MongoDB;