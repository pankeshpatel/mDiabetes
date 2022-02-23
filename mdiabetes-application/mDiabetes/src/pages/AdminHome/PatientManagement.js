import React, { useState, useEffect } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { IconButton, Text } from "react-native-paper"
import { DateTime } from "luxon"
import { colors } from "../../styling/theme"
import { getData } from "../../net/getData"
import useAsyncStorage from "../../hooks/useAsyncStorage"
import { useNavigation } from "@react-navigation/core"
// import { patient } from "../../../../../mDiabetes-Server/app/models"

export default function PatientManagement({ }) {

	const [_, setLocalUserType] = useAsyncStorage("localUserType")
	const [authToken] = useAsyncStorage("authToken")
	const [username] = useAsyncStorage("username")

	const [patients, setPatients] = useState([ ])

	const [loading, setLoading] = useState(false)

	const navigation = useNavigation()

	const onFocus = () => {
		setLoading(true);
		getPatientData()
	}

	useEffect(() => {
		if(!authToken || !username) return () => {}
		onFocus()
		navigation.removeListener("focus", onFocus)
		navigation.addListener("focus", onFocus)
	}, [authToken, username])

	// ---------
	const getPatientData = async () => {
		const patientData = await (await getData("patient-list", {authToken, username})).json()
		// if(patientData.success) {
	
			// console.log(`DATA  : `, patientData.patients[0]["_doc"].initialData["age"])
			//console.log(`DATA  : `, patientData.patients[0]["_doc"])
			console.log(patientData.patients)
			
			setPatients(Object.entries(patientData.patients))

		// }s
		setLoading(false)
		//console.log("Patient getData :  " +  patients)
	}
	// ---------

	const onOpenPatient = (patient) => {
		setLocalUserType("user")
		navigation.navigate("Welcome")
	}

	const onRemovePatient = async (Id) => {
		const newPatients = patients.filter(([key,value]) => value["_doc"].ID !== Id)
		console.log("NEW PATIENTS : ", newPatients )
		setPatients(newPatients)
		await (await getData("patient-delete?ID=" + Id, {authToken, username})).json()
	}

	const test = () => {

		Object.entries(patients).map(([index,value]) => {
			console.log("TEST  :", value["_doc"].ID)
			console.log("TEST  :", value["_doc"].timestamp)


		})
		
		return "TEST"
		
	}




	return (
		<ScrollView contentContainerStyle={styles.root}>

			{loading && <Text style={styles.loadingText}>Loading...</Text>}

{/* 
			{!loading && 
					<View>
						<Text> HELLO </Text>
						<Text> {patient.ID} </Text>
					</View>
		
			} */}

					{/* PROBLEM LINE */}
				{/* // patients.filter((p) => !!p.initialData).sort((a, b) => b.timestamp - a.timestamp).map((patients) => ( */}

			
			{/* // test(patients[i]["_doc"].timestamp) */}
				{!loading &&

					patients.map(([index,value]) => {
						// console.log("TEST  :", value["_doc"].ID)
						// console.log("TEST  :", value["_doc"].timestamp)

						return (
							<View key={value["_doc"].ID} style={styles.patient}>
							<Text numberOfLines={1} style={styles.patientID}> {value["_doc"].ID} </Text>
							<View style={styles.patientRight}>
								<View style={styles.patientButtons}>
									<IconButton style={styles.patientButton} icon="open-in-app"
									 onPress={() => onOpenPatient(patients) }
									
									/>

									<IconButton style={styles.patientButton} icon="trash-can" 
									 onPress={() => onRemovePatient(value["_doc"].ID)} 
									/>
								</View>
								<View style={styles.patientTimestampWrapper}>
									<Text style={styles.patientTimestamp}>Created {Date.now() - value["_doc"].timestamp < 1000 ? "just now" : DateTime.local().minus(Date.now() - value["_doc"].timestamp).toRelative()}</Text>
								</View>
							</View>
						</View>
						)


					})

			
				}


			{/* {!loading && patients
				.filter((p) => !p.initialData)
				.sort((a, b) => b.timestamp - a.timestamp)
				.map(({patient}) => (
				//return(
					<View key={patient.ID} style={styles.patient}>
						<Text numberOfLines={1} style={styles.patientID}> ${patient.ID} </Text>
						<View style={styles.patientRight}>
							<View style={styles.patientButtons}>
								<IconButton style={styles.patientButton} icon="open-in-app" onPress={() => onOpenPatient(patient)} />
								<IconButton style={styles.patientButton} icon="trash-can" onPress={() => onRemovePatient(patient)} />
							</View>
							<View style={styles.patientTimestampWrapper}>
								<Text style={styles.patientTimestamp}>Created {Date.now() - patient.timestamp < 1000 ? "just now" : DateTime.local().minus(Date.now() - patient.timestamp).toRelative()}</Text>
							</View>
						</View>
					</View>
				//);
			//})
				))
			} */}
			{!loading && patients.length === 0 && <Text style={styles.loadingText}>No patients to display.</Text>}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	root: {
		padding: 20
	},
	patient: {
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
	patientID: {
		fontSize: 20,
		marginTop: 27,
		marginLeft: 10,
		flex: 1
	},
	patientRight: {
		flex: 1,
		flexDirection: "column",
		alignItems: "flex-end"
	},
	patientButtons: {
		flex: 1,
		flexDirection: "row"
	},
	patientButton: {
		width: 48,
		margin: 2,
		height: 48,
		borderRadius: 25
	},
	patientTimestampWrapper: {
		borderTopColor: "black",
		borderTopWidth: 1,
		width: 200
	},
	patientTimestamp: {
		textAlign: "right",
		marginRight: 5,
		marginTop: 3,
		marginBottom: 3
	},
	loadingText: {
		textAlign: "center",
		marginVertical: 20
	}
})