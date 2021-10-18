/*import { isAuthorized } from './auth';
import { Server } from 'socket.io';
import robot from 'robotjs';

// configure socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// setup middleware to handle auth
io.use((socket, next) => {
  if (isAuthorized(socket?.handshake?.auth?.password, config.get('password'))) {
    next();
  } else {
    socket.emit(
      'consoleLog',
      `Type: Invalid Login Attempt; Remote IP - ${socket.conn.remoteAddress}`
    );
    next(new Error('Unauthorized - password required to login'));
  }
});

// setup the socket connection
io.on('connection', (socket) => {
  socket.emit(
    'consoleLog',
    `Type: Connection Established; Remote IP - ${socket?.conn?.remoteAddress}`
  );

  // listen for disconnect, log for debugging purposes
  socket.on('disconnect', (reason) => {
    socket.emit(
      'consoleLog',
      `Type: Connection Disconnected; Remote IP - ${socket?.conn?.remoteAddress}; Reason - ${reason}`
    );
  });

  // listen for message from client
  socket.on('keypress', function (event) {
    switch (event.type) {
      case 'toggle':
        // pass the key and if its up or down to keyToggle.
        // we don't use modifiers as we assume its just simple key press
        robot.keyToggle(event.key, event.direction);
        socket.emit(
          'consoleLog',
          `Type: key${event.direction}; Key: ${event.key}`
        );
        break;
      case 'press':
        if (event?.modifier) {
          robot.keyTap(event.key, event.modifier);
        } else {
          robot.keyTap(event.key);
        }
        socket.emit(
          'consoleLog',
          `Type: keypress; Key - ${event.key}, Modifiers: ${event.modifier}`
        );
        break;
    }
  });

  socket.on('consoleLog', (message) => {
    // here we capture any of the events we care bout and log them
    //logger.info(message);
    console.log('Message:' + message);
  });
});
*/
