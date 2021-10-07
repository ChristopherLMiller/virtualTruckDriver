const socket = io('http://10.19.136.10:3000');

document.addEventListener('click', (event) => {
  const key = event.target.getAttribute('data-key');
  const modifier = JSON.parse(event.target.getAttribute('data-modifier'));
  socket.emit('keypress', { key, modifier });
})