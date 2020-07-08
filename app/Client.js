'use strict';
const DEBUG = process.env.DEBUG ? process.env.DEBUG==='YES' : true

/**
 * TCP/IP Client
 */

class Client {
  
  constructor (socket) {
    this.address = socket.remoteAddress;
    this.port    = socket.remotePort;
    this.name    = `${this.address}:${this.port}`;
    this.socket  = socket;
    this.buffer  = ''
  }

  sendMessage (message) {
    this.socket.write(message);
  }

  sendMessages (messages) {
      messages.forEach( (message,index) => {
        setTimeout(()=>{
          if(this.socket){
            if(DEBUG) console.log("Sending message: " + message)
            this.socket.write(message+'\n\r')
          }else{
            if(DEBUG) console.log("Socket was closed. Message sending cancelled: " + message)
          }
          
        },index*15000+2000)
      })
  }

}
module.exports = Client;