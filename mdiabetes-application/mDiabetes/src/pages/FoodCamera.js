import { useNavigation } from "@react-navigation/native"
import React, { useState,useEffect } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { RNCamera } from "react-native-camera"
import { useCamera } from "react-native-camera-hooks"
import { launchImageLibrary,launchCamera  } from "react-native-image-picker"
import { CALORIE_MAMA_FOOD_API_KEY } from "@env"
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info'
import { withRepeat } from "react-native-reanimated"
import { Portal, Modal, Button} from 'react-native-paper';


const RECOGNITION = (key) => `https://api-2445582032290.production.gw.apicast.io/v1/foodrecognition?user_key=${key}`
export const API_KEY=`${CALORIE_MAMA_FOOD_API_KEY}`



const ENDPOINT = RECOGNITION(API_KEY)
const isSimulator =async ()=> {
	// alert(await DeviceInfo.isEmulator())
	console.log("DeviceInfo.isEmulator()", await DeviceInfo.isEmulator())
	return await DeviceInfo.isEmulator()
  }



// const example = {
// 	"results": [{
// 		"packagedgoods": true,
// 		"group": "Packaged Good",
// 		"items": [{
// 			"nutrition": {
// 				"totalCarbs": 0.875,
// 				"protein": 0.0125,
// 				"calories": 3500,
// 				"fat": 0.003,
// 			},
// 			"name": "Licorice Candy",
// 			"score": 6,
// 			"brand": "Good & Plenty",
// 			"servingSizes": [{
// 				"unit": "33.0 pieces",
// 				"servingWeight": 0.04
// 			}]
// 		}]
// 	}]
// }

const createFormData = (photo) => {
	const data = new FormData();

	data.append("photo", {
		name: photo.fileName,
		type: photo.type,
		uri: Platform.OS === "ios" ? photo.uri.replace("file://", "") : photo.uri,
	});
	console.log("FORM DATA: ", data.uri)
  
	return data;
};

// ---------------------------------------------------------------------------------------------
function verifyImagePath(path, count) {
	const newFilePath = RNFS.DocumentDirectoryPath + "/mdiabetes-picture" + count + ".jpg"
	if (RNFS.exists(newFilePath)){
		verifyImagePath(path, count+1);
		console.log("Path already EXISTS");
	} else {
		console.log("Path DOES NOT EXIST");
		RNFS.moveFile(path, newFilePath)
				.then(() => console.log("New Image File PATH: ", newFilePath))
				.catch(console.error)
	}

}				
// ---------------------------------------------------------------------------------------------


