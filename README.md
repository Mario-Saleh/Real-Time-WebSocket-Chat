# Simple WebSocket Chat Application

## Overview

This project is a real-time chat application built using Node.js, Express, and Socket.IO. It demonstrates how to implement WebSocket-based communication to enable instant messaging between multiple users. The application not only supports sending and receiving messages in real-time but also includes additional features such as typing indicators, asynchronous welcome messages, and an optional live user list.

## Features

- **Real-Time Chat:**  
  Users can send messages that are immediately broadcasted to all connected clients without refreshing the page.

- **Typing Indicators:**  
  When a user starts typing, a notification is sent to other connected users. Once the user stops typing, the notification is cleared.

- **System Messages:**  
  Informative messages (e.g., user join/leave notifications) are broadcasted to keep all users updated.

- **Asynchronous Welcome Message:**  
  A simulated asynchronous operation fetches a welcome message for new users after they enter their username.

- **(Optional Bonus) User List:**  
  The server tracks and broadcasts a list of connected users which can be used to display a live user list on the client side.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (which includes npm)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd assignment2-websocket-chat```

2. **Install Dependencies:**
    Run the following command in your project directory to install Express and Socket.IO:
    
    ```npm install```
    

## Running the Application

1. **Start the Server:**
    You can start the server using the npm start script:

    ```npm start```

    Alternatively, start it directly with Node.js:

    ```node server.js```

    The server listens on port 3001 by default (or the port specified in your environment).

2. **Open the Chat in Your Browser:**
    Open your browser and navigate to:

    ```http://localhost:3001```

    Upon loading the page, you'll be prompted to enter a username. Once you've set your username, you can start chatting immediately.


## How the Chat Works

### Server-Side (server.js) 
- **Express and HTTP Server:**
    
    The application uses Express to serve the static index.html file. An HTTP server created with Node.js is used for integrating Socket.IO.

- **Socket.IO Integration:**
    
    The server initializes a Socket.IO instance and listens for new client connections using:

    ```io.on('connection', (socket) => { ... });```

    Within this connection callback, the server:
    - Sets Username: Listens for a "set username" event to record the user's name and broadcasts a join message.
    - Handles Chat Messages: Listens for "chat message" events from clients and emits these messages to all connected users.
    - Manages Typing Indicators: Listens for "typing" and "stop typing" events from clients and broadcasts the corresponding notifications.
    - Handles Disconnections: Clears user data and broadcasts a system message when a client disconnects.
    - Asynchronous Operation: Uses an asynchronous function (fetchWelcomeMessage) to simulate a delayed welcome message which is sent only to the newly connected user.


## Client-Side (index.html)
- **Socket.IO Client:**

    The client connects to the Socket.IO server with:

    ```const socket = io();```
    
- **Username Prompt:**

    On connection, the client prompts you to enter a username (or assigns a random one if none is provided) and emits the username to the server.

- **Sending and Displaying Messages:**

    Users type messages into an input form. Upon form submission, the message is sent to the server and then broadcasted back to all connected clients, where it is displayed in the chat area.

- **Typing Indicator:**

    The client listens for input events on the message field to detect when a user is typing. It:
    - Emits a "typing" event immediately as the user types.
    - Uses a timer to emit a "stop typing" event after 2 seconds of inactivity.
    - Displays a "user is typing..." notification based on "user typing" events received from the server.

- **System Notifications and User List:**

    The client also listens for system messages (e.g., user join/leave notifications) and, optionally, for updated user lists which can be shown in the UI or the console.


## How to Use the Chat

1. **Open in Multiple Browser Tabs:**

    To simulate multiple users, open http://localhost:3001 in more than one browser window or tab.

2. **Set Your Username:**

    When prompted, enter a username.

    If no username is provided, a random username is assigned.

3. **Send Messages:**

    Type your message in the input field and click "Send" or press Enter.

    Your message will appear in the chat area of all connected clients.

4. **Observe Typing Indicator:**

    When one user starts typing, other connected clients will see a notification (e.g., "UserXYZ is typing...").

    Once the user stops typing for 2 seconds (or sends the message), the indicator will disappear.

5. **View System Notifications:**

    System messages will notify users when someone joins or leaves the chat.

    The asynchronous welcome message will appear once you set your username.


## Project Structure

- **server.js:**
    Contains the back-end logic including:
    - Express server setup
    - Socket.IO integration and event handling
    - Asynchronous welcome message simulation
    - User tracking and optional user list broadcasting
- **index.html:**
    Hosts the front-end interface with:
    - HTML and CSS for layout and styling
    - JavaScript to connect to the Socket.IO server, handle user input, manage chat messages, and      display typing notifications
- **package.json:**
    Defines project metadata and dependencies (Express and Socket.IO) along with useful npm scripts.


## Testing and Debugging

- **Server Logs:**
    
    Monitor the terminal for logs regarding connections, messages, and disconnections.

- **Browser Console:**

    Use your browser's developer tools (F12) to view client-side logs and debug any issues.

- **Multiple Clients:**

    Open the chat in several browser tabs or different browsers to verify that messaging, typing indicators, and system notifications are working correctly.
