import { useState } from 'react'
import AppRouter from './router'
import NavBar from './navbar'
import SideBar from './sidebar'
import './app.css'

function App() {

    const [data, setData] = useState<any | null>(null)

    function getSelectedData(data: any){
        setData(data)
    }

    const renderHTML = (
        <div>
            <div className='col-md-2 d-inline-block align-top vh-100 sidebar-custom'>
                <NavBar/>
                <SideBar data={data}/>
            </div>
            <div className='col-md-10 d-inline-block vh-100'>
                <AppRouter onData={getSelectedData}/>
            </div>
        </div>
    );

    return renderHTML
}

export default App;
