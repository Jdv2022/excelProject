import React from 'react'
import { BrowserRouter as Router, Route, Routes, useRoutes } from 'react-router-dom'
import Admin from './admin/admin'
import ContactMe from './contact/contactme'
import './app.css'

const App = () => {

	let routes = useRoutes([
	  	{ path: "/*", element: <Admin /> },
		{ path: "/admin/login", element: <ContactMe /> },
		{ path: "/admin/dashboard", element: <Admin /> },
	])

	return routes
}

function AppWrapper () {
    return (
		<Router>
		  	<App />
		</Router>
	)
}

export default AppWrapper 