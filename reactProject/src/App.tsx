import React, { useState } from 'react'
import NavBar from './navbar'
import SideBar from './sidebar'
import ApiData from './dashBoard'
import './app.css'
import { Route, Routes } from 'react-router-dom'
import WorldTourD3 from './worldTour'

export const MyContext = React.createContext('null');

function App() {

    const [data, setData] = useState<any | null>(null)

    function getSelectedData(data: any){
        setData(data)
    }

    const renderHTML = (
        <MyContext.Provider value='Default valuea'>
            <div>
                <div className='col-md-2 d-inline-block align-top vh-100 sidebar-custom'>
                    <NavBar/>
                    <SideBar data={data}/>
                </div>
                <div className='col-md-10 d-inline-block vh-100'>
                    <div className='position1 vh-100 d-flex align-items-start p-3 flex-column maindashboardContainer'>
                        <Routes>
                            <Route path='/worldTour' element={<WorldTourD3 />} /> 
                            <Route path='' element={<ApiData onData={getSelectedData}/>} /> 
                        </Routes>
                    </div>
                </div>
            </div>
        </MyContext.Provider>
    );

    return renderHTML
}

export default App;

