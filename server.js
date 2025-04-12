// server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3001;

// Keep track of connected users (socket.id -> username)
const users = {};

/**
 * Simulates fetching a welcome message asynchronously.
 * Returns a Promise that resolves with the message after a delay.
 */
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

// Serve the index.html file when someone visits the root URL.
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// --- Socket.IO Logic ---
io.on('connection', async (socket) => {
  console.log('✅ A user connected:', socket.id);

  // Listen for the client setting their username
  socket.on('set username', async (username) => {
    users[socket.id] = username;
    console.log(`👤 User ${socket.id} set username to: ${username}`);

    // Notify other clients that the user has joined
    socket.broadcast.emit('system message', `${username} has joined the chat!`);

    // Fetch and send the welcome message asynchronously to the new user
    try {
        const welcomeMessage = await fetchWelcomeMessage();
        socket.emit('system message', welcomeMessage);
    } catch (error) {
        console.error("Error fetching welcome message:", error);
        socket.emit('system message', "Sorry, couldn't fetch the welcome message.");
    }

    // (Optional Bonus) Broadcast the updated user list to all connected clients.
    io.emit('user list', Object.values(users));
  });

  // Listen for typing events
  socket.on('typing', () => {
    const username = users[socket.id] || 'Anonymous';
    // Broadcast to everyone except the sender that this user is typing
    socket.broadcast.emit('user typing', username);
  });

  socket.on('stop typing', () => {
    const username = users[socket.id] || 'Anonymous';
    socket.broadcast.emit('user stopped typing', username);
  });

  // Listen for chat messages from clients
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

  // When a user disconnects, remove them and notify other clients.
  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      console.log(`❌ User ${username} (${socket.id}) disconnected`);
      socket.broadcast.emit('system message', `${username} has left the chat.`);
      delete users[socket.id];
      // (Optional Bonus) Emit updated user list
      io.emit('user list', Object.values(users));
    } else {
      console.log(`❌ User ${socket.id} (no username set) disconnected`);
    }
  });
});
// --- End Socket.IO Logic ---

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
