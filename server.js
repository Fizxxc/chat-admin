const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

let messages = [];
let adminOnline = true;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/admin-inbox', (req, res) => {
  res.render('admin', { messages });
});

// Hanya satu blok io.on('connection')
io.on('connection', (socket) => {
  console.log('User connected');

  // Kirim status admin saat user masuk
  socket.emit('admin status', adminOnline);

  // Terima pesan dari user
  socket.on('chat message', (msg) => {
    messages.push({ from: 'user', text: msg });
    io.emit('chat message', { from: 'user', text: msg });
  });

  // Terima balasan dari admin
  socket.on('admin reply', (msg) => {
    messages.push({ from: 'admin', text: msg });
    io.emit('chat message', { from: 'admin', text: msg });
  });

  // Admin mengubah status online/offline
  socket.on('admin status', (status) => {
    adminOnline = status;
    io.emit('admin status', adminOnline);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
