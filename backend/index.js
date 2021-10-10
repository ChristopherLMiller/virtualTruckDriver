// depedencies relating to the overall app
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const robot = require('robotjs');
const bcrypt = require('bcrypt');
const { createLogger, format, transports} = require('winston');
const ip = require('ip');

// setup the app
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: {
  origin: '*'
}});

// fetching the config file
require('dotenv').config();

const saltRounds = 10;
const hashedPassword = bcrypt.hashSync(process.env.PASSWORD, saltRounds);

// Format of the log file
const { combine, timestamp, label, printf } = format;
const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'Event'}),
    timestamp(),
    logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: __dirname + '/logs/app.log' })
  ]
});

// Function to check if the password is correct
function isAuthorized(password) {
  return bcrypt.compareSync(password, hashedPassword);
}

// configure static asset serving
app.use(express.static(__dirname + '/public'));

// setup middleware to handle auth
io.use((socket, next) => {
  if (isAuthorized(socket?.handshake?.auth?.password)) {
    next();
  } else {
    logger.info(`Invalid Login Attempt: Remote IP - ${socket.conn.remoteAddress}`)
    next(new Error('Unauthorized - password required to login'));
  }
});

// setup the socket connection
io.on('connection', (socket) => {
  logger.info(`Connection Established: Remote IP - ${socket?.conn?.remoteAddress}`);

  // listen for disconnect, log for debugging purposes
  socket.on('disconnect', () => {
    logger.info(`Connection Disconnected: Remote IP - ${socket?.conn?.remoteAddress}`);
  });

  // listen for message from client
  socket.on('keypress', (event) => {
    logger.info(`Keypress: Key - ${event.key}, Modifiers: ${event.modifier}`)
    if (event?.modifier) {
      robot.keyTap(event.key, event.modifier);
    } else {
      robot.keyTap(event.key);
    }
  });
});

// Launch the server
server.listen(process.env.PORT, () => {
  logger.info(`Server Starting: http://${ip.address()}:${process.env.PORT}`);
});