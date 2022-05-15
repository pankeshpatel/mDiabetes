import React, { useState, useEffect } from 'react';
import { Alert, View,ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput, Button, Text } from "react-native-paper"
import { SafeAreaView } from 'react-native-safe-area-context';
import { getData } from '../net/getData';
import useAsyncStorage from "../hooks/useAsyncStorage"

const esc = encodeURIComponent

export default function AdminLogin({ navigation }) {

	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const [_authToken, setAuthToken] = useAsyncStorage("authToken")
	const [_username, setUsernameStorage] = useAsyncStorage("username")


	useEffect(() => {
		const unsubscribe = navigation.addListener('blur', () => setTimeout(() => {
			setUsername("")
			setPassword("")
		}, 1000));
	
		return unsubscribe;
	}, [navigation]);

	const submit = async () => {
		const response = await (await getData(`login?username=${esc(username)}&password=${esc(password)}`)).json()
		console.log(response)
		if(response.success) {
			await setAuthToken(response.authToken)
			await setUsernameStorage(username)
			navigation.navigate("AdminHome")
		} else {
			Alert.alert("Could not log in. Please check the username and password.")
		}
	}

	const submitDisabled = username.length === 0 || password.length === 0

	return (
		<SafeAreaView style={styles.root}>
			<ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{flexGrow: 1}}>
				<Text style={styles.title}>Admin Login</Text>
				<TextInput
					style={styles.input}
					autoCorrect={false}
					autoCapitalize="none"
					autoFocus
					label="Username"
					value={username}
					onChangeText={setUsername}
					onBlur={()=>setUsername(username.trim())}
				/>
				<TextInput
					style={styles.input}
					label="Password"
					value={password}
					onChangeText={setPassword}
					onBlur={()=>{setPassword(password.trim())}}
					secureTextEntry
				/>
				<Button mode="contained" onPress={submit} disabled={submitDisabled}>
					SUBMIT
				</Button>
				<View style={{ flex: 1 }} />
				<TouchableOpacity onPress={() => navigation.navigate("PatientLogin")}>
					<Text style={styles.link}>Tap Here for Patient Login</Text>
				</TouchableOpacity>
			</ScrollView>
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