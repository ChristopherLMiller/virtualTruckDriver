const socket = io('http://localhost:3005', { auth: { password: "test"}});

socket.on('connect_error', err => {
  alert(`Unable to connect: ${err.message}`);
})
document.addEventListener('click', (event) => {
  if (event.target.nodeName === 'BUTTON') {
  const key = event.target.getAttribute('data-key');
  const modifier = JSON.parse(event.target.getAttribute('data-modifier'));
  socket.emit('keypress', { key, modifier });
  }
});