import React, { useEffect, useState, useRef } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { IconButton, Text } from "react-native-paper"
import { DateTime } from "luxon"
import DatePicker from "react-native-date-picker"
import { colors } from "../styling/theme"
import { getData } from "../net/getData"
import useAsyncStorage from "../hooks/useAsyncStorage"

export default function History() {

	const [patientID] = useAsyncStorage("localPatientID")
	const navigation = useNavigation()
	const [recentLogs, setRecentLogs] = useState({})
	const [alarms, setAlarms] = useState({
		breakfast: new Date(),
		lunch: new Date(),
		dinner: new Date(),
	})
	const [alarmOpen, setAlarmOpen] = useState("")

	const patientIDRef = useRef(patientID)

	useEffect(() => {
		patientIDRef.current = patientID
		;(async () => {
			setRecentLogs(await (await getData(`patient-recentlog?patientID=${patientIDRef.current}`)).json())
		})();
	}, [patientID, navigation.getState().routes])

	console.log({ patientID, recentLogs})

	const onConfirmAlarm = (date) => {
		onCloseAlarm()
		setAlarms({ ...alarms, [alarmOpen]: date })
	}
	const onCloseAlarm = () => setAlarmOpen("")
	const formatType = (meal) => meal.substring(0, 1).toUpperCase() + meal.substring(1)

	return (
		<ScrollView contentContainerStyle={styles.root}>
			{["breakfast", "lunch", "dinner", "other"].map((meal) => (
				<View key={meal} style={styles.meal}>
					<View style={styles.mealImageWraper}>
						<IconButton icon="food-variant" />
					</View>
					<View style={styles.mealLeft}>
						<Text style={styles.mealType}>{formatType(meal)}</Text>
						{recentLogs[meal] && recentLogs[meal].name && <Text numberOfLines={1} style={styles.mealName}>{recentLogs[meal].name}</Text>}
					</View>
					<View style={styles.mealRight}>
						{alarms[meal] ? (
							<IconButton style={styles.patientButton} icon="alarm" onPress={() => setAlarmOpen(meal)} />
						) : (
							<View style={styles.alarmButtonHolder} />
						)}
						{recentLogs[meal] && recentLogs[meal].logged && (
							<View style={styles.timestampWrapper}>
								<Text style={styles.timestamp}>last logged {DateTime.local().minus(Date.now() - recentLogs[meal].logged).toRelative()}</Text>
							</View>
						)}
					</View>
				</View>
			))}
			<DatePicker
				modal
				mode="time"
				open={alarmOpen !== ""}
				date={alarms[alarmOpen] || new Date()}
				onConfirm={onConfirmAlarm}
				onCancel={onCloseAlarm}
				minuteInterval={15}
			/>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	root: {
		padding: 20
	},
	mealImageWraper: {
		justifyContent: "center",
		alignItems: "center",
		width: 50,
		marginLeft: 10
	},
	meal: {
		backgroundColor: colors.background,
		height: 80,
		borderRadius: 5,
		marginBottom: 15,
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		shadowColor: 'rgba(0, 0, 0, 0.5)',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.8,
		shadowRadius: 2,  
		elevation: 5
	},
	mealLeft: {
		flex: 1
	},
	mealType: {
		fontSize: 20,
		marginTop: 10,
		marginLeft: 10,
		flex: 1
	},
	mealName: {
		marginLeft: 10,
		marginBottom: 11
	},
	mealRight: {
		flex: 1,
		flexDirection: "column",
		alignItems: "flex-end",
		minWidth: 100
	},
	alarmButtonHolder: {
		height: 48
	},
	timestamp: {
		marginRight: 5,
		marginTop: 3,
		marginBottom: 3
	}
})