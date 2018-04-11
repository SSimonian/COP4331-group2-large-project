# COP4331-group2-large-project
COP4331 group 2's large project repository.

Project Requirements:

	Remote database
	Use any stack, but WISA, Lamp, and MEAN are preferred.
	Use JSon to communicate between client and server.
	You can use a web page, a windows program, or an andriod/iOS app as the client.
	(A web page must be AJAX enabled.)
	The product can be of your choice.
	Make sure that when you decide what to do that it is reasonable in the time that you have.

RUN:

	Preliminaries:
		- Install NodeJs, current or LTS version is acceptable. https://nodejs.org/en/

	Instructions:
		1. Open terminal or console and navigate to the cop4331-group2-large-project directory.
		2. Once inside, type: node server.js
		3. Execute command. If done correctly, the output should read: "Server is running on port: <PORT#>"
		4. Server is now running on http://localhost:<PORT#>
		5. Visit webpage or Curl API (see below documentation).
		6. To stop the server, press ctrl + c.

	Connecting to the Mongo Cloud Database:
		* If you have the database password stored as an environment variable, you may skip this section.

		1. Navigate to the app.js and locate the line: const dbPassword = process.env.ATLAS_PW;
		2. Edit the righthand side of the equals sign to have the 'cruder' password.

		If the password is not correct or it's not set to an environment variable (must be ATLAS_PW), your terminal should display a message similar to this:

			Unhandled rejection MongoError: authentication fail
			    at D:\UCF\COP4331\COP4331-group2-large-project\node_modules\mongodb-core\lib\topologies\replset.js:1440:15
			    at D:\UCF\COP4331\COP4331-group2-large-project\node_modules\mongodb-core\lib\connection\pool.js:874:7
			    at D:\UCF\COP4331\COP4331-group2-large-project\node_modules\mongodb-core\lib\connection\pool.js:850:20
			    at finish (D:\UCF\COP4331\COP4331-group2-large-project\node_modules\mongodb-core\lib\auth\scram.js:174:16)
			    at handleEnd (D:\UCF\COP4331\COP4331-group2-large-project\node_modules\mongodb-core\lib\auth\scram.js:184:7)
			    at D:\UCF\COP4331\COP4331-group2-large-project\node_modules\mongodb-core\lib\auth\scram.js:289:15
			    at D:\UCF\COP4331\COP4331-group2-large-project\node_modules\mongodb-core\lib\connection\pool.js:541:18
			    at _combinedTickCallback (internal/process/next_tick.js:131:7)
			    at process._tickCallback (internal/process/next_tick.js:180:9)

API:

	To CURL the web server's API, use an application that sends different types of HTTP requests. Our recommendation is Postman (https://www.getpostman.com/). Other viable options include  Insomnia (https://insomnia.rest/), a web browser extension, or CURL Unix command from a terminal/console. It does not really matter which program you choose as they all perform similar functions. 

	Instead of listing all of the API endpoints and their requirements (as these will change as we develop the server), please visit the api/routes directory and read through the router functions of each file. Most of the files are contains functions for GET requests to display webpages, with the exception of users.js and documents.js. These two files include example requests. 

	Here's the users/login POST route example:
		{
        	"user_name": "admin",
        	"password": "5f4dcc3b5aa765d61d8327deb882cf99"
    	}