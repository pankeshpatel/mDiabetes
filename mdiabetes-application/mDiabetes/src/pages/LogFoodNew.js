import React from 'react'
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput,Button, Text,RadioButton, Title, Subheading, IconButton } from "react-native-paper"
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';
import {  Image} from 'react-native';



import { View,  ScrollView } from "react-native"

export default function LogFoodNew({ route, navigation }) {

    const [foodEntry,SetFoodEntry] = useState([]);

 
 
    const handleAdd = ()=>{

       
        if(foodEntry.length>6){
            return
        }
        
        let a = {name:"",quantity:"",units:""}
        SetFoodEntry([...foodEntry,a])

    }
    
    const quantity = ["cup","slice","count","oz"]


    const handleUpdate = (type,editvalue,i)=>{
        
        // console.log("ty",type,value,i)
        if(type=="name"){
            SetFoodEntry(foodEntry.map((value,index)=>{
                if(index==i){
                    value.name = editvalue
                    return value
                }
                else{
                    return value
                }   
            }))
        }

        if(type=="quantity"){
            SetFoodEntry(foodEntry.map((value,index)=>{
                if(index==i){
                    value.quantity = editvalue
                    return value
                }
                else{
                    return value
                }   
            }))
        }

        if(type=="units"){
            SetFoodEntry(foodEntry.map((value,index)=>{
                if(index==i){
                    value.units = editvalue
                    return value
                }
                else{
                    return value
                }   
            }))
        }

    }

    const handleSumbit =()=>{

        navigation.navigate("UserCarbEstimate", {
            foodLog: foodEntry,
        })

    }


  return (
		<SafeAreaView style={styles.root}>
		
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{flexGrow: 1}}>
        <Text style={styles.heading}>Enter the food items name, quantity with units</Text>
        <Text></Text>

        {
             Object.entries(foodEntry).map(([key, value],index)=>{
                return(
                
            <View style={styles.flexDisplay}>

                <View key = {index} style={{backgroundColor:"lightgrey",color:"black"}}>
                    <TextInput style={{borderWidth:1,height:40 ,flex:0.91,width:130}} onChangeText={(value)=>{handleUpdate("name",value,index)}} ></TextInput>
                </View>
                <View style={{backgroundColor:"lightgrey",color:"black"}}> 
                    <TextInput style={{borderWidth:1,height:40 ,flex:0.91,width:60}} onChangeText={(value)=>{handleUpdate("quantity",value,index)}}></TextInput>
                </View>
                <View> 
                    <SelectDropdown  
                        data={quantity} 
                        defaultButtonText="quantity"
                        buttonStyle={{width:30,borderWidth:1,height:40,width:120,marginTop:5}}  
                        onSelect={(selectedItem, i) => { handleUpdate("units",selectedItem,index)  } }  
                        renderDropdownIcon={(isOpened) => {
                    return (
                    <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/0/159.png" }} style={{width:20,height:20 }}  />
                    );
                }}
                dropdownIconPosition={"right"}
              />
                </View>
        
             </View>

                
                )
            
        
        }) 
             }

             <Text></Text>

             <Button onPress={handleAdd} mode="contained" style={{width:150,marginLeft:180}} > Add new </Button>
             <Text></Text>
             <Text></Text>

             <Button onPress={handleSumbit} mode="contained" > SUBMIT </Button>

        
         

        </ScrollView>
             
		</SafeAreaView>
        
  
  )
}

const styles = {
	root: {
		padding: 20,
		width: "100%",
		height: "100%",
	},
    heading:{
        textAlign:"center",
        fontSize:18
    },
    flexDisplay:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around",
        marginTop:10
        
 
    }

}