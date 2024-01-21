
# Hathor Server

## Description
The Hathor Server is a backend system designed to manage the flow of ticketing for the Hathor Coworking Space. It handles ticket states including submitted, confirmed, and refused. The server is responsible for storing ticket information in a MySQL database, avoiding duplicate ticket submissions, and managing user authentication sessions.

## Installation
To set up the Hathor Server on your local environment, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/hathor-server.git
   cd hathor-server
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Server:**
   ```bash
   npm start
   ```
   This will start the server on `localhost:3000` by default, or on the port specified by the `PORT` environment variable.

## Technologies Used
- Node.js with Express for the server framework.
- MySQL and mysql2 for database operations.
- Cors for enabling CORS.
- Nodemailer for sending emails.
- Socket.io for real-time communication.
- Nodemon for auto-restarting the server during development.
- Wscat for WebSocket testing.

## Features
- Ticket management including submission, confirmation, and rejection.
- Real-time updates to connected clients using WebSocket.
- Duplicate ticket detection.
- User session management with login/logout functionality.

## API Endpoints
- `POST /booking`: Submit a new booking to the database.
- `GET /booking`: Retrieve booking data.
- `POST /database`: Confirm a ticket.
- `GET /get-availability`: Check availability of resources.
- `POST /reject-order`: Reject an order.

## WebSocket Communication
- The server utilizes WebSocket to broadcast messages to all connected clients in real-time.

## Running the Server
- Use the command `npm start` to run the server.
- Ensure MySQL is set up and running before starting the server.
- Configure `.env` file for environment variables like database connection settings.

## Contributing
We welcome contributions to improve the Hathor Server. Please follow the standard fork-and-pull request workflow.



