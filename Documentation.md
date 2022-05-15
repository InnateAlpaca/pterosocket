# Documentation
Here a list of methods and events emitted that you can catch.
## Methods
### pterosocket.connect()
Connects the websocket to the panel.
### pterosocket.close()
Closes the connection to the panel
### pterosocket.on(event, callback)
* event: string
* callback: function

Event listener, you can find a list of events here.
``` js
socket.on('console_output', (output)=>{
    console.log(output)
})
```
### pterosocket.once(event, callback)
* event: string
* callback: function

Event listener that is run just once. It might be a good idea to add the following code so as to get feedback for important events.
``` js
socket.once('start', (output)=>{
    console.log("Console connected!")
})
socket.once('close', (output)=>{
    console.log("Console disconnected!")
})
```
### pterosocket.writeCommand(command)
* command: string

Sends a command to the game-console. As usual you don't need to add "/" before commands.
### pterosocket.writePower(command)
* command: string

Sends a power action to the console (like turning it on or off).
### pterosocket.write(packet)
* packet: object

Sends a packet to the console. The packet needs to be formatted according to the description in the [documentation](https://dashflo.net/docs/api/pterodactyl/v1/#req_2c867e1e1f6b448b9e99f9daeebb7e9a)

## Events
### start
* *none*

Start is fired when the websocket sends the auth packet the first time, after connecting to the server.
### close
* data: string

Fired when the websocket connection is closed. This can either happen because connection dropped or because the client asked for disconnect (e.g running ```pterosocket.close()```).
### error
* data: string

Generic websocket error.
### auth_success
* *none*

Websocket authenticated successfully. This event is fired every 10-15 minutes when the pterosocket automatically sends the new login packet, and the server answer with this packet.
### status
* data: string

Power status of the server: online/offline
### stats
* data: object

Fired around each second, it contains many useful stats about the server like CPU usage, memory usage and network rate. Here an example of this packet's content.
``` js
{
  cpu_absolute: 3.329,
  disk_bytes: 7161307200,
  memory_bytes: 1611730944,
  memory_limit_bytes: 3379200000,
  network: { rx_bytes: 483357768, tx_bytes: 1498516760 },
  state: 'running',
  uptime: 37901252
}
```
### console_output
* data: string

A packet is sent by the server each time a new line is added to the game-console. This can be server-managed information (login/out of players), the output of commands run directly on the console (included the command itself), or the output of a command sent by a pterosocket instance.

### token_expiring
* *none*

Fired when the token used to authenticate is about to expire. The tokens are managed automatically by the pterosocket instance, and there is no need to implement responses to this event. Typically a program won't implement this event. 
### token_expired
* *none*

Fired when the token used to authenticate is expired.
