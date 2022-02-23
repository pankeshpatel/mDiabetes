import React, { useEffect, useRef, useState } from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { IconButton, Button, Text } from "react-native-paper"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import DatePicker from "react-native-date-picker"
import PieChart from 'react-native-pie-chart'
import { DateTime } from "luxon"
import useAsyncStorage from '../hooks/useAsyncStorage'
import { getData } from '../net/getData';
import { useNavigation } from "@react-navigation/native"
import Remount from "./Remount"

export default function DayView() {

	const navigation = useNavigation()

	const [date, setDate] = useState(new Date(new Date(Date.now()).setHours(0, 0, 0, 0)))
	const [dateOpen, setDateOpen] = useState(false)

	const [dateString, setDateString] = useState("")

	const [patientID] = useAsyncStorage("localPatientID")

	const [data, setData] = useState([])
	const [calories, setCalories] = useState({
		amount: 0,
		percent: 0
	})

	const onConfirmDate = (date) => {
		onCloseDate()
		setDate(date)
	}

	const onOpenDate = () => setDateOpen(true)
	const onCloseDate = () => setDateOpen(false)

	const isToday = () => new Date().setHours(0, 0, 0, 0) === new Date(date.valueOf()).setHours(0, 0, 0, 0)

	const incrementDay = () => setDate(DateTime.fromJSDate(date).plus({ days: 1 }).toJSDate())
	const decrementDay = () => setDate(DateTime.fromJSDate(date).plus({ days: -1 }).toJSDate())

	const getInfo = async (_date, _patientID) => {
		if(!_patientID) return
		setDateString(isToday() ? "Today" : DateTime.fromJSDate(_date).toFormat("MMMM dd, yyyy"));

		const query = "?patientID=" + _patientID + "&date=" + _date.valueOf()

		const response = await (await getData(`patient-view${query}`)).json()
		console.log({ date, response })
		setCalories(() => ({ ...response.find(r => r.name === "Calories") }))
		setData(() => response.filter(r => r.name !== "Calories"))
	}

	useEffect(() => {
		getInfo(date, patientID)
	}, [date, patientID])

	useEffect(() => {
		setTimeout(() => getInfo(date, patientID), 500)
	}, [date, patientID, navigation.getState().routes])

	const getPortion = (nutrient) => Number(nutrient.amount) === 0 
		? 0
		: ((nutrient.amount / data.reduce((prev, curr) => prev + Number(curr.amount), 0)) * 100).toFixed(2)

	const hasData = data.length > 0 && !data.every((n) => Number(n.amount) === 0)

    const series = hasData ? data.map((n) => Number(n.amount)) : [0]
    const sliceColor = hasData ? data.map((n) => n.color) : ["white"]

	return (
		<View style={styles.root}>
			<View style={styles.selector}>
				<IconButton
					onPress={decrementDay}
					style={styles.selectorButtonWrapper}
					icon={() => <Icon style={styles.selectorButton} name="menu-left" />}
				/>
				<View style={styles.selectorCenter}>
					<Button
						icon="menu-down"
						contentStyle={{ flexDirection: "row-reverse" }}
						onPress={onOpenDate}
					>
						Day View
					</Button>
					<Text style={styles.now}>
						{dateString}
					</Text>
				</View>
				<IconButton
					onPress={incrementDay}
					style={styles.selectorButtonWrapper}
					icon={() => <Icon style={styles.selectorButton} name="menu-right" />}
				/>
			</View>
			<Remount value={date}>
				{/* <PieChart
					widthAndHeight={Dimensions.get("window").width * (2/3)}
					series={series}
					sliceColor={sliceColor}
				/> */}
			</Remount>
			{/* <View style={styles.content}>
				<View style={styles.nutrition}>
					<View style={styles.nutrientRow}>
						<View style={styles.nutrientSquare} />
						<View style={styles.nutrientLeft} />
						<View style={styles.nutrientRight}>
							<Text style={styles.nutrientHeader}>Total</Text>
						</View>
					</View>
					{data.map((nutrient) => (
						<View key={nutrient.name} style={styles.nutrientRow}>
							<View style={{ ...styles.nutrientSquare, backgroundColor: nutrient.color }} />
							<View style={styles.nutrientLeft}>
								<Text>{nutrient.name}</Text>
								<Text>&nbsp;({Number((Number(nutrient.amount) * 1000).toFixed(2))}{nutrient.name !== "Calories" ? "g" : ""})</Text>
							</View>
							<View style={styles.nutrientRight}>
								<Text style={styles.nutrientData}>{Number(getPortion(nutrient))}%</Text>
							</View>
						</View>
					))}
					<View style={styles.nutrientRow}>
						<View style={{ ...styles.nutrientSquare, backgroundColor: "transparent" }} />
						<View style={styles.nutrientLeft}>
							<Text>{Number(calories.amount)} Calories</Text>
						</View>
						<View style={styles.nutrientRight}>
						</View>
					</View>
				</View>
			</View> */}
			<DatePicker
				modal
				mode="date"
				open={dateOpen}
				date={date}
				onConfirm={onConfirmDate}
				onCancel={onCloseDate}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		alignItems: "center"
	},
	selector: {
		flex: 1,
		flexDirection: "row",
		width: "100%",
		maxHeight: 60,
		borderBottomWidth: 1,
		marginBottom: 10
	},
	selectorButtonWrapper: {
		height: 50,
		width: 50,
		borderRadius: 25
	},
	selectorButton: {
		height: 50,
		fontSize: 30,
		marginTop: 20
	},
	selectorCenter: {
		flex: 1,
		alignItems: "center",
		height: 50
	},
	now: {
		fontSize: 15
	},
	nutrientRow: {
		flexDirection: "row",
		marginVertical: 3
	},
	nutrientLeft: {
		flexDirection: "row",
		width: 200,
		minWidth: 200
	},
	nutrientRight: {
		flexDirection: "row"
	},
	nutrientHeader: {
		fontWeight: "bold",
		textAlign: "center",
		width: 75
	},
	nutrientData: {
		textAlign: "center",
		width: 75
	},
	nutrientGoal: {
		color: "purple"
	},
	content: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center"
	},
	nutrientSquare: {
		width: 15,
		height: 15,
		marginRight: 15
	}
})