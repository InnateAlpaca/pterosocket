const {pterosocket} = require('pterosocket')

const origin = "https://games.hosting.com"; // your panel's domain
const api_key = "dwaQaLKSWmVoZfJ7jC2rAnhW6y6mKAUPuF22bqqgA5daM79S"; // the api-key generated
const server_no = "194v3220"; // the number of the server

const socket = new pterosocket(origin, api_key, server_no);

socket.on("console_output", (packet)=>{
    console.log(packet)
})