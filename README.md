# SENG 299 "Go" Project

A web application written in Node.js as part of the University of Victoria's software architecture class.  

## Server Setup

1. Clone the repository `git clone https://www.github.com/JIAXUXJ/299proj.git`
2. Enter the directory and run the environment setup script `npm run-script init-env-server`
3. Start the server using `npm run-script start`.
4. The server should now be running using a [forever.js](https://github.com/foreverjs/forever) process.  Stop it using `npm run-script stop`.
	* There have been some issues with forever not stopping a node process. If this happens, run `ps aux | grep node`, identify the process and kill it.
	
## Testing Locally

1. Clone the repository `git clone https://www.github.com/JIAXUXJ/299proj.git`
2. Install dependencies with `npm install`
3. Run the server locally using `node server.js`
	* This will run the server on your **local** node installation, which may not be the same as the app's deployment environment.
