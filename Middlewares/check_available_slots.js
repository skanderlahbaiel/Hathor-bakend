// slotsMiddleware.js
const mysql = require('mysql');

// MySQL database connection configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "skanderR1deathnote",
  database: "booking_info",
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 200000,
  
  insecureAuth: true,
};

// Create a connection pool for the MySQL database
const pool = mysql.createPool(dbConfig);


// Middleware function to check available slots by date and time without altering the count
function checkAvailableSlots(req, res, next) {
  const dateToCheck = req.body.booking_date;
  const timeToCheck = req.body.booking_time;

  // Query to check if slots are available and get the current count
  const checkQuery = 'SELECT available_slots FROM availability WHERE booking_date = ? AND booking_time = ?';

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting a MySQL connection:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }

    // Execute the check query
    connection.query(checkQuery, [dateToCheck, timeToCheck], (queryError, results) => {
      if (queryError) {
        connection.release();
        console.error('Error querying the database:', queryError);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      const availableSlots = results[0] ? results[0].available_slots : null;

      if (availableSlots === null) {
        // No record found, set slots to 28 and respond
        const setTo28Query = 'INSERT INTO availability (booking_date, booking_time, available_slots) VALUES (?, ?, 28)';
        connection.query(setTo28Query, [dateToCheck, timeToCheck], (setTo28Error) => {
          if (setTo28Error) {
            connection.release();
            console.error('Error setting slots to 28:', setTo28Error);
            res.status(500).json({ error: 'Database error' });
            return;
          }

          // Continue to the next middleware
          console.log('Slots are available (set to 28). From checkAvailableSlots middleware.');
          req.slotsCount = 28; // Set the slots count to 28
          
          connection.release();
          next();
        });
      } else if (availableSlots === 0) {
        // No slots available
        res.status(400).json({ error: 'No available slots for this date and time' });
      } else if (availableSlots > 0) {
        // Slots are available
        console.log('Slots are available. From checkAvailableSlots middleware.');
        req.slotsCount = availableSlots; // Store the slots count in the request object
        connection.release();
        next(); // Continue to the next middleware
      }
    });
  });
}


module.exports = checkAvailableSlots;
