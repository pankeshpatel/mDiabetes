import React from "react"
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import App from './src/App';
import {name as appName} from './app.json';
import { colors } from "./src/styling/theme";

const WrappedApp = () => (
	<PaperProvider theme={{
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			background: colors.background,
			// text: colors.foreground,
			primary: colors.foreground
		},
	}}>
		<App />
	</PaperProvider>
)

AppRegistry.registerComponent(appName, () => WrappedApp);
