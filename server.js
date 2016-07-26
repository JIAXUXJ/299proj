//new
// IMPORTS
var express        = require('express');
var bodyparser     = require('body-parser');
var http           = require('http');
var iolib          = require('socket.io');

var sessionManager = require('./lib/session/SessionManager.js');
var auth           = require('./lib/auth/auth.js');
var serverConfig   = require('./config.js').server;
var logger         = require('./lib/util/logger.js');
var matchmaking    = require('./lib/matchmaking/MatchmakingRouter.js');
var user           = require('./lib/other/userRouter.js');
var game           = require('./lib/game/gameRouter.js');
var review         = require('./lib/other/reviewRouter.js');

var app            = express();
var server         = http.Server(app);
var io          	 = iolib(server);

_staticdir = 'public';

// Security measure
app.disable('x-powered-by');

//initialize Socket.io - cannot put this in a separate file (who knows why).
io.on('connection', function(socket){
	socket.on('observe', function(data){
		logger.debug('Spectator registering to game ' + data.gid);
		socket.join(data.gid, function(err){
			if(err){
				logger.debug(err);
			} else {
				console.log(socket.rooms);
			}
		});	
	});
});

// Package middleware
app.use(bodyparser.urlencoded({extended: false }));
app.use(bodyparser.json());

// Application middleware
app.use(sessionManager);
app.use(express.static(_staticdir));

/***** ROUTES *****/

app.use(matchmaking);
app.use('/user', user);
app.use('/game', game);
app.use('/review', review);
app.use('/new', matchmaking);

/***** END ROUTES *****/

// catch requests to undefined URLs. keep this at the end!
app.get(/.*/, function(req, res) {
    res.status(404).send("Page not found.");
    
});

server.listen(serverConfig.PORT, function() {
    logger.info("Listening on port " + serverConfig.PORT);
});
