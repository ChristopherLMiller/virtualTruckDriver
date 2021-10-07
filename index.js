const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

const robot = require('robotjs');

// configure static asset serving
app.use(express.static(__dirname + '/public'));

// setup the socket connection
io.on('connection', (socket) => {
  console.log('client connected');

  // listen for disconnect, log for debugging purposes
  socket.on('disconnect', () => {
    console.log('client disconnected');
  });

  // listen for message from client
  socket.on('keypress', (event) => {
    console.log(event);
    if (event?.modifier) {
      robot.keyTap(event.key, event.modifier);
    } else {
      robot.keyTap(event.key);
    }
  });
});

server.listen(3000, () => {
  console.log('server listening on *:3000');
});

