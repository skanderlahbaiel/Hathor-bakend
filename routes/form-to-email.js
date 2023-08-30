const express = require("express");
const router = express.Router();

//Define a route to handle form data and send emails
router.post("/send-email", (req, res) => {
  //Extract data from the body of the request
  const fullname = req.body.fullname;
  const email = req.body.email;
  const time = req.body.time;
  const comments = req.body.comments;
  const bookingSubject = req.body.subject;
  const textToSend = `Booking request received at ${Date()}\nName: ${fullname}\nE-mail: ${email}\nSubject:${bookingSubject}\nAt:${time}\nComments: ${comments}`
  //Display data to console
  console.log(textToSend);

  
  //Return a response to the frontend
  res.json({
    message: "Sent sucessfully",
  });
});

module.exports = router;
