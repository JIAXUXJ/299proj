/*
 * Server Configuration Module: provides data required by various modules
 * of the software to run in a particular configuration.  For example, the
 * module provides the location of the server's mongo database in both test
 * and deployment environments.
 *
 * Configuration types:
 *
 *     - TEST: For running the application on a local machine.
 *
 *     - DEPLOY: For running the application on the UVic engineering network.
 */

const CFG_NAME = 'TEST';

var data = {};

//Server Config
data.server = {};
data.server.PORT = 'DEPLOY' ? 30052 : 3000;

//DB Config
data.db = {};
data.db.HOST = 'localhost';
data.db.PORT = 27017;
data.db.NAME = CFG_NAME === 'DEPLOY' ? 'seng299group5' : 'test';
data.db.USER_COLLECTION = 'users';
data.db.GAME_COLLECTION = 'games';


module.exports = data;
