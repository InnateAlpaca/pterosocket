/* remoteConsole
Based on easyRemoteConsole. Example of script for a console that shows stats info on the title bar
and makes sure that it is always possible to add input easily, even when the output overlaps what the user is adding.
*/

const { pterosocket } = require('pterosocket')
const readline = require('readline')

const origin = ""; // your panel's domain
const api_key = ""; // the api-key generated
const server_no = ""; // the number of the server

var commandSent = ""; // avoids command repetition in console

function setTerminalTitle(title){
    process.stdout.write(String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7));
}

const socket = new pterosocket(origin, api_key, server_no, false);

const consoleStream = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on('start', ()=>{
    console.log("Console connected!");
});

socket.on('console_output', (data)=>{ 
    if (commandSent==data)
        commandSent = "";
    else{
        process.stdout.clearLine(); // console log from line start (ignores user input)
        process.stdout.cursorTo(0);
        console.log(data)
        consoleStream.prompt(true) // leave the cursor in the same position
    }        
});

socket.on('close', ()=>{
    console.log("Console disconnected!");
});

socket.on('stats', (data)=>{
    setTerminalTitle(`console | cpu ${data.cpu_absolute.toFixed(2)}% | mem ${Math.round(data.memory_bytes/data.memory_limit_bytes*100)}% | ${data.state}`);
});

consoleStream.on('line', (input)=>{
    socket.writeCommand(input);
    commandSent = input;
});

console.log("****************** Remote Console ******************");
socket.connect();