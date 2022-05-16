const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const WebSocket = require('ws');
const { EventEmitter } = require('events')

// https://dashflo.net/docs/api/pterodactyl/v1/

class pterosocket extends EventEmitter {
    constructor(origin, api_key, server_no, auto_connect=true){
        super();
        this.origin = origin;
        this.api_key = api_key;
        this.server_no = server_no;
        if (auto_connect)
            this.connect();
    }
    
    async get_new_login(){
        const response = await fetch(`${this.origin}/api/client/servers/${this.server_no}/websocket`, {
            "method": "GET",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.api_key}`
            }
        }).then((data) => { return data.json()});
        if ("data" in response){
            return response.data;
        }
    }

    async #authLogin(token = ""){
        if (token)
            this.write({"event":"auth","args":[token]});
        else{
            const login = await this.get_new_login();
            if (!login)
                throw "Couldn't connect - server didn't provide credentials.";
            const {token} = login;
            this.write({"event":"auth","args":[token]});
        }
    }

    async #readPacket(packet){
        const {event, args} = JSON.parse(packet.toString('utf8'));
        switch (event){
            //'auth success', 'status', 'console output', 'token expired'
            case 'stats':
                if (args[0].startsWith("{"))
                    this.emit('stats', JSON.parse(args[0])); //avoinding parse error with args=["running"]
                break;
            case 'token expiring':
                this.#authLogin();
                this.emit(event.replace(" ", "_"));
                break;
            default:
                if (args)
                    this.emit(event.replace(" ", "_"), args[0]);
                else
                    this.emit(event.replace(" ", "_"));
        }
    }

    async connect(){
        const login = await this.get_new_login();
        if (!login)
            throw "Couldn't connect - server didn't provide credentials."
        const {token, socket} = login;
        
        this.ws = new WebSocket(socket, {
            origin: this.origin
        });
        this.ws.on('open', () => {
            this.#authLogin(token);
            this.emit('start');
        });
        this.ws.on('message', (data) => {
            this.#readPacket(data);
        });    
        this.ws.on('error', (data) => {
            this.emit("error", data);
        }); 
        this.ws.on('close', (data) => {
            this.emit("close", data);
            this.ws=undefined;
        }); 
    }

    close(){
        this.ws.close();
        this.ws=undefined;
        this.emit("close", "Connection closed by user");
    }

    write(packet){
        this.ws.send(JSON.stringify(packet));
    }

    writeCommand(command_text){
        this.write({"event":"send command","args":[command_text]});
    }

    writePower(command_text){
        this.write({"event":"set state","args":[command_text]})
    }


}

module.exports= {
    pterosocket: pterosocket
}