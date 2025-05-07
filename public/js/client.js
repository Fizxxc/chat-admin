const socket = io();

function sendMessage() {
  const input = document.getElementById('message');
  const msg = input.value;
  if (msg) {
    socket.emit('chat message', msg);
    input.value = '';
  }
}

socket.on('chat message', (msg) => {
  const li = document.createElement('li');
  li.textContent = `${msg.from === 'admin' ? 'Admin' : 'User'}: ${msg.text}`;
  document.getElementById('messages').appendChild(li);
});

socket.on('admin status', (online) => {
    const li = document.createElement('li');
    li.textContent = online ? '🟢 Admin Sedang Online' : '🔴 Admin Sedang Offline';
    li.className = online
      ? 'bg-green-100 text-green-800 px-3 py-2 rounded-lg font-semibold'
      : 'bg-red-100 text-red-800 px-3 py-2 rounded-lg font-semibold';
    document.getElementById('messages').appendChild(li);
  });
  