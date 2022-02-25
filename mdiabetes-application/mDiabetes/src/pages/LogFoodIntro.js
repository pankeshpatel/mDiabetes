import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Keyboard, Alert } from "react-native"
import { RNCamera } from 'react-native-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput, Button, Text, RadioButton, Title, Subheading, IconButton } from "react-native-paper"
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogFoodIntro({ route, navigation }) {

	const [values, setValues] = useState({ })

	const edit = (key) => (value) => setValues((old) => ({ ...old, [key]: value }))

	const openWithCamera = () => {navigation.navigate("LogFood", { type: values["type"] })}
	const openWithoutCamera = () => {navigation.navigate("LogFood", { type: values["type"] })}

	const submitDisabled = !values["type"]

	const handleUseCamera = async () => {
		try {
		await AsyncStorage.setItem(
			'mealtype',
			values["type"]
		);
		} catch (error) {
		// Error saving data
		}
		navigation.navigate("LogFood", { type: values["type"] })
	}

	return (
		<>
			<ScrollView style={styles.root}>
				<Subheading style={styles.subheading}>Meal Type</Subheading>
				<RadioButton.Group onValueChange={edit("type")} value={values["type"]}>
					<RadioButton.Item mode="android" label="Breakfast" value="breakfast" />
					<RadioButton.Item mode="android" label="Lunch" value="lunch" />
					<RadioButton.Item mode="android" label="Dinner" value="dinner" />
					<RadioButton.Item mode="android" label="Other" value="other" />
				</RadioButton.Group>
				<Text></Text>
				<Text></Text>
				{/* <Button mode="contained" onPress={openWithCamera} disabled={submitDisabled}>
					With Camera
				</Button> */}
				<Text></Text>
				<Text></Text>
				<Button mode="contained" onPress={handleUseCamera} disabled={submitDisabled}>
					Use Camera
				</Button>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
			</ScrollView>
		</>
	);
}

const styles = {
	root: {
		padding: 20,
		width: "100%",
		height: "100%",
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
	subheadingSection: {
		marginBottom: 5,
		fontSize: 15
	},
	food: {
		flex: 1,
		flexDirection: "row",
		width: "100%"
	},
	foodLeft: {
		flex: 1,
		height: 100,
		alignItems: "center",
		justifyContent: "center"
	},
	foodRight: {
		flex: 2
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: 'black',
	},
	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	capture: {
		flex: 0,
		backgroundColor: '#fff',
		borderRadius: 5,
		padding: 15,
		paddingHorizontal: 20,
		alignSelf: 'center',
		margin: 20,
	},
}