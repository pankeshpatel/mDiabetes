import { useNavigation } from "@react-navigation/native"
import React, { useState } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { RNCamera } from "react-native-camera"
import { useCamera } from "react-native-camera-hooks"
import { launchImageLibrary,launchCamera  } from "react-native-image-picker"
import { CALORIE_MAMA_FOOD_API_KEY } from "@env"
import RNFS from 'react-native-fs';

const RECOGNITION = (key) => `https://api-2445582032290.production.gw.apicast.io/v1/foodrecognition?user_key=${key}`
export const API_KEY=`${CALORIE_MAMA_FOOD_API_KEY}`


const ENDPOINT = RECOGNITION(API_KEY)


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

	const navigation = useNavigation()

	const [{ cameraRef }, { takePicture }] = useCamera(null)

	const [photo, setPhoto] = React.useState(null);
	const [image, setImage] = React.useState(null);



	const onCapture = async () => {
		console.log("taking picture")
		const data = await takePicture()
		console.log({ data })


		// const filePath = data.uri
		// const newFilePath = RNFS.ExternalDirectoryPath + "/mdiabetes-picture.jpg"
		// RNFS.moveFile(filePath, newFilePath)
		// 	.then(() => console.log("find at " + newFilePath))
		// 	.catch(console.error)


		try {
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


			});

		} catch (e) {
			console.error(e)
		}

	}

	return (
		<View style={styles.body}>
			<RNCamera
				ref={cameraRef}
				type="back"
				style={styles.camera}
				captureAudio={false}

			>
				<Image source={3} />
				<TouchableOpacity style={styles.button} onPressOut={onCapture} />
			</RNCamera>
			{/* {image == null ? null : <Image source={image} /> } */}
			
		</View>
		
		
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
