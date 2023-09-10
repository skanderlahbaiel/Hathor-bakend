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
  insecureAuth: true,
};

// Create a connection pool for the MySQL database
const pool = mysql.createPool(dbConfig);

// Middleware function to retrieve data from the database
const getAllBookings = (req, res, next) => {
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

// Middleware function to retrieve filtered data from the database
const getFilteredBookings = (req, res, next) => {
  // Extract filter criteria from req.params
  const {
    status,
    date,
    time,
    id,
    fullname,
    subject,
    phone,
    email,
    creationDate,
    comments,
  } = req.query;

  // Start building the SQL query
  let sql = "SELECT * FROM orders WHERE 1=1"; // Always true condition to build upon

  // Add filter conditions based on available parameters
  if (status) {
    sql += ` AND status LIKE '%${status}%'`;
  }
  if (date) {
    sql += ` AND date LIKE '%${date}%'`;
  }
  if (email) {
    sql += ` AND email LIKE '%${email}%'`;
  }
  if (time) {
    sql += ` AND time LIKE '%${time}%'`;
  }
  if (id) {
    sql += ` AND id = ${id}`;
  }
  if (fullname) {
    sql += ` AND fullname LIKE '%${fullname}%'`;
  }
  if (subject) {
    sql += ` AND subject LIKE '%${subject}%'`;
  }
  if (phone) {
    sql += ` AND phone LIKE '%${phone}%'`;
  }
  if (creationDate) {
    sql += ` AND creationDate LIKE '%${creationDate}%'`
  }
  if (comments) {
    sql += ` AND comments LIKE '%${comments}%'`
  }

  console.log("Constructed SQL Query:", sql);

  // Use the connection pool to get a connection
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection:", err);
      res.status(500).json({ error: "Unable to fetch data" });
      return;
    }

    // Execute the constructed query
    connection.query(sql, (queryErr, results) => {
      // Release the connection back to the pool
      connection.release();

      if (queryErr) {
        console.error("Error executing MySQL query:", queryErr);
        res.status(500).json({ error: "Unable to fetch data" });
        return;
      }

      // Attach the retrieved data to the request object
      req.dbFilteredData = results;
      console.log(results);

      // Call the next middleware or route handler
      next();
    });
  });
};

module.exports = { getAllBookings, getFilteredBookings };
