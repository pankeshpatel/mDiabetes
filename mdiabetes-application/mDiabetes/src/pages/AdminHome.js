import React from "react"
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator, DrawerItem } from "@react-navigation/drawer"
import PatientManagement from "./AdminHome/PatientManagement"
import { IconButton } from "react-native-paper"
import { useNavigation } from "@react-navigation/core"
import useAsyncStorage from "../hooks/useAsyncStorage"

const Drawer = createDrawerNavigator()

const AddPatientButton = ({ onPress }) => <IconButton icon="account-plus" onPress={onPress} />

const AdminDrawerContent = (props) => {

	const [_, setLocalUserType] = useAsyncStorage("localUserType")

	const navigation = useNavigation()

	const onLogout = () => {
		setLocalUserType("")
		navigation.navigate("AdminLogin")
	}

	return (
		<DrawerContentScrollView {...props}>
			<DrawerItemList {...props} />
			<DrawerItem
				icon={() => <IconButton icon="logout" />}
				label="Logout"
				onPress={onLogout}
			/>
		</DrawerContentScrollView>
	)
}

export default function AdminHome() {

	const navigation = useNavigation()

	const onAddPatient = () => {
		navigation.navigate("AddPatient")
	}

	return (
		<Drawer.Navigator
			initialRouteName="Patients"
			drawerContent={(props) => <AdminDrawerContent {...props} />}
		>
			<Drawer.Screen
				name="Patients"
				component={PatientManagement}
				options={{
					drawerIcon: () => <IconButton icon="account-multiple" />,
					headerRight: () => <AddPatientButton onPress={onAddPatient} />
				}}
			/>
		</Drawer.Navigator>
	)
}
