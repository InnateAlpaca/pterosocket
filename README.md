# pterosocket
A websocket implementation for the pterodactyl server console.

Pterosocket class creates a websocket that connects to a [Pterodactyl](https://pterodactyl.io/) panel. It manages the events generated, and keeps the connection open (re-authentication is needed every 10-15 min otherwise).
Using this tool you can easily implement a discord bot or webhook that streams the game-console through which you can send commands, check the logs, and even get the server stats in real time.

Check the [Documentation](https://github.com/InnateAlpaca/pterosocket/blob/main/Documentation.md) for details on the usage of this class.
The original documentation for the Pterodactyl API protocol can be found [here](https://dashflo.net/docs/api/pterodactyl/v1/).
## Installation
Run the following line in your terminal:
```
npm install pterosocket
```
## Usage
In order to connect you need to find the domain of your hosting panel (origin), the number of the server, and generate an API key form the "Account" section of the panel. Now you can subscribe the events you are interested in, and send packets to the panel.
```js
const { pterosocket } = require('pterosocket')

const origin = "https://games.hosting.com"; // your panel's domain
const api_key = "dwaQaLKSWmVoZfJ7jC2rAnhW6y6mKAUPuF22bqqgA5daM79S"; //the api-key generated
const server_no = "194v3220"; //the number of the server

const socket = new pterosocket(origin, api_key, server_no);

socket.on("start", ()=>{
    console.log("Connected!")
    socket.writeCommand("say console connected!");
})
```
### How do I find the parameters needed to create a new pterosocket?
Regardless the hosting company your server is hosted by, each panel has a fixed structure. For example the webpage from which you access your console will have this format: 
```{origin}/server/{server number}```. So, if your hosting company is e.g. ```www.bisecthosting.com``` (one of several gaming companies), your console website address will be ```https://games.bisecthosting.com/server/274w3925```, and your code will be as follows
```js
const origin = "https://games.bisecthosting.com"; //everything that comes before "/server" in the console url
const server_no = "274w3925"; //everything that comes after "/server/" in the console url
```
Now in order to generate an API key for the pterosocket instance you need to navigate to this page ```{origin}/account/api``` (in our example it will be ```https://games.bisecthosting.com/account/api```) and generate a new API key, which we can add to our code.
```js
const api_key = "dwaQaLKSWmVoZfJ7jC2rAnhW6y6mKAUPuF22bqqgA5daM79S"; //the api-key generated
```

