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

const pool = mysql.createPool(dbConfig);

// Middleware function to insert data into the booking_slot_email table
function insertBookingSlotEmail(req, res, next) {
  const { booking_id, booking_date, booking_time } = req.body;

  // Step 1: Retrieve the booking_id from the orders table based on booking_id
  const getBookingIdQuery = "SELECT id FROM orders WHERE id = ?";
  console.log("Setting connection to the db from insert_bookingid middleware");
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
      return;
    }
    console.log("Connection set!");

    connection.query(
      getBookingIdQuery,
      [booking_id],
      (queryError, bookingResults) => {
        if (queryError) {
          connection.release();
          console.error("Error querying the database:", queryError);
          res.status(500).json({ error: "Database error" });
          return;
        }

        if (bookingResults.length === 0) {
          connection.release();
          res
            .status(400)
            .json({ error: "Booking not found for the given booking_id" });
          return;
        }

        const bookingId = bookingResults[0].id;

        // Step 2: Retrieve the availability_id from the availability table based on booking_date and booking_time
        const getAvailabilityIdQuery =
          "SELECT availability_id FROM availability WHERE booking_date = ? AND booking_time = ?";

        connection.query(
          getAvailabilityIdQuery,
          [booking_date, booking_time],
          (availabilityError, availabilityResults) => {
            if (availabilityError) {
              connection.release();
              console.error("Error querying the database.");
              if (availabilityError.code === "ER_NO_SUCH_TABLE") {
                // Handle the specific error condition
                res.status(400).json({ error: "Database table not found" });
                return;
              } else if (availabilityError.code === "ER_DUP_ENTRY") {
                // Handle another specific error condition
                console.error(
                  "Duplicate entry. Data already exists in booking_slot_email."
                );
              } else {
                // Handle generic database error
                res.status(500).json({ error: "Database error" });
                return;
              }
            }

            if (availabilityResults.length === 0) {
              connection.release();
              res.status(400).json({
                error: "Availability not found for the given date and time",
              });
              return;
            }

            const availabilityId = availabilityResults[0].availability_id;

            const insertQuery =
              "INSERT INTO booking_slot_email (availability_id, booking_id) VALUES (?, ?)";
            connection.query(
              insertQuery,
              [availabilityId, bookingId],
              (insertError) => {
                connection.release();

                if (insertError) {
                  // Handle database insertion error
                  console.error("Error inserting data.");
                  if (insertError.code === "ER_NO_SUCH_TABLE") {
                    // Handle the specific error condition
                    res.status(400).json({ error: "Table not found" });
                    return;
                  }
                  // Check the error code to determine the type of error
                  if (insertError.code === "ER_DUP_ENTRY") {
                    // Handle duplicate entry error (if the combination of availability_id and booking_id is not unique)
                    console.log(
                      "Exiting the execution tree, the booking has already been done."
                    );
                    res
                      .status(500)
                      .json({ mesage: "Booking has already been confirmed" });
                    return;
                  } else {
                    // Handle other database errors
                    res.status(500).json({
                      error: "Database error occurred while inserting data.",
                    });
                    return;
                  }
                }

                // Step 3: Update the "status" column in the "orders" table to "confirmed"
                const updateStatusQuery =
                  "UPDATE orders SET status = 'confirmed' WHERE id = ?";
                connection.query(
                  updateStatusQuery,
                  [booking_id],
                  (updateError) => {
                    if (updateError) {
                      connection.release();
                      console.error("Error updating status:", updateError);
                      res.status(500).json({ error: "Database error" });
                      return;
                    }
                    console.log("Status of booking changed.");
                    // If there was no error, send a success response
                    req.insertTicket = "true";
                    next();
                  }
                );
              }
            );
          }
        );
      }
    );
  });
}

module.exports = insertBookingSlotEmail;
