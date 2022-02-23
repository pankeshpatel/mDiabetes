const mongoose = require("mongoose")

module.exports = () =>
	mongoose.model("Patient", mongoose.Schema({
		ID: String,
		initialData: {
			age: Number,
			gender: String,
			ethnicity: String,
			"insulin-regimen": String,
			"glucose-monitor-regularly": Boolean,
			a1c: Number,
			"a1c-date": Number,
			"deployment-start": Number,
			"deployment-end": Number,
			diagnosis: Number
		},
		timestamp: Number
	}))