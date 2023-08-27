import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './home/home' 
import './app.css'
import './tool.css'
import './landscapechart.css'

export const MyContext = React.createContext('null');

function App() {
    const renderHTML = (
            <MyContext.Provider value='Default valuea'>
                <div>
                    <Routes>
                        <Route path='/*' element={<Home />} /> 
                    </Routes>
                </div>
            </MyContext.Provider>
        )
    return renderHTML
}

export default App;

