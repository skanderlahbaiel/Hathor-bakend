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

// Middleware function to decrement available slots or set it to 28
function decrementOrSetSlots(req, res, next) {
  const slotsCount = req.slotsCount;
  const {booking_date, booking_time} = req.body;
  console.log(`req: ${slotsCount} ${booking_date} ${booking_time}`)
  
  
  if (slotsCount > 0) {
    // Slots are available, proceed to decrement
    const decrementQuery = 'UPDATE availability SET available_slots = available_slots - 1 WHERE booking_date = ? AND booking_time = ?';
    console.log("slotsCount>0 and decrementing..")
    pool.getConnection((err, connection) => {
      if (err) {
        console.log('error connecting to db')
        console.error('Error getting a MySQL connection:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      connection.query(decrementQuery, [booking_date, booking_time], (decrementError) => {
        if (decrementError) {
          connection.release();
          res.status(500).json({ error: 'Failed to decrement available slots: ' + decrementError.message });
          return;
        }

        // Continue to the next middleware or route
        connection.release();
        console.log("SLots decremented by 1.")
        res.status(200).json({"message": "Decremnted slots by 1."});
      });
    });
  } else {
    // No slots available, set slots to 28
    const setTo28Query = 'INSERT INTO availability (booking_date, booking_time, available_slots) VALUES (?, ?, 28)';
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting a MySQL connection:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      connection.query(setTo28Query, [booking_date, booking_time], (setTo28Error) => {
        if (setTo28Error) {
          connection.release();
          console.error('Error setting slots to 28:', setTo28Error);
          res.status(500).json({ error: 'Database error' });
          return;
        }

        
        connection.release();
        res.status(200).json({"message":"Available. slotsCount initiliased to 28."})
      });
    });
  }
}

module.exports = decrementOrSetSlots;
