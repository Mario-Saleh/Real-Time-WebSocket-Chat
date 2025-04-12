const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3001;

const users = {};

function fetchWelcomeMessage() {
    console.log('⏳ Simulating fetching welcome message...');
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const welcomeMsg = "Welcome to the Simple WebSocket Chat!";
            console.log('✅ Welcome message fetched.');
            resolve(welcomeMsg);
        }, 1500);
    });
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', async (socket) => {
  console.log('✅ A user connected:', socket.id);

  socket.on('set username', async (username) => {
    users[socket.id] = username;
    console.log(`👤 User ${socket.id} set username to: ${username}`);

    socket.broadcast.emit('system message', `${username} has joined the chat!`);

    try {
        const welcomeMessage = await fetchWelcomeMessage();
        socket.emit('system message', welcomeMessage);
    } catch (error) {
        console.error("Error fetching welcome message:", error);
        socket.emit('system message', "Sorry, couldn't fetch the welcome message.");
    }

    io.emit('user list', Object.values(users));
  });

  socket.on('typing', () => {
    const username = users[socket.id] || 'Anonymous';
    socket.broadcast.emit('user typing', username);
  });

  socket.on('stop typing', () => {
    const username = users[socket.id] || 'Anonymous';
    socket.broadcast.emit('user stopped typing', username);
  });

  socket.on('chat message', (msg) => {
    const username = users[socket.id];
    if (username) {
      console.log(`💬 Message from ${username} (${socket.id}): ${msg}`);
      io.emit('chat message', { user: username, msg: msg });
    } else {
      console.log(`💬 Message from anonymous user (${socket.id}): ${msg}`);
      socket.emit('system message', "Please set a username before sending messages.");
    }
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      console.log(`❌ User ${username} (${socket.id}) disconnected`);
      socket.broadcast.emit('system message', `${username} has left the chat.`);
      delete users[socket.id];
      io.emit('user list', Object.values(users));
    } else {
      console.log(`❌ User ${socket.id} (no username set) disconnected`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
