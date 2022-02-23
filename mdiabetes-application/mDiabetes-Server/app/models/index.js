const dbConfig = require("../config/db.config.js")

const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url

db.setup = () => {
	db.mongoose
		.connect(db.url, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
		.catch(err => {
			console.log("Failed to connect to the database:", err)
			process.exit()
		})
}

// models
db.user = require("./user.model.js")()
db.patient = require("./patient.model.js")()
db.foodlog = require("./foodlog.model.js")()

module.exports = db