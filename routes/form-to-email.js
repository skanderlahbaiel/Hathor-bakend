const express = require("express");
const router = express.Router();
const { appendToBookingMySQL } = require('../Middlewares/save_booking_mysql.js'); // Adjust the path




// Define a route to handle form data and send emails
router.post("/send-booking", (req, res) => {
  // Extract data from the body of the request
  const { fullname, email, time, comments, subject, date, phone, creationDate } = req.body;
  console.log(`req.body: ${req.body.subject}`);
  
  const textToSend = `Booking request received at ${Date()}\nName: ${fullname}\nE-mail: ${email}\nSubject:${subject}\nAt:${time}\nComments: ${comments}\nRequest creation: ${date}\nPhone number: ${phone}\nCreation date: ${creationDate}`;
 
  // Display data to console
  console.log(textToSend);

  //Store data to the sql db
  appendToBookingMySQL(
    fullname,
    email,
    time,
    comments,
    subject,
    date,
    phone,
    creationDate
  );

  // Emit a custom event to send data to WebSocket server
  req.app.get("eventEmitter").emit("broadcast", req.body);

  // Return a response to the frontend
  res.json({
    message: "Sent successfully.",
  });
});

module.exports = router;