const FoodCamera = ({ route }) => {


	const [visible, setVisible] = React.useState(true);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = {backgroundColor: 'white', padding: 20};

	const navigation = useNavigation()

	const [{ cameraRef }, { takePicture }] = useCamera(null)

	const [photo, setPhoto] = React.useState(null);
	const [image, setImage] = React.useState(null);


	const [loading,setLoading] = useState(false)
	
	// useEffect(() => {

	// 	const launch = async ()=>{

	// 		// const data = await takePicture()


	// 		launchCamera({ noData: true, mediaType: "photo", maxWidth: 544, maxHeight: 544 }, async (response) => {
	// 			console.log({ response })
	// 			if(response.assets.length === 0) return
	
	// 			const apiResponse = await (await fetch(ENDPOINT, {
	// 				method: "POST",
	// 				headers: {
	// 					"Content-Type": "multipart/form-data"
	// 				},
	// 				body: createFormData(response.assets[0]),
	// 			})).json()
	// 			console.log({ rp: route.params })
	// 			navigation.navigate("LogFood", {
	// 				response: apiResponse.results,
	// 				direction: route.params.direction,
	// 				image: response.assets[0]
	// 			})
				
	
	// 			const source = { uri: data.uri }
	// 			setImage(source)
	// 			console.log("Response Data: ", response)
	
	// 		})
	

	// 	}

	// 	launch()
		

		

	// }, [])


	const LiveCamera = async ()=>{
		setLoading(true)
		launchCamera({ noData: true, mediaType: "photo", maxWidth: 544, maxHeight: 544 }, async (response) => {
			console.log({ response })
			if(response.assets.length === 0) return


			// ---------------------------------------------------------------------------------------------
			//console.log("RESPONSE ASSETS URI :  ", response.assets[0]["uri"]);
			// setPhoto(decodeURIComponent(response.assets[0]["uri"]));
			// ---------------------------------------------------------------------------------------------


			// const apiResponse = await (await fetch(ENDPOINT, {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "multipart/form-data"
			// 	},
			// 	body: createFormData(response.assets[0]),
			// })).json()
			// console.log({ rp: route.params })

			setLoading(false)
			hideModal()
			navigation.navigate("LogFood", {
				response: {},
				direction: route.params.direction,
				image: response.assets[0]
			})
			
			// ---------------------------------------------------------------------------------------------

			const source = { uri: data.uri }
			setImage(source)
			console.log("Response Data: ", response)



			// const filePath = decodeURIComponent(response.assets[0]["uri"])
			// const newFilePath = RNFS.DocumentDirectoryPath + "/mdiabetes-picture" + 12 + ".jpg"

			// const objectURL = URL.createObjectURL(filePath)
			// console.log("OBJECT URL", objectURL)

			// RNFS.moveFile(filePath, newFilePath)
			// 	.then(() => console.log("New Image File PATH: ", newFilePath))
			// 	.catch(console.error)


			// const filePath = decodeURIComponent(response.assets[0]["uri"])
			// verifyImagePath(filePath, 0);

			// ---------------------------------------------------------------------------------------------


		})

		

	}

	const FromLibrary = async ()=>{
		setLoading(true)
		launchImageLibrary({ noData: true, mediaType: "photo", maxWidth: 544, maxHeight: 544 }, async (response) => {
			console.log({ response })
			if(response.assets.length === 0) return


			// ---------------------------------------------------------------------------------------------
			//console.log("RESPONSE ASSETS URI :  ", response.assets[0]["uri"]);
			// setPhoto(decodeURIComponent(response.assets[0]["uri"]));
			// ---------------------------------------------------------------------------------------------


			const apiResponse = await (await fetch(ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "multipart/form-data"
				},
				body: createFormData(response.assets[0]),
			})).json()
			console.log({ rp: route.params })
			setLoading(false)
			hideModal()
			navigation.navigate("LogFood", {
				response: apiResponse.results,
				direction: route.params.direction,
				image: response.assets[0]
			})
			
			// ---------------------------------------------------------------------------------------------

			const source = { uri: data.uri }
			setImage(source)
			console.log("Response Data: ", response)



			// const filePath = decodeURIComponent(response.assets[0]["uri"])
			// const newFilePath = RNFS.DocumentDirectoryPath + "/mdiabetes-picture" + 12 + ".jpg"

			// const objectURL = URL.createObjectURL(filePath)
			// console.log("OBJECT URL", objectURL)

			// RNFS.moveFile(filePath, newFilePath)
			// 	.then(() => console.log("New Image File PATH: ", newFilePath))
			// 	.catch(console.error)


			// const filePath = decodeURIComponent(response.assets[0]["uri"])
			// verifyImagePath(filePath, 0);

			// ---------------------------------------------------------------------------------------------


		})


	}


	const onCapture = async () => {
		console.log("taking picture")
		const data = await takePicture()
		// console.log({ data })


		// const filePath = data.uri
		// const newFilePath = RNFS.ExternalDirectoryPath + "/mdiabetes-picture.jpg"
		// RNFS.moveFile(filePath, newFilePath)
		// 	.then(() => console.log("find at " + newFilePath))
		// 	.catch(console.error)


		try {
			!isSimulator() ?
			
			launchImageLibrary({ noData: true, mediaType: "photo", maxWidth: 544, maxHeight: 544 }, async (response) => {
				console.log({ response })
				if(response.assets.length === 0) return


				// ---------------------------------------------------------------------------------------------
				//console.log("RESPONSE ASSETS URI :  ", response.assets[0]["uri"]);
				// setPhoto(decodeURIComponent(response.assets[0]["uri"]));
				// ---------------------------------------------------------------------------------------------


				const apiResponse = await (await fetch(ENDPOINT, {
					method: "POST",
					headers: {
						"Content-Type": "multipart/form-data"
					},
					body: createFormData(response.assets[0]),
				})).json()
				console.log({ rp: route.params })
				navigation.navigate("LogFood", {
					response: apiResponse.results,
					direction: route.params.direction,
					image: response.assets[0]
				})
				
				// ---------------------------------------------------------------------------------------------

				const source = { uri: data.uri }
				setImage(source)
				console.log("Response Data: ", response)



				// const filePath = decodeURIComponent(response.assets[0]["uri"])
				// const newFilePath = RNFS.DocumentDirectoryPath + "/mdiabetes-picture" + 12 + ".jpg"

				// const objectURL = URL.createObjectURL(filePath)
				// console.log("OBJECT URL", objectURL)

				// RNFS.moveFile(filePath, newFilePath)
				// 	.then(() => console.log("New Image File PATH: ", newFilePath))
				// 	.catch(console.error)


				// const filePath = decodeURIComponent(response.assets[0]["uri"])
				// verifyImagePath(filePath, 0);

				// ---------------------------------------------------------------------------------------------


			})
			
			:
			
			
		   launchCamera({ noData: true, mediaType: "photo", maxWidth: 544, maxHeight: 544 }, async (response) => {
				console.log({ response })
				if(response.assets.length === 0) return


				// ---------------------------------------------------------------------------------------------
				//console.log("RESPONSE ASSETS URI :  ", response.assets[0]["uri"]);
				// setPhoto(decodeURIComponent(response.assets[0]["uri"]));
				// ---------------------------------------------------------------------------------------------


				const apiResponse = await (await fetch(ENDPOINT, {
					method: "POST",
					headers: {
						"Content-Type": "multipart/form-data"
					},
					body: createFormData(response.assets[0]),
				})).json()
				console.log({ rp: route.params })
				navigation.navigate("LogFood", {
					response: apiResponse.results,
					direction: route.params.direction,
					image: response.assets[0]
				})
				
				// ---------------------------------------------------------------------------------------------

				const source = { uri: data.uri }
				setImage(source)
				console.log("Response Data: ", response)



				// const filePath = decodeURIComponent(response.assets[0]["uri"])
				// const newFilePath = RNFS.DocumentDirectoryPath + "/mdiabetes-picture" + 12 + ".jpg"

				// const objectURL = URL.createObjectURL(filePath)
				// console.log("OBJECT URL", objectURL)

				// RNFS.moveFile(filePath, newFilePath)
				// 	.then(() => console.log("New Image File PATH: ", newFilePath))
				// 	.catch(console.error)


				// const filePath = decodeURIComponent(response.assets[0]["uri"])
				// verifyImagePath(filePath, 0);

				// ---------------------------------------------------------------------------------------------


			})

		} catch (e) {
			console.error(e)
		}

	}

	if(loading){
		return <Text>Loading...</Text>
	}

	return (
		<>
		<Portal>
			<Modal
				visible={visible}
				onDismiss={hideModal}
				contentContainerStyle={containerStyle}>
				<Text style={{textAlign: 'center'}}>
				Please Select :
				</Text>
				<View>
				{/* <br/> */}
				<Text></Text>
				<Button
					onPress={LiveCamera}>
					Take Live photo
				</Button>
				<Button onPress={FromLibrary}>Take from Library</Button>
				</View>
			</Modal>
			</Portal>

		<View style={styles.body}>
			<RNCamera
				ref={cameraRef}
				type="back"
				style={styles.camera}
				captureAudio={false}

			>
				<TouchableOpacity onPressOut={()=>{navigation.navigate("LogFood",{
					response: "",
					direction: "",
					image: ""

				})}}>
				<Image source={3} style={styles.button}   />
				{/* <TouchableOpacity style={styles.button} onPressOut={onCapture} /> */}
				</TouchableOpacity>

			</RNCamera>
		
			
		</View>

		</>
		
		
	)


}


const styles = StyleSheet.create({
	body: {
		flex: 1
	},
	camera: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-end"
	},
	button: {
		width: 50,
		height: 50,
		borderRadius: 50,
		backgroundColor: "white",
		opacity: 0.75,
		marginBottom: 80,
		marginTop: 20
	}
})

export default FoodCamera
