const sendDeniedEmail = require('../Middlewares/sendDeniEmails');
// rejectOrderRoute.js
const express = require('express');
const router = express.Router();
const rejectOrder = require('../Middlewares/rejectOrder');

// Define the route to reject an order
router.post('/reject-order',
 rejectOrder,
 sendDeniedEmail);

module.exports = router;
