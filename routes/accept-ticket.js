const express = require("express");
const check_available_slots = require("../Middlewares/check_available_slots")
const confirm_booking = require("../Middlewares/confirm-booking")
const decrementOrSetSlots= require("../Middlewares/decrementsOrSetSlots")

const router = express.Router();

// Define a route to check if a date exists in the availability table
router.post(
    "/check-date-time",
    check_available_slots,
    (req, res, next) => {
      console.log(`Slots available! check_available_slots executed. Passing to the next middleware! ${req.slotsCount}`);
      next();
    },
    confirm_booking,
    decrementOrSetSlots,
  );
  


module.exports = router;
