import React from 'react'
import './app.css'
import { Route, Routes } from 'react-router-dom'
import WorldTourD3 from './landingPage/worldTour'
import Home from './home/home' 
import Admin from './admin/admin'

export const MyContext = React.createContext('null');

function App() {
    const renderHTML = (
            <MyContext.Provider value='Default valuea'>
                <div>
                    <Routes>
                        <Route path='*' element={<WorldTourD3 />} /> 
                        <Route path='/Home/*' element={<Home />} /> 
                        <Route path='/admin/*' element={<Admin />} /> 
                    </Routes>
                </div>
            </MyContext.Provider>
        )
    return renderHTML
}

export default App;

