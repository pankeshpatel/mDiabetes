//export const SERVER_LOCATION = "http://ec2-54-89-144-199.compute-1.amazonaws.com:8008/"


import { BASE_SERVER_LOCATION } from "@env"

export const SERVER_LOCATION=`${BASE_SERVER_LOCATION}`



export function getData(path, authData) {
	const authText = authData 
		? ((path.includes("?") ? "&" : "?") + "authToken=" + authData.authToken + "&username=" + authData.username)
		: ""
	console.log("GET DATA:   ", SERVER_LOCATION + path + authText)
	return fetch(SERVER_LOCATION + path + authText)
}

export function postData(path, authToken, body) {
	const authText = authToken 
		? ((path.includes("?") ? "&" : "?") + "authToken=" + authToken)
		: ""
	console.log(SERVER_LOCATION + path + authText, body)
	return fetch({
		url: SERVER_LOCATION + path + authText
	}, {
		method: "POST",
		// mode: "cors",
		// cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		// credentials: "same-origin", // include, *same-origin, omit
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		// redirect: "follow", // manual, *follow, error
		// referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(body)
	})

}