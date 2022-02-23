import { useState, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function useAsyncStorage(key) {
	
	const [value, setValue] = useState(null)

	const saveValue = async (newValue) => {
		setValue(newValue)
		return AsyncStorage.setItem(key, newValue)
	}

	useEffect(() => {
		const interval = setInterval(() => {
			const getData = async () => {
				try {
					const loadedValue = await AsyncStorage.getItem(key)
					setValue(loadedValue)
				} catch(e) {
					console.log(e)
				}
			}
			getData()
		}, 500)
		return () => clearInterval(interval)
	}, [])

	return [value, saveValue]
}