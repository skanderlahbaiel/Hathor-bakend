

const formToEmailRoute = require('./routes/form-to-email.js')
const express = require('express');
const http = require('http');
const WebSocket = require('ws'); // Import the 'ws' library

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);


app.use('/booking', formToEmailRoute);


// Create a WebSocket server by passing in the HTTP server
const wss = new WebSocket.Server({ server });

// Define routes and middleware as needed for your app
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Listen for WebSocket connections
wss.on('connection', socket => {
    console.log('A new client connected to WebSocket');

    // Handle WebSocket events
    socket.on('message', message => {
        console.log('Received message:', message);
        socket.send('message received')
        // Do something with the received message
    });

    // You can also send messages to the client
    socket.send('Hello, client! This is the server.');
});

// Start the combined HTTP and WebSocket server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});






  