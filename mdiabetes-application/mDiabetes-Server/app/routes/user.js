const db = require("../models")
const User = db.user
const Patient = db.patient
const FoodLog = db.foodlog

const crypto = require('crypto');

const authTokens = {}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

const validateUserQuery = (req) => {
	console.log({ authTokens, username: req.query.username, authToken: req.query.authToken, value: authTokens[req.body.username] === req.body.authToken })
	return authTokens[req.query.username] === req.query.authToken
}

module.exports = (app) => {
	setInterval(() => {
		// do something with authTokens?
	}, 60000) // a minute

	app.get("/login", async (req, res) => {
		console.log({ q: req.query })
		const user = await User.findOne({
			username: req.query.username,
			password: getHashedPassword(req.query.password)
		})
		console.log({ user })
		if(!user) {
			res.send({ success: false })
			return
		}
		
		const authToken = generateAuthToken();

		authTokens[req.query.username] = authToken;
		console.log({ authTokens })

		res.send({ success: true, authToken })
	})
	app.post("/user-create", async (req, res) => {
		const newUser = new User({
			username: req.body.username,
			password: getHashedPassword(req.body.password)
		})

		console.log({ newUser })

		await newUser.save().catch(console.err)

		res.send({ success: true })
	})
	app.get("/patient-list", async (req, res) => {
		if(!validateUserQuery(req)) {
			res.send({ success: false })
			console.log("PATIENT LIST:  ", patients)

			return
		}
		
		let patients = await Patient.find({ })

		patients = await Promise.all(patients.map(async (patient) => {
			const recentLog = await FoodLog.find({
				patientID: patient.ID
			}).sort({
				"timestamp": -1
			}).limit(1)

			return {
				...patient,
				recentLog
			}
		}))
		res.send({ patients, success: true })
	})
	app.get("/patient-create", async (req, res) => {
		console.log({ req })
		// if(!validateUserQuery(req)) {
		// 	res.send({ success: false, error: "authentication-token-bad" })
		// 	return
		// }

		// const preExistingPatient = await Patient.findOne({ ID })
		// if(preExistingPatient) {
		// 	res.send({ success: false, error: "patient-ID-taken" })
		// 	return
		// }

		

		let initialData = req.query

		delete initialData.authToken
		delete initialData.username

		const ID = initialData.ID
		delete initialData.ID

		initialData["glucose-monitor-regularly"] = initialData["glucose-monitor-regularly"] === "yes"
		initialData.a1c = Number(initialData.a1c)
		initialData.age = Number(initialData.age)
		initialData.age = Number(initialData.age)
		initialData["a1c-date"] = Number(initialData["a1c-date"])
		initialData["deployment-start"] = Number(initialData["deployment-start"])
		initialData["deployment-end"] = Number(initialData["deployment-end"])
		initialData["diagnosis"] = Number(initialData["diagnosis"])

		const newPatient = new Patient({
			ID,
			initialData,
			timestamp: Date.now()
		})


		await newPatient.save().catch(console.err)

		res.send({ success: true })

		
	})
	app.get("/patient-delete", async (req, res) => {
		if(!validateUserQuery(req)) {
			res.send({ success: false })
			return
		}

		const ID = req.query.ID

		await Patient.findOneAndDelete({ ID })

		res.send({ success: true })
	})
}