const mysql = require("mysql");

const tableName = "orders";
const columnNames = [
  "fullname",
  "email",
  "time",
  "comments",
  "subject",
  "date",
  "phone",
  "creationDate",
  "status"
];

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

const query = `INSERT INTO ${tableName} (${columnNames.join(
  ", "
)}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

// Middleware function to append data to a MySQL database
const appendToBookingMySQLMiddleware = (req, res, next) => {
  const {
    fullname,
    email,
    time,
    comments,
    subject,
    date,
    phone,
    creationDate,
  } = req.body;



  // Get a connection from the pool
  pool.getConnection((error, connection) => {
    if (error) {
      console.error("Error getting a MySQL connection:", error);
      res.status(500).json({ message: "Database error" });
      return;
    }

    // Insert the data into a MySQL table (adjust table name and structure)
    connection.query(
      query,
      [fullname, email, time, comments, subject, date, phone, creationDate, 'pending'],
      (insertError, results) => {
        if (insertError) {
          console.error("Error inserting data into MySQL:", insertError);
          if (insertError.code === "ER_DUP_ENTRY") {
            res.status(400).json({ message: "Duplicate entry" });
          } else {
            res.status(500).json({ message: "Database error" });
          }
        } else {
          console.log("Data inserted successfully!");
          // You can also log the results if needed
          console.log("Insertion results:", results);
          next()
        }

        // Release the connection back to the pool
        connection.release();
      }
    );
  });
};

module.exports = appendToBookingMySQLMiddleware;
