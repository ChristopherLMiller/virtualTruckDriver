const socket = io();

document.addEventListener('click', (event) => {
  const key = event.target.getAttribute('data-key');
  const modifier = JSON.parse(event.target.getAttribute('data-modifier'));
  socket.emit('keypress', { key, modifier });
})