const { app, BrowserWindow } = require('electron');
const path = require('path');

const express = require('express');
const expressApp = express();
const http = require('http');
const server = http.createServer(expressApp);
const {Server} = require('socket.io');
const io = new Server(server);

const robot = require('robotjs');

// configure static asset serving
expressApp.use(express.static(__dirname + '/public'));

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

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  mainWindow.loadFile('public/index.html');

  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
