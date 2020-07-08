'use strict';
const DEBUG = process.env.DEBUG ? process.env.DEBUG==='YES' : true
const Server = require('./Server');
const bus = require('./bus.js')
bus.init()
initServer()

async function initServer() {
  try {
    const PORT = process.env.PORT || 5000;
    const ADDRESS = process.env.IP || "127.0.0.1"
    var server = new Server(PORT, ADDRESS);
    await server.start(bus)
    console.log(`Server started at: ${ADDRESS}:${PORT}`);
  } catch (err) {
    if(DEBUG) console.log("An error occurred", err)
  }
}
