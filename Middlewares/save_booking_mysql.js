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
  debug: true,
  insecureAuth: true,
};

// Create a connection pool for the MySQL database
const pool = mysql.createPool(dbConfig);

const query = `INSERT INTO ${tableName} (${columnNames.join(
  ", "
)}) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

// Debug flag to control console logs
const debugMode = true; // Change this to false to disable debug logs

// Function to append data to a MySQL database
const appendToBookingMySQL = async (
  fullname,
  email,
  time,
  comments,
  subject,
  date,
  phone,
  creationDate
) => {
  try {
    // Get a connection from the pool
    const connection = await new Promise((resolve, reject) => {
      pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        } else {
          resolve(connection);
        }
      });
    });

    debugLog("Creating connection to MySQL server..");

    // Insert the data into a MySQL table (adjust table name and structure)
    await connection.query(query, [fullname, email, time, comments, subject, date, phone, creationDate]);

    debugLog("Data inserted!");

    // Release the connection back to the pool
    connection.release();

    debugLog("Connection released.");
  } catch (error) {
    console.error("Error inserting data into MySQL:", error);
  }
};

// Function to log debug messages if debugMode is true
function debugLog(message) {
  if (debugMode) {
    console.log(message);
  }
}

module.exports = {
  appendToBookingMySQL,
};
