const mysql = require("mysql");

// MySQL database connection configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "skanderR1deathnote",
  database: "booking_info",
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 200000,
  debug: true,
  insecureAuth: true,
};

// Create a connection pool for the MySQL database
const pool = mysql.createPool(dbConfig);

// Middleware function to retrieve data from the database
const fetchDataFromDatabase = (req, res, next) => {
  // Use the connection pool to get a connection
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection:", err);
      res.status(500).json({ error: "Unable to fetch data" });
      return;
    }

    // Define your SQL query to retrieve data
    const sql = "SELECT * FROM orders"; 
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
      req.dbData = results;

      // Call the next middleware or route handler
      next();
    });
  });
};

module.exports = { fetchDataFromDatabase };
