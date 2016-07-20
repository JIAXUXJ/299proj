//new
// IMPORTS
var express        = require('express');
var bodyparser     = require('body-parser');

var sessionManager = require('./lib/session/SessionManager.js');
var socketIO       = require('./lib/util/io.js');
var auth           = require('./lib/auth/auth.js');
var serverConfig   = require('./config.js').server;
var logger         = require('./lib/util/logger.js');

var app = express();

_staticdir = 'public';

// Security measure
app.disable('x-powered-by');

// Package middleware
app.use(bodyparser.urlencoded({extended: false }));
app.use(bodyparser.json());

// Application middleware
app.use(sessionManager);
app.use(auth);
app.use(express.static(_staticdir));

//initialize Socket.io
socketIO.init(app.server);

// catch requests to undefined URLs. keep this at the end!
app.get(/.*/, function(req, res) {
    res.status(404).send("Page not found.");
    
});

app.listen(serverConfig.PORT, function() {
    logger.info("Listening on port " + serverConfig.PORT);
});
