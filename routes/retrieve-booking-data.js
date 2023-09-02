// routes/form-to-email.js
const express = require("express");
const router = express.Router();
const {fetchDataFromDatabase} = require("../Middlewares/get_booking_mysql")


// Use the middleware to retrieve data before handling the route
router.get("/get-data", fetchDataFromDatabase, (req, res) => {
  // Data retrieved from the database is available in req.dbData
  res.json(req.dbData);
});

module.exports = router;
