const mongoose = require("mongoose")

module.exports = () =>
	mongoose.model("FoodLog", mongoose.Schema({
		patientID: String,
		mealType: String,
		name: String,
		volume: Number,
		carbs: Number,
		protein: Number,
		calories: Number,
		fat: Number,
		timestamp: Number
	}))