import React from 'react';
// import { View, Image, Text, Pressable } from 'react-native';
import { Button, IconButton } from "react-native-paper"
import { SafeAreaView } from 'react-native-safe-area-context'
import BackgroundImg from "../assets/green-background.jpg"
import DayView from '../components/DayView';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {  ScrollView, StatusBar, Pressable, StyleSheet, Text, Image,  useColorScheme, View, Platform, Linking,TextInput} from 'react-native';

import { RadioButton } from 'react-native-paper';
import { Keyframe } from 'react-native-reanimated';







export default function VolumeEstimation({ route, navigation }) {
    console.log("routes",route.params.foodCarbMap)
    const [value, onChangeText] = React.useState('Useless Placeholder');

    let foodCarbMap = route.params.foodCarbMap;



    const handleSumbit = ()=>{

        console.log("submitted")

    }



	return (
		<SafeAreaView style={styles.root}>	
        	<View style={styles.header}>
                <Text style={{color:"#000",marginBottom:20,textAlign:"center",fontSize:20 ,marginTop:15,fontWeight:"600"}}>Carbohydrate estimation comparison</Text>




            <View>

                <Row style={{ height: 40 }}>
                    <Col><Text style ={styles.cell}></Text></Col>
                    <Col><Text style ={styles.cell}>App Estimate</Text></Col>
                    <Col><Text style ={styles.cell}>Your Estimate</Text></Col>
                    </Row>
                    {

                        Object.entries(foodCarbMap).map(([key, value])=>{

                            console.log("key",key,value)

                            return(
                                <Row style={{ height: 40 }}>
                                    <Col ><Text style ={styles.cell, {flex:1, flexWrap: 'wrap', borderColor:"#000000", borderWidth: 1}}>{key}</Text></Col>
                                    <Col><Text style ={styles.cell}>{value}</Text></Col>
                                    <TextInput style ={{ height:40, flex:0.99, color:"#000", borderWidth:1, textAlign:"center"}} keyboardType='numeric' onChangeText={text => onChangeText(text)} value={value}  />
                                </Row>
                            )

                        }) 

                    }
                <Row style={{ height: 40 }}>
                    <Col>
                        <Text style ={styles.cell}>Total</Text>
                    </Col>
                    <Col>
                        <Text style ={styles.cell}>{Object.values(foodCarbMap).reduce((partialSum, a) => partialSum + a, 0)}
                        </Text>
                    </Col>
                    <Col><Text style ={styles.cell}></Text></Col>
                </Row>
            </View>

            <View>


            <Text  style={{color:"#000",marginBottom:20,textAlign:"center",marginTop:52}}>Do you want to use app calculated estimation or your estimation?</Text>
            
            <View  style={{display:"flex" ,flexDirection:"row"}}>
                <RadioButton
                    value="first"
                    status={'unchecked'}
                    // onPress={() => setChecked('first')}
                />

                <Text style={{color:"#000",marginBottom:20,textAlign:"center",marginTop:12, marginLeft:10}}>App calculated estimation</Text> 
            </View>







            <View  style={{display:"flex" ,flexDirection:"row"}}>
                <RadioButton
                    value="first"
                    status={value === 'first' ? 'checked' : 'unchecked'}
                    // onPress={() => setChecked('first')}
                />

                <Text style={{color:"#000",marginBottom:20,textAlign:"center",marginTop:12, marginLeft:10}} >My own estimation</Text> 
            </View>


            </View>

                <Pressable style={{backgroundColor:"lightgrey",color:"white",width:100 ,height:30,marginLeft:220,marginTop:40,padding:1,borderWidth:1}}>
                    <Text style={{color:"black",marginLeft:25,marginTop:5}}>Submit</Text>
                </Pressable>

			</View>
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
    sectionDescription: {
        marginTop: 10,
        marginLeft:0,
        marginRight:20,
        fontSize: 24,
        fontWeight: '600',
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
	},
    container: {
        width: '100%',
        height: 300,
        padding: 16,
        paddingTop: 100,
        backgroundColor: '#fff',
      },
      cell: {
        borderWidth: 1,
        borderColor: '#000',
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        color:"#000",
        height:40,
        textAlign:"center",
        paddingTop:10
        
      },
      cell2: {
        borderWidth: 1,
        borderColor: '#000',
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        color:"#000",
        height:40,
        textAlign:"center",
        paddingTop:10
        
      }
}
