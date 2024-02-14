const mysql = require("mysql2/promise")

const pool = mysql.createPool({
  host: process.env.DATABASE_URL,
  user: "root",
  password: "Bvps2019!",
  database: "searchbox"
})

module.exports = pool
