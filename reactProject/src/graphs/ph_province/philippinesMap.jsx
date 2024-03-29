import { useEffect, useRef, createContext, useState, useContext } from 'react'
import * as d3 from 'd3'
import PhTool from '../../tools/phtool'
import { userData } from '../../home/home'
import DownloadBars from '../../common/downloadbars'
import JumpLoading from '../../extra/jumploading'
import DashBoard from '../../common/dashboard'
import Process from '../process/phprocess'
import PhilippinesMapApi from '../process/philippinesMapApi'
/* The styling of this component is similar to iwashere.jsx */
//import '../iwashere/iwas.css' 

export const tools = createContext()
export const Move = createContext()
export const table = createContext()

/* 
    Docu: This is use to render ph provinces
    parent component -> home.jsx
    child component -> common/dashboard.jsx -> that uploads/downloads csv/xlsx file from user to render a chart
    child component -> common/downloadbars.jsx -> download img move chart (left and right) 
*/

export default function Philippines(prop){

    const parentRef = useRef(null)
    const svgRef = useRef(null)
    const fromHome = useContext(userData)
    const [home, setHome] = useState(fromHome)
    const [tableData, setTableData] = useState(null)
    const [render, setRender] = useState(false)
    const [getGeoData, setGeoData] = useState(null)
    const [height, setHeight] = useState(window.innerHeight)
    const [width, setWidth] = useState(window.innerWidth)
    const [moveIt, setMoveIt] = useState(0)

    useEffect(()=>{
        window.addEventListener('resize', handleResize)
        if(!getGeoData){
            fetchGeo()
        }
        else{
            const result = Process(getGeoData, tableData, home)
            renderMap(getGeoData, tableData, result)
        }
        // Clean up the event listener when the component is unmounted, do not remove
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    },[tableData, getGeoData, width, moveIt, height, render])

    useEffect(()=>{
        setRender(false)
    },[location.pathname])

    /* functions */
    function handleResize(){
        if(window.innerWidth > 925){
            setWidth(window.innerWidth)
        }
        if(window.innerHeight > 700){
            setHeight(window.innerHeight)
        }
    }
    //from child philipiinestool
    function handleValue(params){
        setTableData(params)
    }

    async function fetchGeo(){
        const response = await PhilippinesMapApi()
        setGeoData(response)
    }

    async function renderMap(geoDatax, params1, params2){
        if(!parentRef.current) return 
        const chart_dimensions = ({
            width: parentRef.current.clientWidth,
            height: parentRef.current.clientHeight,
            margin: 50,
        })
        const bdC = params1.borderC
        const color = params1.bg
        const maxC = params1.maxColor
        const midC = params1.midColor
        const minC = params1.minColor
        const title = params1.titleD
        const read = params2
        const newArrMax = read.newArrMax
        const newArrMid = read.newArrMid
        const newArrMin = read.newArrMin
        const noDataArray = read.noDataArray
        const svg = d3.select(svgRef.current)
            .attr('width', chart_dimensions.width)
            .attr('height', chart_dimensions.height)
        svg.selectAll('*').remove() //reset chart when rerendering, do not remove
        const clippedWidth = chart_dimensions.width 
        const clippedHeight = chart_dimensions.height - chart_dimensions.margin 
        const geoMercator = d3
            .geoMercator()
            // the center uses longtitude and latitude
            // get Long/Lat data from google maps
            .center([128, 36])
            .fitSize([clippedWidth, clippedHeight], geoDatax)
        const pathGen = d3.geoPath(geoMercator)
        const arr = [
            {color:maxC, intensity: 'High'}, 
            {color:midC, intensity: 'Moderate'}, 
            {color:minC, intensity: 'Low'},
            {color:color, intensity: 'No Data'}
        ]
        svg
            .selectAll('rect')
            .data(arr)
            .enter()
            .append('rect')
            .attr("transform", "translate(0,150)")
            .attr("y", function(d, i) {return i * (width+height)*.01 })
            .attr("x", 50)
            .style('fill', function(d) {return d.color})  
            .attr('height', (width+height)*.005)
            .attr('width', (width+height)*.005)
            .attr('stroke', bdC)
            .attr('stroke-width', 2)
        svg
            .selectAll('text')
            .data(arr)
            .enter()
            .append('text')
            .attr('x', 100) 
            .attr("transform", "translate(-20,160)")
            .attr('y', function(d, i) {return (i * (width+height)*.01)})
            .text(function(d) {return d.intensity})
            .attr('font-size', (width+height)*.005)
            .attr("font-weight", "bold")
        svg
            .append("text")
            .attr("text-anchor", "start")
            .attr("x", 50)
            .attr("y", 50)
            .attr("font-size", (width+height)*.01)
            .attr("font-weight", "bold")
            .text(title) 
        svg
            .append('text')
            .attr('x', 50) 
            .attr("y", 110)
            .text('Legend:')
            .attr('font-size', (width+height)*.006)
            .attr("font-weight", "bold")  
        svg
            .selectAll('.geopath')
            .data(noDataArray)
            .enter()
            .append('path')
            .attr("transform", `translate(${moveIt},0)`)
            .attr('d', pathGen)
            .attr('stroke', bdC)
            .attr('fill', color)
        svg
            .selectAll('.geopath')
            .data(newArrMax)
            .enter()
            .append('path')
            .attr("transform", `translate(${moveIt},0)`)
            .attr('d', pathGen)
            .attr('stroke', bdC)
            .attr('fill', maxC)
        svg
            .selectAll('.geopath')
            .data(newArrMid)
            .enter()
            .append('path')
            .attr("transform", `translate(${moveIt},0)`)
            .attr('d', pathGen)
            .attr('stroke', bdC)
            .attr('fill', midC)
        svg
            .selectAll('.geopath')
            .data(newArrMin)
            .enter()
            .append('path')
            .attr("transform", `translate(${moveIt},0)`)
            .attr('d', pathGen)
            .attr('stroke', bdC)
            .attr('fill', minC)
        svg 
            .selectAll('text')
            .attr('font-family', 'sans-serif');
    }
    const lowerBars = (
        <Move.Provider value={handleMoveIt}>
            <DownloadBars />
        </Move.Provider>
    )
    const pagination = (
        <table.Provider value={fromHome}>
            <DashBoard sendDataToParent={handleDataFromChild}/>
        </table.Provider>
    )
    const chart = (
        <div id='screenShoot' className='portrait' ref={parentRef}>
            <svg ref={svgRef} />
        </div>
    )
    function handleMoveIt(params){
        if(Number.isInteger(params)){
            const value = moveIt + params
            setMoveIt(value)
        }
        else if(params == 'pagination'){
            setRender(true)
        }
        else if(params == 'chart'){
            setRender(false)
        }
    }
    function handleDataFromChild(params){
        setHome(params)
        sendDataToParent(params)
    }
    function sendDataToParent(params){
        prop.sendDataToParent(params)
    }
    return (
        <>
            <div id='phchart'>
                <div>
                    {(render)?pagination:(getGeoData)?chart:<JumpLoading />}
                    {lowerBars}
                </div>
                {
                    <tools.Provider value={handleValue}>
                        <PhTool />
                    </tools.Provider>
                }
            </div>
        </>
    )
}