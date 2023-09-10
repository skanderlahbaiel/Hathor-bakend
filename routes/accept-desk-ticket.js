const express = require("express");
const checkOrSetslot = require("../Middlewares/check_available_slots")
const confirm_booking = require("../Middlewares/confirm-booking")
const decrementSlots= require("../Middlewares/decrementSlots")
const checkOrderSubject = require("../Middlewares/checkOrderSubject")
const send_emails = require("../Middlewares/sendConfEmails")
const router = express.Router();

// Define a route to check if a date exists in the availability table
router.post(
    "/check-confirm-decrement",
    checkOrSetslot,
    (req, res, next) => {
      console.log(`Slots available! check_available_slots executed. Passing to the next middleware! ${req.slotsCount}`);
      next();
    },
    checkOrderSubject,
    confirm_booking,
    decrementSlots,
    send_emails
  );
  
  router.post(
    "/check-confirm-decrement-manual",
    checkOrSetslot,
    (req, res, next) => {
      console.log(`Slots available! check_available_slots executed. Passing to the next middleware! ${req.slotsCount}`);
      next();
    },
    confirm_booking,
    decrementSlots,
    send_emails
  );


module.exports = router;
