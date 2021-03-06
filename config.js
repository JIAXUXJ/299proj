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

const CFG_NAME = process.env.SENG299GO_CONFIG || 'TEST';

var data = {};

//Server Config
data.server = {};
data.server.PORT = CFG_NAME === 'DEPLOY' ? 30052 : 3000;

//DB Config
data.db = {};
data.db.HOST = 'localhost';
data.db.PORT = 27017;
data.db.NAME = CFG_NAME === 'DEPLOY' ? 'seng299group5' : 'test';
data.db.USER_COLLECTION = 'users';
data.db.GAME_COLLECTION = 'games';
data.db.SESSION_COLLECTION = 'sessions';

//Matchmaking Config
data.matchmaking = {};
data.matchmaking.RANDOM_WAIT_TIMEOUT = 10000;
data.matchmaking.CHALLENGE_TOPIC = 'challenge';
data.matchmaking.playerStates = {
    ACTIVE: 'ACTIVE',
    WAITING: 'WAITING',
    IN_GAME: 'IN_GAME'
};

//Bot Config
data.bot = {};
data.bot.SIMONS_BOT_LOC = "http://roberts.seng.uvic.ca";
data.bot.SIMONS_BOT_PORT = 30000;
data.bot.SIMONS_RANDOM_BOT_ROUTE = "/ai/random";

module.exports = data;
