import express from 'express';
import { createServer } from 'http';
import ip from 'ip';
import { config } from './config';

try {
  require('electron-reloader')(module);
} catch {}

// establish the express server
const expressApp = express();
const server = createServer(expressApp);

import { logger } from './logging';

import { isAuthorized } from './auth';
import { Server } from 'socket.io';
import robot from 'robotjs';

// electron
const { BrowserWindow, app } = require('electron');
const path = require('path');

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
    logger.info(
      `Type: Invalid Login Attempt; Remote IP - ${socket.conn.remoteAddress}`
    );
    next(new Error('Unauthorized - password required to login'));
  }
});

// setup the socket connection
io.on('connection', (socket) => {
  io.emit(
    'consoleLog',
    `Type: Connection Established; Remote IP - ${socket?.conn?.remoteAddress}`
  );
  logger.info(
    `Type: Connection Established; Remote IP - ${socket?.conn?.remoteAddress}`
  );

  // listen for disconnect, log for debugging purposes
  socket.on('disconnect', (reason) => {
    io.emit(
      'consoleLog',
      `Type: Connection Disconnected; Remote IP - ${socket?.conn?.remoteAddress}; Reason - ${reason}`
    );
    logger.info(
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
        io.emit('consoleLog', `Type: key${event.direction}; Key: ${event.key}`);
        logger.info(`Type: key${event.direction}; Key: ${event.key}`);
        break;
      case 'press':
        if (event?.modifier) {
          robot.keyTap(event.key, event.modifier);
        } else {
          robot.keyTap(event.key);
        }
        io.emit(
          'consoleLog',
          `Type: keypress; Key - ${event.key}, Modifiers: ${event.modifier}`
        );
        logger.info(
          `Type: keypress; Key - ${event.key}, Modifiers: ${event.modifier}`
        );
        break;
    }
  });

  io.on('consoleLog', (message) => {
    // here we capture any of the events we care bout and log them
    logger.info(message);
  });
});

// Configure express
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload'),
    },
  });

  mainWindow.loadFile('build/index.html');

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// launch the electron app
app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

server.listen(config.get('port'), () => {
  console.log(`Server Starting: http://${ip.address()}:${config.get('port')}`);
});
