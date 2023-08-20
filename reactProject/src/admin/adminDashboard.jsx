import MultipleCharts from "./multiplecharts"
import { useEffect, useState, createContext, useRef } from "react"
import { useNavigate , Link, useLocation } from 'react-router-dom'
import SoloPerDayChart from "./soloperdaychart"
import Notification from "./notifications"
import socket from "./socket"

export const data = createContext(null)

export default function AdminDashboard(){

    const navigate = useNavigate() 
    const socketDataRef = useRef(null)
    const [json, setJson] = useState(null)

    useEffect(()=>{
        const mySocket = socket(data =>  {
            setJson(data)
        })
        return () => {
            mySocket.disconnect()
        } 
    },[])

    const lineChart = (
        <data.Provider value={json}>
            <MultipleCharts />
        </data.Provider>
    )

    const solo = (
        <data.Provider value={json}>
            <SoloPerDayChart />
        </data.Provider>
    )

    const notif = (
        <data.Provider value={json}>
            <Notification />
        </data.Provider>
    )

    return (
        <div id="adminDashboard">
            {lineChart}
            <div id="soloContainer">
                {solo}
                {notif}
            </div>
        </div>
    )

}