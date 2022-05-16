# pterosocket
A websocket implementation for the pterodactyl server console.

Pterosocket class creates a websocket that connects to a [Pterodactyl](https://pterodactyl.io/) panel. It manages the events generated, and keeps the connection open (re-authentication is needed every 10-15 min otherwise).
Using this tool you can easily implement a discord bot or webhook that streams the game-console through which you can send commands, check the logs, and even get the server stats in real time.

The official documentation for the Pterodactyl API can be found [here](https://dashflo.net/docs/api/pterodactyl/v1/).

## Usage
In order to connect you need to find the domain of your hosting panel (origin), the number of the server, and generate an API key form the "Account" section of the panel. Now you can subscribe the events you are interested in, and send packets to the panel.
```js
const { pterosocket } = require("pterosocket")

const origin = "https://games.hosting.com"; // your panel's domain
const api_key = "dwaQaLKSWmVoZfJ7jC2rAnhW6y6mKAUPuF22bqqgA5daM79S"; //the api-key generated
const server_no = "194v3220"; //the number of the server

const socket = new pterosocket(origin, api_key, server_no);

socket.on("start", ()=>{
    console.log("Connected!")
    socket.writeCommand("say console connected!");
})
```
