import React from 'react';
import { View, Image, Text } from 'react-native';
import { Button, IconButton } from "react-native-paper"
import { SafeAreaView } from 'react-native-safe-area-context'
import BackgroundImg from "../assets/green-background.jpg"
import DayView from '../components/DayView';

export default function Welcome({ navigation }) {

	// const hasWarning = true

	// const onClickLogFood = () => navigation.navigate("LogFoodIntro")
	// const onOpenHistory = () => navigation.navigate("History")
	// const onLogout = () => navigation.navigate("PatientLogin")

	return (
		<SafeAreaView style={styles.root}>
			<View style={styles.header}>
				<Image source={BackgroundImg} style={styles.background}/>
				<View style={styles.headerTop}>
					<View>
						<Text style={styles.deployment}>Day 1 of 44</Text>
						<Text style={styles.title}>Welcome</Text>
					</View>
					<View style={{ flex: 1}} />
					<IconButton icon="history" onPress={() => {navigation.navigate("History")}} />
					<IconButton icon="logout" onPress={() => {navigation.navigate("PatientLogin")}} />
				</View>
				{/* <Text style={styles.smallText}>Foodlogs today: 1</Text> */}
				{/* <Text style={{
					...styles.warning,
					opacity: hasWarning ? 1 : 0
				}}>You have unanswered daily questions.</Text> */}
				<Button
					mode="contained"
					icon="food-fork-drink"
					style={styles.logButton}
					contentStyle={styles.logButtonContent}
					labelStyle={styles.logButtonLabel}
				
					onPress={() => {navigation.navigate("LogFoodIntro")}}
				>
					<Text style={styles.logButtonLabelText}>&nbsp;&nbsp;Log Food</Text>
				</Button>
			</View>
			<DayView />
		</SafeAreaView>
	);
}

const styles = {
	root: {
		width: "100%",
		height: "100%",
		position: "absolute"
	},
	header: {
		height: 250,
		paddingHorizontal: 20,
		paddingTop: 5
	},
	headerTop: {
		flexDirection: "row",
	},
	title: {
		fontSize: 30,
		marginBottom: 20
	},
	background: {
		height: 300,
		position: "absolute",
		top: -100,
		left: -20,
		height: 350,
		width: "125%"
	},
	deployment: {
		fontSize: 15
	},
	smallText: {
		fontSize: 15
	},
	warning: {
		fontSize: 15,
		color: "red",
		marginTop: 25,
		marginBottom: 5
	},
	logButton: {
		width: 200,
		marginTop: 10,
		paddingRight: 10,
		height: 75,
		alignSelf: "center"
	},
	logButtonContent: {
		flexDirection: "column",
		alignItems: "center",
		height: "100%"
	},
	logButtonLabel: {
		width: 100,
		fontSize: 35
	},
	logButtonLabelText: {
		fontSize: 15
	}
}