const express = require("express");
const router = express.Router();
const  appendToBookingMySQL = require('../Middlewares/save_booking.js'); // Adjust the path




// Define a route to handle form data and send emails
router.post("/send-booking",appendToBookingMySQL, (req, res) => {
  console.log(`Data received by the send-booking route: ${req.body.subject}`);
  // Emit a custom event to send data to WebSocket server
  req.app.get("eventEmitter").emit("broadcast", req.body);
  // Return a response to the frontend
  res.status(200).json({
    message: "Booking stored and sent to live successfully.",
  });
  console.log(res.status)
});

module.exports = router;
