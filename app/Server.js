'use strict';
const DEBUG = process.env.DEBUG ? process.env.DEBUG==='YES' : true
const net = require('net');
const parser = require('./parse.js')
const Client = require('./Client'); // importing Client class

class Server {
    constructor(port, address) {
        this.port = port || 5000;
        this.address = address || '127.0.0.1';
        // Holds our currently connected clients
        this.clients = [];
    }
 
    start(bus) {
        return new Promise((resolve) => {
            let server = this;
            server.connection = net.createServer((socket) => {
                let client = new Client(socket);
                if(DEBUG) console.log(`${client.name} connected.`);
                client.sendMessages(bus.getCommandsOnConnect())
                server.clients.push(client);

                socket.on('data', (data) => {
                    client.buffer += data.toString()
                    let n = client.buffer.search(/\n|\r|!/g)
                    while (~n) {
                        let line = client.buffer.substring(0, n).replace(/\r|\n/g, '')
                        client.buffer = client.buffer.substring(n + 1)
                        if (line.length>0) {
                            if(DEBUG) console.log(`${client.name}:`);
                            if(DEBUG) console.log(line)
                            //Try the provided models until one manages to parse the given data successfully
                            bus.models.some( model => {
                                const parsed = parser(line,model)
                                if(parsed){
                                    parsed.ip = client.address
                                    const success = model.actions.success ? model.actions.success : () => {}
                                    success(parsed)
                                    return true                                
                                }
                                return false
                            })
                            
                        }
                        n = client.buffer.search(/\n|\r|!/g)
                    }
                    if(DEBUG) console.log("Buffer len: " + client.buffer.length)
                });

                socket.on('end', () => {
                    server.clients.splice(server.clients.indexOf(client), 1);
                    if(DEBUG) console.log(`${client.name} disconnected.`);
                    client.socket = null;
                });

                socket.on("error", (err) => {
                    server.clients.splice(server.clients.indexOf(client), 1);
                    if(DEBUG) console.log(`${client.name} hung up on error.`,err);
                    socket.destroy()
                    client.socket = null;
                })
            });

            this.connection.listen(this.port, this.address);
            this.connection.on('listening', resolve);
        })

    }

}
module.exports = Server;