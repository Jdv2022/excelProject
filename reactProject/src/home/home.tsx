import SideBar from './sidebar'
import './sidebar.css'
import VerticalBarGraph from '../graphs/verticalbargraphj'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Home(){

    const [path, setPath] = useState('')
    const location = useLocation()

    useEffect(()=>{
        function reload(){
            const urls = ['/home/verticalbar/verticalbargraph']
            for(let i=0; i<urls.length; i++){
                if(urls[i] == location.pathname){
                    setPath(urls[i])
                    break
                }
            }
        }
        reload()
    },[location.pathname])

    return (

        <div className="vh-100 home w-100 bg-custom">
            <div className='col-md-1 d-inline-block bg-secondary vh-100 align-top'>
                <SideBar />
            </div>
            <div className="col-md-11 d-inline-block display-container vh-100 align-top">
                {location.pathname == path && <VerticalBarGraph />}
            </div>
        </div>

    )

}