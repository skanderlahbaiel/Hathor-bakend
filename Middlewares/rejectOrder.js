const mysql = require("mysql");
const dbConfig = require("../config/dbconfig")

// Create a connection pool for the MySQL database
const pool = mysql.createPool(dbConfig);


function rejectOrder(req, res, next) {
    const { booking_id } = req.body;
  
    // Check if the provided booking_id exists
    if (!booking_id) {
      res.status(400).json({ error: 'Booking ID is missing in the request body' });
      return;
    }
  
    // Assuming you have a database connection pool named "pool"
    const updateStatusQuery = 'UPDATE orders SET status = ? WHERE id = ?';
  
    // Set the status to 'rejected' for the specified booking_id
    pool.query(updateStatusQuery, ['rejected', booking_id], (err, result) => {
      if (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
  
      if (result.affectedRows === 0) {
        // No rows were affected, meaning the booking_id doesn't exist
        res.status(404).json({ error: 'Booking not found' });
      } else {
        // Successfully updated the status to 'rejected'
        next();
      }
    });
  }
  
  module.exports = rejectOrder;
  