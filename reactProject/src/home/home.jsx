import { useState, createContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SideBar from '../sidebar/sidebar'
import Philippines from '../graphs/ph_province/philippinesMap'
import provincePh from '../sampleData/provincesPh'
import PhRegion from '../graphs/ph_region/phRegion'
import regionPh from '../sampleData/regionPh'
import VerticalBarGraphSampleData from '../sampleData/verticalGraph'
import RenderVerticalBarGraph from '../graphs/bargraph_vertical/renderverticalBarGraph'
import PieChart from '../graphs/piechart/piechart'
import LineChart from '../graphs/linechart/linechart'
import HorizontalBar from '../graphs/horizontalbar/horizontalbar'
import DonutPie from '../graphs/piechart/donut'
import Multipleline from '../graphs/multipleline/multipleline'
import ImpHorizontalBar from '../graphs/horizontalbar/improvedhorizontal'
import IwasHere from '../graphs/iwashere/iwahere'
import Instruction from '../graphs/instruction/instruction'
import Welcome from '../graphs/introduction/welcome'
import ContactMe from '../contact/contactme'
import './home.css'

export const userData = createContext()

export default function Home(){

    /* hooks */
    const [data, setData] = useState(null)
    const [urlname, setUrlname] = useState('')
    const location = useLocation()

    useEffect(()=>{
        setUrlname(location.pathname)
        setData(urlsData[location.pathname])
    },[urlname, location.pathname])

    function handleDataFromChild(params){
        setData(params)
    }
    /* constants */
    const sidebar = (
        <SideBar />
    )
    const renderPhilippines = (
        <userData.Provider value={data}>
            <Philippines sendDataToParent={handleDataFromChild}/>
        </userData.Provider>
    )
    const renderPhRegion = (
        <userData.Provider value={data}>
            <PhRegion sendDataToParent={handleDataFromChild}/>
        </userData.Provider>
    )
    const verticalBarGraph = (
        <userData.Provider value={data}>
            <RenderVerticalBarGraph sendDataToParent={handleDataFromChild}/>
        </userData.Provider>
    )
    // for loading specific pages 
    const urls = {
        '/home/choroplethmap(ph-provinces)': renderPhilippines,
        '/home/choroplethmap(ph-region)': renderPhRegion,
        '/home/verticalbargraph': verticalBarGraph,
        '/home/linechart': <LineChart />,
        '/home/horizontalbarchart': <HorizontalBar />,
        '/home/piechart': <PieChart />,
        '/home/donutchart': <DonutPie />,
        '/home/multiplelinechart': <Multipleline />,
        '/home/improvedhorizontalbarchart': <ImpHorizontalBar />,
        '/home/iwashere!': <IwasHere />,
        '/home/instructions': <Instruction />,
        '/home/welcome': <Welcome />,
        '/home/contactme': <ContactMe />
    }
    // for loading specific datas 
    const urlsData = {
        '/home/choroplethmap(ph-provinces)': provincePh(),
        '/home/choroplethmap(ph-region)': regionPh(),
        '/home/verticalbargraph': VerticalBarGraphSampleData(),
    }
    return (
        <>
            <div id='temp'>
                {sidebar}
                {urls[urlname]}
            </div>
        </>
    )

}