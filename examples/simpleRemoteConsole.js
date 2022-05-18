const { pterosocket } = require('pterosocket')
const readline = require('readline')

const origin = ""; // your panel's domain
const api_key = ""; // the api-key generated
const server_no = ""; // the number of the server

var commandSent = false; // avoids command repetition in console

const socket = new pterosocket(origin, api_key, server_no, false);

const consoleStream = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

socket.on('start', ()=>{
    console.log("Console connected!")
});

socket.on('console_output', (data)=>{
    if (!commandSent)
        console.log(data)
    else   
        commandSent = false;
});

socket.on('close', ()=>{
    console.log("Console disconnected!");
});

consoleStream.on('line', (input)=>{
    socket.writeCommand(input);
    commandSent = true;
});

console.log("****************** Remote Console ******************");
socket.connect();