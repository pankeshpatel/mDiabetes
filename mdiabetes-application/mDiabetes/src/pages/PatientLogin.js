import React, { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput, Button, Text } from "react-native-paper"
import { SafeAreaView } from 'react-native-safe-area-context';
import useAsyncStorage from '../hooks/useAsyncStorage';
import { getData } from '../net/getData';

export default function PatientLogin({ navigation }) {

	const [patientID, setPatientID] = useState("")
	const [confirmID, setConfirmID] = useState("")

	const [_, setLocalPatientID] = useAsyncStorage("localPatientID")

	useEffect(() => {
		const unsubscribe = navigation.addListener('blur', () => setTimeout(() => {
			setPatientID("")
			setConfirmID("")
		}, 1000));
	
		return unsubscribe;
	}, [navigation]);

	const submit = async () => {
		const response = await (await getData(`patient-login?ID=${encodeURIComponent(patientID)}`)).json()
		if(response.success) {
			await setLocalPatientID(patientID)
			navigation.navigate("Welcome")
		} else {
			Alert.alert("Please check the patient ID and try again.")
		}
	}

	const submitDisabled = patientID.length === 0 || confirmID.length === 0 || patientID !== confirmID

	return (
		<SafeAreaView style={styles.root}>
			<Text style={styles.title}>Patient Login</Text>
			<TextInput
				style={styles.input}
				autoCorrect={false}
				autoCapitalize="none"
				autoFocus
				label="Patient ID"
				value={patientID}
				onChangeText={setPatientID}
			/>
			<TextInput
				autoCapitalize="none"
				style={styles.input}
				label="Confirm Patient ID"
				value={confirmID}
				onChangeText={setConfirmID}
			/>
			<Button mode="contained" onPress={submit} disabled={submitDisabled}>
				SUBMIT
			</Button>
			<View style={{ flex: 1 }} />
			<TouchableOpacity onPress={() => navigation.navigate("AdminLogin")}>
				<Text style={styles.link}>Tap Here for Admin Login</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = {
	root: {
		padding: 20,
		width: "100%",
		height: "100%",
	},
	input: {
		marginBottom: 25
	},
	title: {
		fontSize: 20,
		marginBottom: 25,
		textAlign: "center"
	},
	link: {
		fontSize: 14,
		textAlign: "center",
		marginBottom: 25,
		color: "rgba(0, 0, 255, 0.5)"
	}
}