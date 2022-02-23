import React, { useEffect } from 'react'
import { View, Image, Text } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import useAsyncStorage from "../hooks/useAsyncStorage"
import LogoImg from "../assets/logo.png"
import { colors } from '../styling/theme'

// INTRO


export default function Intro() {

	const navigation = useNavigation()

	const [localUserType, setLocalUserType] = useAsyncStorage("localUserType")

	useEffect(() => {
		setLocalUserType("admin")
		const timeout = setTimeout(() => {
			if(localUserType === "user") {
				navigation.navigate("Welcome")
			} else {
				navigation.navigate("AdminLogin")
			}
		}, 3000)

		return () => clearTimeout(timeout)
	}, [localUserType])

	return (
		<View style={styles.root}>
			<Image source={LogoImg} style={styles.image} />
			<Text style={styles.title}>kHealth Diabetes</Text>
			<Text style={styles.tagline}>A tool to improve blood sugar control in patients with diabetes</Text>
		</View>
	)
}

const styles = {
	root: {
		flex: 1,
		alignItems: 'center',
		flexDirection: "column"
	},
	image: {
		marginTop: 60,
		marginBottom: 20,
		height: "30%",
		aspectRatio: 1,
	},
	title: {
		color: colors.titleText,
		fontSize: 32,
		marginBottom: 32,
	},
	tagline: {
		color: colors.darkGreen,
		fontSize: 20,
	}
}