const express = require("express");
const router = express.Router();
const getAllAvailability = require("../Middlewares/get_availability");

// Define a route to retrieve all data from "availability" table
router.get("/all-availability", getAllAvailability, (req, res) => {

  
});

module.exports = router;
