import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Keyboard, Alert, Image, Platform} from "react-native"
import { RNCamera } from 'react-native-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput, Button, Text, RadioButton, Title, Subheading, IconButton, Checkbox } from "react-native-paper"
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { BASE_VOLUME_ESTIMATION_SERVER } from "@env"

export const VOLUME_ESTIMATION_SERVER=`${BASE_VOLUME_ESTIMATION_SERVER}`

export default function LogFood({ route, navigation }) {

	const nav = useNavigation()
	// const [image, setImage] = React.useState(null)
	const [topView, setTopView] = React.useState(null)
	const [sideView, setSideView] = React.useState(null)

	const [topViewBinary, setTopViewBinary] = React.useState(null)
	const [sideViewBinary, setSideViewBinary] = React.useState(null)

	let colors = {};
	let  foodItems = [];


	const [apiResponse, setApiResponse] = useState({
		top: null,
		side: null
	})

	const [step, setStep] = useState("camera")



	useEffect(() => {
        // console.log({ p: route.params })
        if(route.params && route.params.response) {

            console.log("USE EFFECT: ", route.params.image)
            const photos = route.params.image
            //setTopView(Platform.OS === "ios" ? photos.replace("file://", "")  :  photos)
            view(photos)

            // TO STORE IN DOCUMENTS FOLDER
            // const filePath = decodeURIComponent(route.params.topView)
            // const newFilePath = RNFS.DocumentDirectoryPath + "/mdiabetes-picture" + 3 + ".jpg"
            // setTopView(route.params.topView)
            // RNFS.moveFile(filePath, newFilePath)
            //  .then(() => { setTopView(newFilePath), console.log("New topView File PATH: ", newFilePath)
            // })
            //  .catch(console.error)



            if(route.params.response.length > 0) {
                const key = route.params.direction
                setApiResponse({
                    ...apiResponse,
                    [key]: route.params.response[0]
                })
            } else {
                Alert.alert("Could not identify food.")
            }
        }
    }, [nav.getState().routes, route && route.params && route.params.direction && route.params.response && route.params.response.length])

	const [values, setValues] = useState({
		"predicted-food": [],
		"based-on-count": []
	})

	const edit = (key) => (value) => setValues((old) => ({ ...old, [key]: value }))

	// const submit = () => navigation.navigate("Nutrition",  values["predicted-food"] ? {
	// 	selection: apiResponse.items.find(i => i.name === values["predicted-food"]),
	// 	mealType: values["type"]
	// } : {
	// 	// ?
	// })
	const submit = () => {

	console.log("values",values["based-on-count"])

	let food ={};


	values["based-on-count"].map((val,index)=> {
		food[val["name"]] = Number(val["value"])
	})

	// console.log("foooooooooood",food)

	

	


		const header = {
			'Content-Type' : 'multipart/form-data'
		}

		// const body = {
		// 	food : {
		// 		"rice": 1,
		// 		"potato": 1,
		// 		"fish": 1,
		// 		"mozzarella sticks": 4
		// 	},
		// 	top_view_path : topView,
		// 	//top_view_url : "",
		// 	side_view_path : sideView,
		// 	//side_view_url : ""
		// }


		let body = new FormData();
		body.append('food', JSON.stringify(food))
		body.append('top_view_path', {name:topViewBinary.fileName,type:topViewBinary.type,uri:Platform.OS === "ios" ? topViewBinary["uri"].replace("file://", "")  :  topViewBinary["uri"]})
		body.append('side_view_path', {name:sideViewBinary.fileName,type:sideViewBinary.type,uri:Platform.OS === "ios" ? sideViewBinary["uri"].replace("file://", "")  :  sideViewBinary["uri"]})
		
		console.log("TTVB:", JSON.stringify(topViewBinary))
		//console.log("BDATA", formdata)
		console.log("TV: ", topView)
		console.log("BODY:::" , body)
		// axios.post("http://192.168.0.11:8080/api1", body, header)
		// 	 .then((res) => {
		// 		console.log("RES:  ", res)
		// 	 })
		// 	 .catch((error) => {
		// 		 console.log("ERROR:  ", error)
		// 	 })

		fetch(VOLUME_ESTIMATION_SERVER + "api1", {method:'POST', header:{
			"Content-Type" : "multipart/form-data" }, body : body
		})
		.then((res) => res.json())
		.then((res) => {
			console.log('response', JSON.stringify(res))

			colors = res.colors
			foodItems = res.foodItems

          

			fetch(`${VOLUME_ESTIMATION_SERVER}` + "download/" + `${JSON.stringify(res.download)}`)
			.then((res) => res)
			.then((res) => { 
			  
			  console.log("res", (res.url).replace("%22","").slice(0,-3) )

			  console.log(colors,foodItems,res.url)

			  navigation.navigate("ColorMap", {
				colors: colors,
				foodItems: foodItems,
				image: (res.url).replace("%22","").slice(0,-3)
			})
			
			  //   SetTopView(((res.url).replace("%22","").slice(0,-3)).toString()) 


			}
		  
		  )

			


		})
		.catch((error) => console.log("ERROR :  ", error))



	}


	const submitDisabled = !values["coin"] || !apiResponse.top || !apiResponse.side

	const takePictureTop = () => navigation.navigate("FoodCamera", { direction: "top" })
	const takePictureSide = () => navigation.navigate("FoodCamera", { direction: "side" })

	const togglePredictedFood = (value) => () => {
		if(values["predicted-food"].includes(value)) {
			edit("predicted-food")(
				values["predicted-food"].filter(f => f !== value)
			)
		} else {
			edit("predicted-food")(
				[ ...values["predicted-food"], value ]
			)
		}
	}

	const toggleCount = (value) => () => {
		if(values["based-on-count"].find(i => i.name === value)) {
			edit("based-on-count")(
				values["based-on-count"].filter(i => i.name !== value)
			)
		} else {
			edit("based-on-count")(
				[ ...values["based-on-count"], { name: value, value: 1 }]
			)
		}
	}

	const editCount = (name) => (value) => {
		edit("based-on-count")(
			values["based-on-count"].map(i => {
				if(i.name === name) {
					return {
						...i,
						value
					}
				}
				return i
			})
		)
	}

	const getSelectedFoodNames = () => {
		const manual = (values["Extra Food"] || "").split(",").map(s => s.trim()).filter(s => s && s.length)
		return [ ...new Set([ ...values["predicted-food"], ...manual ])]
	}

	function view(photos){
        if (topView == null){
            setTopView(Platform.OS === "ios" ? photos["uri"].replace("file://", "")  :  photos["uri"])
			setTopViewBinary(photos)
            //console.log("PHOTOS:   ", photos)
        }
        else {
            setSideView(Platform.OS === "ios" ? photos["uri"].replace("file://", "")  :  photos["uri"])
			setSideViewBinary(photos)
        }
    }





	if(step === "camera") {
		return (
			<ScrollView style={styles.root}>
				<Subheading style={styles.subheading}>Choose the type of coin:</Subheading>
				<RadioButton.Group onValueChange={edit("coin")} value={values["coin"]}>
					<RadioButton.Item mode="android" label="Penny" value="penny" />
					<RadioButton.Item mode="android" label="Nickel" value="nickel" />
					<RadioButton.Item mode="android" label="Dime" value="dime" />
					<RadioButton.Item mode="android" label="Quarter" value="quarter" />
				</RadioButton.Group>
				<Text></Text>
				<View style={styles.food}>
					<View style={styles.foodLeft}>


					{topView == null ? 
						<TouchableOpacity onPress={() => {navigation.navigate("FoodCamera", { direction: "top" })}}>
							<IconButton size={50} icon="camera" />
						</TouchableOpacity>
						:
						<TouchableOpacity onPress={() => {navigation.navigate("FoodCamera", { direction: "top" })}}>
							<Image size={50} source={{uri:topView}} style={{width: 200, height: 130}}/>
						</TouchableOpacity>
					 }


					</View>
					<View style={styles.foodRight}>
						<Text style={styles.subheadingSection}>Top View</Text>
						{/* {apiResponse && apiResponse.items.map((item) => (
							<Checkbox.Item
								key={item.name}
								mode="android"
								label={item.name}
								onPress={togglePredictedFood(item.name)}
								status={values["predicted-food"].includes(item.name)}
							/>
						))} */}
					</View>
				</View>
				<View style={styles.food}>
					<View style={styles.foodLeft}>



					{sideView == null ? 
						<TouchableOpacity  onPress={() => {navigation.navigate("FoodCamera", { direction: "side" })}}>
							<IconButton size={50} icon="camera" />
						</TouchableOpacity>
						:
						<TouchableOpacity onPress={() => {navigation.navigate("FoodCamera", { direction: "side" })}}>
							<Image size={50} source={{uri:sideView}} style={{width: 200, height: 130, marginTop: 70}}/>
						</TouchableOpacity>
					}



					</View>
					<View style={styles.foodRight}>
						<Text style={styles.subheadingSection}>Side View</Text>
						{/* {apiResponse && apiResponse.items.map((item) => (
							<Checkbox.Item
								key={item.name}
								mode="android"
								label={item.name}
								onPress={togglePredictedFood(item.name)}
								status={values["predicted-food"].includes(item.name)}
							/>
						))} */}
					</View>
				</View>
				<Text />
				<Text />
				<Text />
				<Button style={{marginTop:30}} mode="contained" onPress={() => setStep("food select")} disabled={submitDisabled}>
					Next
				</Button>
			</ScrollView>
		)
	} else if(step === "food select") {
		return (
			<ScrollView style={styles.root}>
				<View style={styles.selectTop}>
					{/* <View style={styles.selectLeft}>
					
					</View> */}
					<View style={styles.selectRight}>
						{apiResponse && (apiResponse.top || apiResponse.side || { items: [] }).items.map((item) => (
							<Checkbox.Item
								key={item.name}
								mode="android"
								label={item.name}
								onPress={togglePredictedFood(item.name)}
								status={values["predicted-food"].includes(item.name) ? "checked" : "unchecked"}
							/>  
						))}
					</View>
				</View>

				<View style={{flex:1, marginBottom:'25%'}}>
					<Subheading>Enter the missed food item here separated by comma if any</Subheading>
					<TextInput
						style={styles.input}
						autoCorrect
						value={values["Extra Food"]}
						onChangeText={edit("Extra Food")}
					/>
					<Button mode="contained" onPress={() => setStep("food count")} disabled={submitDisabled}>
						Next
					</Button>
				</View>
			</ScrollView>
		)
	} else {
		return (
			<ScrollView style={styles.root}>
				<Subheading>If there are any food item based on count, enter here</Subheading>	
				{getSelectedFoodNames().map((item) => (
					<View key={item} style={{ alignItems: "center", flexDirection: "row" }}>
						<Checkbox.Item
							mode="android"
							onPress={toggleCount(item)}
							status="checked"
							status={values["based-on-count"].find((i) => i.name === item) ? "checked" : "unchecked"}
						/>
						<Text style={{
							maxWidth: 100,
							minWidth: 100
						}}>{item}</Text>
						<TextInput
							style={styles.countInput}
							keyboardType="numeric"
							disabled={!values["based-on-count"].find((i) => i.name === item)}
							mode="outlined"
							value={(values["based-on-count"].find((i) => i.name === item) || { value: "" }).value}
							onChangeText={editCount(item)}
						/>
					</View>
				))}
				<Button mode="contained" onPress={submit} disabled={submitDisabled}>
					Submit
				</Button>
			</ScrollView>
		)
	}
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
		flex: 2,
		height: 100,
		alignItems: "center",
		justifyContent: "center"
	},
	foodRight: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
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
	selectTop: {
		flexDirection: "row"
	},
	selectLeft: {
		flex: 1
	},
	selectRight: {
		flex: 1,
		paddingHorizontal: 10,
	},
	countCheck: {
	},
	countInput: {
		flex: 1,
		height: 27
	}

}