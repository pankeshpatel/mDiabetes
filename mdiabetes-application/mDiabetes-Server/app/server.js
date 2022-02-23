require("dotenv").config()

const cors = require("cors")
const express = require("express")
const app = express()

const db = require("./models")
const user = require("./routes/user")
const patient = require("./routes/patient")

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))

db.setup()

user(app)
patient(app)

const PORT = process.env.NODE_DOCKER_PORT || 8008
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`)
})