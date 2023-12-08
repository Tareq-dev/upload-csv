const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.host_v2,
  user: process.env.user_v2,
  password: process.env.password_v2,
  database: process.env.database_v2,
  port: 3306,
});

// For pool initialization, see above
db.getConnection(function (err, conn) {
  if (err) throw err;
  console.log("Successfully connected to the database.");

  conn.release();
});
module.exports = { db };
