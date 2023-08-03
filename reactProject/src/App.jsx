import React from 'react'
import './app.css'
import { Route, Routes } from 'react-router-dom'
import WorldTourD3 from './landingPage/worldTour'
import Home from './home/home' 
import Admin from './admin/admin'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import NotYet from './notYetAvailable'

export const MyContext = React.createContext('null');

function App() {
    const location = useLocation()  
    const [screenWidth, setScreenWidth] = useState(null)  
    useEffect(()=>{
        //This will set the temporary data to the corresponding url
        function logScreenSize() {
            const screenWidth = window.innerWidth;
            setScreenWidth(screenWidth)
        }
        window.addEventListener("resize", logScreenSize);
    },[screenWidth])

    if(screenWidth && screenWidth < 972){
        <div><NotYet/></div>
    } 
    const renderHTML = (
        <MyContext.Provider value='Default valuea'>
            <div className='col-md-12 vh-100'>
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

