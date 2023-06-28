import React, { useState } from 'react'
import './app.css'
import { Route, Routes } from 'react-router-dom'
import WorldTourD3 from './landingPage/worldTour'
import Home from './home/home' 

export const MyContext = React.createContext('null');

function App() {

    const renderHTML = (
        <MyContext.Provider value='Default valuea'>
            <div className='col-md-12 vh-100'>
                <Routes>
                    <Route path='/' element={<WorldTourD3 />} /> 
                    <Route path='/Home/*' element={<Home />} /> 
                </Routes>
            </div>
        </MyContext.Provider>
    )

    return renderHTML
}

export default App;

