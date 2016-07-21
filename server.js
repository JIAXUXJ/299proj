//new
// IMPORTS
var express        = require('express');
var bodyparser     = require('body-parser');

var sessionManager = require('./lib/session/SessionManager.js');
var auth           = require('./lib/auth/auth.js');
var socketIO       = require('./lib/util/io.js');
var auth           = require('./lib/auth/auth.js');
var serverConfig   = require('./config.js').server;
var logger         = require('./lib/util/logger.js');
var matchmaking    = require('./lib/matchmaking/MatchmakingRouter.js');
var user           = require('./lib/aux/userRouter.js');
//var game           = require('./lib/game/gameRouter.js');
var review         = require('./lib/aux/reviewRouter.js');

var app = express();

_staticdir = 'public';

// Security measure
app.disable('x-powered-by');

// Package middleware
app.use(bodyparser.urlencoded({extended: false }));
app.use(bodyparser.json());

// Application middleware
app.use(sessionManager);
app.use(express.static(_staticdir));

//initialize Socket.io
socketIO.init(app.server);

/***** ROUTES *****/

app.use(matchmaking);
app.use('/user', user);
//app.use('/game', game);
app.use('/review', review);

/***** END ROUTES *****/

// catch requests to undefined URLs. keep this at the end!
app.get(/.*/, function(req, res) {
    res.status(404).send("Page not found.");
    
});

app.listen(serverConfig.PORT, function() {
    logger.info("Listening on port " + serverConfig.PORT);
});
