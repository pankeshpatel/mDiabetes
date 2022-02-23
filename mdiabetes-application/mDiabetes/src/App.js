import React from 'react';
import { Text } from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './pages/AdminLogin';
import Intro from './pages/Intro';
import AdminHome from './pages/AdminHome';
import AddPatient from './pages/AdminHome/AddPatient';
import Welcome from './pages/Welcome';
import LogFood from './pages/LogFood';
import Nutrition from './pages/Nutrition';
import History from './pages/History';
import AdminLogin from './pages/AdminLogin';
import PatientLogin from './pages/PatientLogin';
import FoodCamera from './pages/FoodCamera';
import LogFoodIntro from './pages/LogFoodIntro';
import ColorMap from './pages/ColorMap';
import VolumeEstimation from './pages/VolumeEstimation';


const Stack = createNativeStackNavigator();

function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
				<Stack.Screen name="AdminLogin" component={AdminLogin} options={{ animation: "slide_from_right", headerShown: false  }} />
				<Stack.Screen name="PatientLogin" component={PatientLogin} options={{ animation: "slide_from_left", headerShown: false }} />
				<Stack.Screen name="AdminHome" component={AdminHome} options={{ animation: "fade", headerShown: false  }} />
				<Stack.Screen name="AddPatient" component={AddPatient} options={{ animation: "slide_from_right", headerTitle: "Add Patient" }} />
				<Stack.Screen name="Welcome" component={Welcome} options={{ animation: "fade", headerShown: false }} />
				<Stack.Screen name="LogFoodIntro" component={LogFoodIntro} options={{ animation: "fade", headerTitle: "Camera Selection" }} />
				<Stack.Screen name="LogFood" component={LogFood} options={{ animation: "fade", headerTitle: "Log Food" }} />
				<Stack.Screen name="FoodCamera" component={FoodCamera} options={{ animation: "fade", headerShown: false }} />
				<Stack.Screen name="Nutrition" component={Nutrition} options={{ animation: "slide_from_right", headerTitle: "Log Food" }} />
				<Stack.Screen name="History" component={History} options={{ animation: "slide_from_right", headerTitle: "History and Alarms" }} />
				<Stack.Screen name="ColorMap" component={ColorMap} options={{ animation: "slide_from_right", headerTitle: "Colour Map" }} />
				<Stack.Screen name="VolumeEstimation" component={VolumeEstimation} options={{ animation: "slide_from_right", headerTitle: "Volume Estimation" }} />



			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;