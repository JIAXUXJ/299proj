#!/usr/env/node

const TEST_DIR = 'test';

var spawn = require('child_process').spawn;
var Mocha = require('mocha');
var fs    = require('fs');
var path  = require('path');

// start test db
console.log('Starting mongo...');
const mongoProc = spawn('mongod', ['--dbpath', './testData', '--logpath', './testData/mongoLog.log']);

mongoProc.stderr.on('data', function(data) {
    console.log(data.toString('utf8'));
    console.log("Mongo error encountered. Exiting...");
    mongoProc.kill('SIGINT');
    process.exit(1);
});

mongoProc.on('exit', function() {
    console.log('Mongo exited.');
});

// wait to ensure mongo is active
setTimeout(function() {
    
    // get test files
    var mocha = new Mocha();

    fs.readdirSync(TEST_DIR).filter(function(file) {
        return file.substr(-3) == ".js";
    }).forEach(function(file) {
        mocha.addFile(path.join(TEST_DIR, file));
    });

    // run tests
    mocha.run().on('end', function() {
          
        //kill mongo
        mongoProc.kill('SIGINT');
        
    });
    
}, 2000);

