import React, { useState, useEffect } from 'react';
import { View, ScrollView, Keyboard } from "react-native"
import { TextInput, Button, Text } from "react-native-paper"
import { getData } from "../net/getData"
import useAsyncStorage from "../hooks/useAsyncStorage"

function NutritionValue({ name, value }) {
	return (
		<View style={styles.nutritionItem}>
			<Text style={styles.nutritionName}>{name}</Text>
			<Text style={styles.nutritionValue}>{Number(((value || 0) * 1000).toFixed(2))}g</Text>
		</View>
	)
}

export default function Nutrition({ route, navigation }) {

	const [values, setValues] = useState({ "volume": "1" })
	const [selection, setSelection] = useState({})

	const [patientID] = useAsyncStorage("localPatientID")

	const edit = (key) => (value) => setValues({ ...values, [key]: value })

	const submit = async () => {
		let query = `?patientID=${patientID}`
		query += `&mealType=${route.params.mealType}`
		query += `&name=${encodeURIComponent(route.params.selection.name)}`
		query += `&volume=${values["volume"]}`
		query += `&carbs=${route.params.selection.nutrition.totalCarbs}`
		query += `&protein=${route.params.selection.nutrition.protein}`
		query += `&calories=${route.params.selection.nutrition.calories}`
		query += `&fat=${route.params.selection.nutrition.totalFat}`
		await getData(`patient-newlog${query}`)
		navigation.navigate("Welcome")
	}
	const submitDisabled = false

	useEffect(() => {
		if(route && route.params.selection) {
			setSelection(route.params.selection)
		}
	}, [route && route.params])

	return (
		<ScrollView
			contentContainerStyle={styles.root}
			onScroll={Keyboard.dismiss}
			scrollEventThrottle={500}
		>
			<TextInput style={styles.input} label="Volume" value={values["volume"]} onChangeText={edit("volume")} />
			<View style={styles.nutritionImage}>
				<View style={styles.nutritionImageInside}>
					<Text style={styles.factsTitle}>Nutrition Facts</Text>
					{selection.nutrition && (
						<>
							<NutritionValue name="Total Fat" value={selection.nutrition.totalFat} />
							<NutritionValue name="Total Carbohydrate" value={selection.nutrition.totalCarbs} />
							<NutritionValue name="Protein" value={selection.nutrition.protein} />
						</>
					)}
				</View>
			</View>
			<Button mode="contained" onPress={submit} disabled={submitDisabled}>
				Continue
			</Button>
		</ScrollView>
	);
}

const styles = {
	root: {
		paddingTop: 20,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 100
	},
	title: {
		fontSize: 20,
		marginBottom: 25,
		textAlign: "center"
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
	nutritionImage: {
		height: 400,
		backgroundColor: "white",
		marginVertical: 35,
		padding: 10
	},
	nutritionImageInside: {
		borderWidth: 2,
		borderColor: "black",
		borderStyle: "solid",
		height: 380,
		padding: 10
	},
	nutritionItem: {
		border: "1px solid black",
		paddingVertical: 2,
		display: "flex",
		flexDirection: "row"
	}, 
	nutritionName: {
		fontWeight: "bold",
		marginBottom: 5
	},
	nutritionValue: {
		color: "black",
		marginLeft: 5
	},
	factsTitle: {
		fontSize: 30,
		fontWeight: "bold",
		paddingBottom: 3,
		textAlign: "center"
	}
}