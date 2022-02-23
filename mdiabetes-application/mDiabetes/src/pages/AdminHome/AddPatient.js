import React, { useState } from "react"
import { View, StyleSheet, ScrollView, Keyboard, Alert } from "react-native"
import { TextInput, Button, Text, RadioButton, Subheading } from "react-native-paper"
import DatePicker from "react-native-date-picker"
import MonthPicker from "react-native-month-year-picker"
import Slider from "@react-native-community/slider"
import { getData, postData } from "../../net/getData"
import useAsyncStorage from "../../hooks/useAsyncStorage"

const formatDate = (date) => {
	return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
}

const formatMonth = (date) => {
	return date.toLocaleDateString("en-US", { year: "numeric", month: "long", timeZone: "UTC" })
}

const debounce = function (func, delay) {
	let timer;
	return function () {     //anonymous function
		const context = this;
		const args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(context, args)
		}, delay);
	}
}

export default function AddPatient({ navigation }) {

	const [authToken] = useAsyncStorage("authToken")
	const [username] = useAsyncStorage("username")

	const [values, setValues] = useState({
		"deployment-start": new Date(),
		"deployment-end": new Date(),
		"diagnosis": new Date(),
		"a1c": 40,
		"a1c-date": new Date()
	})
	const [deploymentStartSelected, setDeploymentStartSelected] = useState(false)
	const [deploymentEndSelected, setDeploymentEndSelected] = useState(false)
	const [diagnosisSelected, setDiagnosisSelected] = useState(false)
	const [deploymentStartOpen, setDeploymentStartOpen] = useState(false)
	const [deploymentEndOpen, setDeploymentEndOpen] = useState(false)
	const [diagnosisOpen, setDiagnosisOpen] = useState(false)
	const [a1cOpen, setA1cOpen] = useState(false)

	const edit = (key) => (value) => setValues((old) => ({ ...old, [key]: value }))

	const editNumber = (key) => (text) => setValues({ ...values, [key]: text.replace(/[^0-9]/g, "") })

	const onOpenDeploymentStart = () => setDeploymentStartOpen(true)
	const onOpenDeploymentEnd = () => setDeploymentEndOpen(true)
	const onOpenDiagnosis = () => setDiagnosisOpen(true)
	const onOpenA1c = () => setA1cOpen(true)
	const onCloseDeploymentStart = () => setDeploymentStartOpen(false)
	const onCloseDeploymentEnd = () => setDeploymentEndOpen(false)
	const onCloseDiagnosis = () => setDiagnosisOpen(false)
	const onCloseA1c = () => setA1cOpen(false)
	const onConfirmDeploymentStart = (date) => {
		onCloseDeploymentStart()
		setValues({ ...values, "deployment-start": date })
		setDeploymentStartSelected(true)
	}
	const onConfirmDeploymentEnd = (date) => {
		onCloseDeploymentEnd()
		setValues({ ...values, "deployment-end": date })
		setDeploymentEndSelected(true)
	}
	const onConfirmDiagnosis = (_, date) => {
		onCloseDiagnosis()
		setValues({ ...values, "diagnosis": date })
		setDiagnosisSelected(true)
	}
	const onConfirmA1c = (date) => {
		onCloseA1c()
		setValues({ ...values, "a1c-date": date })
	}
	const getDeploymentDateStart = () => deploymentStartSelected ? formatDate(values["deployment-start"]) : "None Selected"
	const getDeploymentDateEnd = () => deploymentEndSelected ? formatDate(values["deployment-end"]) : "None Selected"
	const getDiagnosisDate = () => diagnosisSelected ? formatMonth(values["diagnosis"]) : "None Selected"
	const getA1cDate = () => formatDate(values["a1c-date"])

	const submit = async () => {
		// validate values
		let error = ""

		if (!values["ID"] || values["ID"].length === 0) {
			error = "Please enter a patient ID."
		} else if (!values["age"] || String(values["age"]).length === 0 || Number(values["age"]) === 0) {
			error = "Please enter the patient age."
		} else if (!values["gender"]) {
			error = "Please specify the patient gender."
		} else if (!values["ethnicity"] || (values["ethnicity"] === "other" && (!values["ethnicity-other"] || values["ethnicity-other"].length === 0))) {
			error = "Please specify the patient ethnicity."
		} else if (!diagnosisSelected) {
			error = "Please specify the date of diagnosis."
		} else if (!deploymentStartSelected) {
			error = "Please specify the deployment start date."
		} else if (!deploymentEndSelected) {
			error = "Please specify the deployment end date."
		} else if (!values["insulin-regimen"]) {
			error = "Please specify the insulin regimen."
		} else if (!values["glucose-monitor-regularly"]) {
			error = "Please specify if the patient uses a continuous glucose monitor regularly."
		}

		if (error !== "") {
			Alert.alert("Error", error, [{ text: "OK", onPress: () => {} }]);
			return
		}
		let query = ""
		const addQuery = (name, value) => {
			if(query === "") {
				query = "?"
			} else{
				query += "&"
			}
			query += name + "=" + value
		}
		addQuery("ID", values["ID"])
		addQuery("age", values["age"])
		addQuery("gender", values["gender"])
		addQuery("ethnicity", values["ethnicity"])
		addQuery("insulin-regimen", values["insulin-regimen"])
		addQuery("glucose-monitor-regularly", values["glucose-monitor-regularly"])
		addQuery("a1c", values["a1c"] / 10)
		addQuery("a1c-date", values["a1c-date"].valueOf())
		addQuery("deployment-start", values["deployment-start"].valueOf())
		addQuery("deployment-end", values["deployment-end"].valueOf())
		addQuery("diagnosis", values["diagnosis"].valueOf())
		try {
			const response = await (await getData(`patient-create${query}`, { username, authToken })).json()
			console.log({ response })
			if(response.success) {
				navigation.goBack()
			}
		} catch (err) {
			console.trace(err)
		}
	}

	return (
		<>
			<ScrollView
				contentContainerStyle={styles.root}
				onScroll={Keyboard.dismiss}
				scrollEventThrottle={500}
			>
				<Text>Please fill out the following fields of patient information. Scroll until all fields are filled out and press the Submit button.</Text>
				<TextInput style={styles.input} label="Patient ID" value={values["ID"]} onChangeText={edit("ID")} />
				<TextInput style={styles.input} label="Age" keyboardType="numeric" value={values["age"]} onChangeText={editNumber("age")} />
				<Subheading style={styles.subheading}>Deployment Dates</Subheading>
				<View style={styles.deployment}>
					<Text>{getDeploymentDateStart()}</Text>
					<Button style={styles.deploymentButton} mode="contained" onPress={onOpenDeploymentStart}>Select</Button>
				</View>
				<View style={styles.deployment}>
					<Text>{getDeploymentDateEnd()}</Text>
					<Button style={styles.deploymentButton} mode="contained" onPress={onOpenDeploymentEnd}>Select</Button>
				</View>
				<Subheading style={styles.subheading}>Gender</Subheading>
				<RadioButton.Group onValueChange={edit("gender")} value={values["gender"]}>
					<RadioButton.Item mode="android" label="Male" value="male" />
					<RadioButton.Item mode="android" label="Female" value="female" />
					<RadioButton.Item mode="android" label="Non-Binary" value="non-binary" />
				</RadioButton.Group>
				<Subheading style={styles.subheading}>Ethnicity</Subheading>
				<RadioButton.Group onValueChange={edit("ethnicity")} value={values["ethnicity"]}>
					<RadioButton.Item mode="android" label="White" value="white" />
					<RadioButton.Item mode="android" label="Hispanic" value="hispanic" />
					<RadioButton.Item mode="android" label="Asian" value="asian" />
					<RadioButton.Item mode="android" label="Black / Afrian-American" value="black" />
					<RadioButton.Item mode="android" label="Other" value="other" />
				</RadioButton.Group>
				{values["ethnicity"] === "other" &&
					<TextInput style={styles.input} label="Specify Ethnicity" value={values["ethnicity-other"]} onChangeText={edit("ethnicity-other")} />
				}
				<Subheading style={styles.subheading}>In what month and year was the patient diagnosed with diabetes?</Subheading>
				<View style={styles.deployment}>
					<Text>{getDiagnosisDate()}</Text>
					<Button style={styles.deploymentButton} mode="contained" onPress={onOpenDiagnosis}>Select</Button>
				</View>
				<Subheading style={styles.subheading}>Most recent hemoglobin A1c</Subheading>
				<Text style={styles.hemoLevel}>{values["a1c"] / 10}</Text>
				<View style={styles.hemoSlider}>
					<Text>4</Text>
					<Slider
						style={styles.hemoSliderComponent}
						value={values["a1c"]}
						onSlidingComplete={edit("a1c")}
						onValueChange={debounce(edit("a1c"), 25)}
						minimumValue={40}
						maximumValue={160}
						step={1}
						tapToSeek={true}
					/>
					<Text>16</Text>
				</View>
				<Subheading style={styles.subheading}>What date was the hemoglobin A1c was obtained?</Subheading>
				<View style={styles.deployment}>
					<Text>{getA1cDate()}</Text>
					<Button style={styles.deploymentButton} mode="contained" onPress={onOpenA1c}>Select</Button>
				</View>
				<Subheading style={styles.subheading}>Insulin Regimen</Subheading>
				<RadioButton.Group onValueChange={edit("insulin-regimen")} value={values["insulin-regimen"]}>
					<RadioButton.Item mode="android" label="Pump" value="pump" />
					<RadioButton.Item mode="android" label="Injections" value="injections" />
					<RadioButton.Item mode="android" label="Other" value="other" />
					<RadioButton.Item mode="android" label="No Insulin" value="none" />
				</RadioButton.Group>
				<Subheading style={styles.subheading}>Does the patient use a continuous glucose monitor regularly?</Subheading>
				<RadioButton.Group onValueChange={edit("glucose-monitor-regularly")} value={values["glucose-monitor-regularly"]}>
					<RadioButton.Item mode="android" label="Yes" value="yes" />
					<RadioButton.Item mode="android" label="No" value="no" />
				</RadioButton.Group>
				<Button mode="contained" style={styles.submit} onPress={submit}>Submit</Button>
			</ScrollView>
			<View>
				<DatePicker
					modal
					mode="date"
					open={deploymentStartOpen}
					date={values["deployment-start"]}
					onConfirm={onConfirmDeploymentStart}
					onCancel={onCloseDeploymentStart}
				/>
				<DatePicker
					modal
					mode="date"
					open={deploymentEndOpen}
					date={values["deployment-end"]}
					onConfirm={onConfirmDeploymentEnd}
					onCancel={onCloseDeploymentEnd}
				/>
				<DatePicker
					modal
					mode="date"
					open={a1cOpen}
					date={values["a1c-date"]}
					onConfirm={onConfirmA1c}
					onCancel={onCloseA1c}
				/>
				{diagnosisOpen && (
					<MonthPicker
						onChange={onConfirmDiagnosis}
						value={values["diagnosis"]}
					/>
				)}
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	root: {
		paddingTop: 20,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 100
	},
	input: {
		marginTop: 5,
		marginBottom: 10
	},
	subheading: {
		marginTop: 30,
		marginBottom: 5,
		fontWeight: "bold"
	},
	deployment: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 5
	},
	deploymentButton: {
		width: 100
	},
	hemoSlider: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 10
	},
	hemoSliderComponent: {
		flex: 1
	},
	hemoLevel: {
		textAlign: "center",
		fontSize: 16
	},
	submit: {
		marginTop: 40
	}
})