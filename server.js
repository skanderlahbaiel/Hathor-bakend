const cors = require('cors');
const EventEmitter = require("events");
const bookingOrderToDb = require("./routes/booking-to-db.js");
const getBookingData= require("./routes/retrieve-booking-data.js");
const confirmOrder = require("./routes/accept-desk-ticket.js")
const get_availability = require("./Middlewares/get_availability.js")
const express = require("express");
const http = require("http");
const WebSocket = require("ws"); // Import the 'ws' library
const rejectOrder = require("./routes/reject-order.js")



const app = express();
const eventEmitter = new EventEmitter();
app.set("eventEmitter", eventEmitter);
const port = process.env.PORT || 3000;
app.use(cors());


const server = http.createServer(app);



app.use(express.json()); // Parse incoming JSON data
app.use("/booking", bookingOrderToDb);
app.use("/booking", getBookingData );
app.use("/database", confirmOrder);
app.use("/get-availability", get_availability)
app.use("/reject-order", rejectOrder)
// Store connected clients (staff/baristas)
const connectedClients = new Set();

// Create a WebSocket server by passing in the HTTP server
const wss = new WebSocket.Server({ server });

// Define routes and middleware as needed for your app

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Listen for custom events to broadcast data
eventEmitter.on("broadcast", (data) => {
  // Broadcast the data to connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
      
    }
  });
});

// Listen for WebSocket connections
wss.on("connection", (socket) => {
  console.log("A new client connected to WebSocket OnConnection");
  connectedClients.add(socket);
  // Display the number of connected clients
  console.log("Number of connected clients:", connectedClients.size);

// Handle WebSocket close event
socket.on("close", () => {
  console.log("A client disconnected from WebSocket");
  connectedClients.delete(socket); // Remove the disconnected socket
  console.log("Number of connected clients after deletion:", connectedClients.size);
});

  // Handle WebSocket events
  socket.on("message", (message) => {
    console.log("Received message:", message);
    // socket.send('Backend Websocket server received message');
  });

  
});

// Start the combined HTTP and WebSocket server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
