import React, { useEffect, useState } from "react"

export default function Remount({ children, value }) {

	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(false)
		setTimeout(() => {
			setMounted(true)
		}, 100)
	}, [value])

	if(mounted) {
		return <>{children}</>
	}

	return <></>
}