# SENG 299 "Go" Project

A web application written in Node.js as part of the University of Victoria's software architecture class.  

## Server Setup (forever.js)

1. Clone the repository `git clone https://www.github.com/JIAXUXJ/299proj.git`
2. Enter the directory and run the environment setup script `npm run-script init-env-server`
3. Start the server using `npm run-script start`.
4. The server should now be running using a [forever.js](https://github.com/foreverjs/forever) process.  Stop it using `npm run-script stop`.
	* There have been some issues with forever not stopping a node process. If this happens, run `ps aux | grep node`, identify the process and kill it.
	
## Running Locally

Before running locally, ensure you have MongoDB installed and on your $PATH.

1. Clone the repository `git clone https://www.github.com/JIAXUXJ/299proj.git`
2. Install dependencies with `npm install`
3. In a **separate** terminal window, navigate to the project folder and run:
    * `mkdir testData` - create directory to store temporary mongo data
    * `mongod --dbpath testData` - start a mongo instance
4. Run the server locally using `node server.js`
	* This will run the server on your **local** node installation, which may not be the same as the app's deployment environment.

## Running Unit Tests

This app uses the Mocha framework for unit testing. In order to run tests, you will need the following dependencies.

1. The `mongod` executable on your $PATH (to test this, just type `mongod` into the command line).
2. All application dependencies installed, `npm install`.

To run tests, run `npm test` or follow the steps below:

1. Make a directory for mongo test data and logs:
    * `mkdir testData`
2. Open a separate command line window and run `mongod`, directing its logs and data to the new directory
    * `mongod --dbpath ./testData --logpath ./testData/mongoLog.log`
3. Run mocha with mongo running in the background:
    * `node ./node_modules/mocha/bin/mocha`

For the sake of your own sanity, I highly recommend just running `npm test`.
