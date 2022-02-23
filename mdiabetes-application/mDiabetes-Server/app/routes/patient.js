const db = require("../models")
const Patient = db.patient
const FoodLog = db.foodlog

module.exports = (app) => {
	app.get("/patient-login", async (req, res) => {
		const ID = req.query.ID
		
		const patient = await Patient.findOne({ ID })
		if(patient) {
			res.send({ success: true })
		} else {
			res.send({ success: false })
		}
	})
	app.get("/patient-newlog", async (req, res) => {
		const log = new FoodLog({
			patientID: req.query.patientID,
			timestamp: Date.now(),
			mealType: req.query.mealType,
			name: req.query.name,
			volume: req.query.volume,
			carbs: req.query.carbs,
			protein: req.query.protein,
			calories: req.query.calories,
			fat: req.query.fat,
		})

		let error = false

		await log.save().catch((err) => {
			console.error(err)
			res.send({ success: false })
			error = true
		})

		if(!error)
			res.send({ success: true })
	})
	app.get("/patient-recentlog", async (req, res) => {
		const getRecentLog = (mealType) => FoodLog.find({
			patientID: req.query.patientID,
			mealType
		}).sort({
			timestamp: -1
		}).limit(1)

		const formatLog = (log) => log.length > 0 ? ({
			name: log[0].name,
			logged: log[0].timestamp
		}) : ({ })

		res.send({
			breakfast: formatLog(await getRecentLog("breakfast")),
			lunch: formatLog(await getRecentLog("lunch")),
			dinner: formatLog(await getRecentLog("dinner")),
			other: formatLog(await getRecentLog("other")),
		})
	})
	app.get("/patient-view", async (req, res) => {
		const DAY = 24 * 60 * 60 * 1000

		const dayLogs = await FoodLog.find({
			patientID: req.query.patientID,
			timestamp: {
				$gt: Number(req.query.date),
				$lt: Number(req.query.date) + DAY
			}
		})

		console.log({ pid: req.query.patientID, d: req.query.date, dayLogs })

		const goals = {
			carbs: 0.2,
			calories: 2000,
			fat: 0.2,
			protein: 0.2
		}

		const getAmount = (nutrient) => dayLogs.reduce((prev, curr) => prev + (curr[nutrient] || 0), 0)
		const getPercent = (nutrient) => getAmount(nutrient) / goals[nutrient]
		const getNutrientName = (nutrient) => {
			switch(nutrient) {
				case "carbs":
					return "Carbohydrates"
				default:
					return nutrient.substring(0, 1).toUpperCase() + nutrient.substring(1)
			}
		}
		const getNutrientColor = (nutrient) => {
			switch(nutrient) {
				case "carbs":
					return "green"
				case "calories":
					return "yellow"
				case "fat":
					return "red"
				case "protein":
				default:
					return "purple"
			}
		}
		const getNutrientValue = (nutrient) => ({
			name: getNutrientName(nutrient),
			percent: Number(getPercent(nutrient).toFixed(2)),
			amount: Number(getAmount(nutrient)).toFixed(2), // convert kg to g
			color: getNutrientColor(nutrient)
		})

		const nutrients = [
			"carbs", "calories", "fat", "protein"
		].map(getNutrientValue)

		res.send(nutrients)
	})
}