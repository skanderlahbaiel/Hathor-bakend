// routes/form-to-email.js
const express = require("express");
const router = express.Router();
const {getAllBookings, getFilteredBookings} = require("../Middlewares/get_booking")


// Use the middleware to retrieve data before handling the route
router.get("/get-data", getAllBookings, (req, res) => {
  // Data retrieved from the database is available in req.dbData
  res.json(req.dbData);
});


// Define a route to retrieve filtered bookings
router.get("/filtered-bookings", getFilteredBookings, (req, res) => {
  // Access the filtered data from req.dbFilteredData
  const filteredData = req.dbFilteredData;

  // You can send the filtered data as a response or perform further processing here
  res.json(filteredData);
});

module.exports = router;
