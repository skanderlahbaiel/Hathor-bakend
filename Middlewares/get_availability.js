const mysql = require("mysql");

// MySQL database connection configuration
const dbConfig = require("../config/dbconfig")

// Create a connection pool for the MySQL database
const pool = mysql.createPool(dbConfig);

// Middleware function to retrieve all data from the "availability" table
const getAllAvailability = (req, res, next) => {
  // Use the connection pool to get a connection
  pool.getConnection((err, connection) => {
    console.log("Setting connection.")
    if (err) {
      console.error("Error getting MySQL connection:", err);
      res.status(500).json({ error: "Unable to fetch data" });
      return;
    }

    // Define your SQL query to retrieve all data
    const sql = "SELECT * FROM availability";

    // Execute the query
    connection.query(sql, (queryErr, results) => {
      // Release the connection back to the pool
      connection.release();

      if (queryErr) {
        console.error("Error executing MySQL query:", queryErr);
        res.status(500).json({ error: "Unable to fetch data" });
        return;
      }

      // Attach the retrieved data to the request object
      req.availabilityData = results;

      // Call the next middleware or route handler
      res.json(results);
    });
  });
};

module.exports =  getAllAvailability ;
