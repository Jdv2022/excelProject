import MultipleCharts from "./multiplecharts"
import { useEffect, useState, createContext, useContext } from "react"
import SoloPerDayChart from "./soloperdaychart"
import Notification from "./notifications"
import { socketData } from "./admin"

export const data = createContext(null)

export default function AdminDashboard(){
    
    const contextData = useContext(socketData)
    const [json, setJson] = useState(null)
    
    useEffect(()=>{
        setJson(contextData)
    },[contextData])

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
            <div>
                {solo}
                {notif}
            </div>
        </div>
    )

}