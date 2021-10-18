//@ts-ignore
const socket = io.connect(`http://localhost:${window.config['port']}`, {
  //@ts-ignore
  auth: { password: window.config['password'] },
});

// Log the connection
socket.on('connect', () => {
  console.log('connected to the socket server');
});

// If there was an error connecting log it
socket.on('connect_error', (error: any) => {
  console.log(error);
});

// Log disconnections
socket.on('disconnect', (reason: string) => {
  console.log(reason);
});

socket.on('consoleLog', (message: string) => {
  console.log(message);
});
