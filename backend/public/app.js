const socket = io('http://localhost:3000');

document.addEventListener('click', (event) => {
  if (event.target.nodeName === 'BUTTON') {
  const key = event.target.getAttribute('data-key');
  const modifier = JSON.parse(event.target.getAttribute('data-modifier'));
  socket.emit('keypress', { key, modifier });
  }
})