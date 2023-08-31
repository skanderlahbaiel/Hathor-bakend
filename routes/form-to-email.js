const express = require("express");
const router = express.Router();

// Define a route to handle form data and send emails
router.post("/send-email", (req, res) => {
  // Extract data from the body of the request
  console.log(req.body);
  const fullname = req.body.fullname;
  const email = req.body.email;
  const time = req.body.time;
  const comments = req.body.comments;
  const bookingSubject = req.body.subject;
  const date = req.body.date;
  const textToSend = `Booking request received at ${Date()}\nName: ${fullname}\nE-mail: ${email}\nSubject:${bookingSubject}\nAt:${time}\nComments: ${comments}\nRequest creation: ${date}`;
  // Display data to console
  console.log(textToSend);
  // Emit a custom event to send data to WebSocket server
  req.app.get("eventEmitter").emit("broadcast", req.body);

  // Return a response to the frontend
  res.json({
    message: "Sent successfully",
  });
});

module.exports = router;
