import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Keyboard, Alert,TextInput ,Pressable} from "react-native"
import { RNCamera } from 'react-native-camera';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {  Button, Text, RadioButton, Title, Subheading, IconButton } from "react-native-paper"
import { SafeAreaView } from 'react-native-safe-area-context';

import { BASE_VOLUME_ESTIMATION_SERVER } from "@env"

export const VOLUME_ESTIMATION_SERVER=`${BASE_VOLUME_ESTIMATION_SERVER}`

export default function WithOutCamera({ route, navigation }) {


    const [foodWithQuantity,setFoodWithQuantity]=useState("")
    const handleSubmit = ()=>{

		console.log(VOLUME_ESTIMATION_SERVER)
        let body = new FormData();
        body.append("foodWithQuantity",foodWithQuantity)
        body.append("packagedFood",JSON.stringify({}))
  
        let header = { "Content-Type" : "multipart/form-data"};


        fetch(VOLUME_ESTIMATION_SERVER + "api3", { method:'POST', header : header, body : body})
        .then((res) => res.json())
        .then((res) => { 
          console.log("res2",res.foodCarbMap)
		  //   setScreen2(false)
        
          navigation.navigate("VolumeEstimation", {
            foodCarbMap: res.foodCarbMap,
        })

        } )
        .catch((err)=>{console.log("error",err)})

    }

	return (
		<>
			<ScrollView style={styles.root}>
				<Subheading style={styles.subheading}>Enter the food item with quantity seprated by commas</Subheading>
			
            	{/* <RadioButton.Group onValueChange={edit("type")} value={values["type"]}>
					<RadioButton.Item mode="android" label="Breakfast" value="breakfast" />
					<RadioButton.Item mode="android" label="Lunch" value="lunch" />
					<RadioButton.Item mode="android" label="Dinner" value="dinner" />
					<RadioButton.Item mode="android" label="Other" value="other" />
		    	</RadioButton.Group> */}

				<Text></Text>
				<Text></Text>


                <TextInput style ={{ height:90, flex:0.91,color:"",borderWidth:1,backgroundColor:"lightgrey"}}
                            onChangeText={setFoodWithQuantity}
                />
		
			
            	<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>
				<Text></Text>

             

            <Button mode="contained" onPress={handleSubmit}>Submit</Button>

			</ScrollView>
		</>
	);
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
        fontSize:20,
		fontWeight: "600",
        lineHeight:30
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
		flex: 1,
		height: 100,
		alignItems: "center",
		justifyContent: "center"
	},
	foodRight: {
		flex: 2
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
}