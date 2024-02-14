const express = require("express")
const app = express()
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const pool = require("./config/database.js")

//Setting up config file variables
dotenv.config({ path: "./config/config.env" })

const PORT = process.env.PORT
app.use(bodyParser.json({ limit: "500mb" }))
app.use(express.json())

//Importing all routes
app.use("/", require("./routes"))

app.listen(PORT, () => {
  console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})
