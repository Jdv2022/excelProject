import MultipleCharts from "./multiplecharts"
import { useEffect, useState, createContext } from "react"
import SoloPerDayChart from "./soloperdaychart"
import Adminpie from "./adminpie"
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/get/logtraffic`

export const data = createContext(null)

export default function AdminDashboard(){

    const [json, setJson] = useState(null)

    useEffect(()=>{
        async function getlogs(){
            try{
                const response = await fetch(endpointUrl, {
                    method : 'GET'
                })
                if(response.ok){
                    const apiData = await response.text()
                    const jsonData = apiData ? await JSON.parse(apiData) : {}
                    setJson(jsonData.response)
                }
                else {
                    throw new Error('Request failed')
                }
            }
            catch(err){
                console.error(err)
            }
        }   
        if(json) return
        getlogs()
    },[json])

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

    return (
        <div id="adminDashboard">
            <div id="section-1">
                {lineChart}
                {solo}
                <Adminpie />
            </div>
        </div>
    )

}