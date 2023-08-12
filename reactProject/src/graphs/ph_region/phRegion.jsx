import { useEffect, useRef, useContext, createContext, useState } from 'react'
import * as d3 from 'd3'
import '../graph.css'
import JumpLoading from '../../extra/jumploading'
import { userData } from '../../home/home'
import PhTool from '../../tools/phtool'
import DownloadBars from '../../common/downloadbars'
import DashBoard from '../../common/dashboard'
import PhilippinesMapApi from '../process/philippinesMapApi'
import PhRegionProcess from '../process/phregionprocess'
export const downloadBars = createContext()
export const toolsRegion = createContext()
export const Move = createContext()
export const table = createContext()

export default function PhRegion(prop){

    const svgRef = useRef(null)
    const userDatas = useContext(userData)
    const [render, setRender] = useState(false)
    const [tableData, setTableData] = useState(userDatas)
    const [toolData, setToolData] = useState(null)
    const [getGeoData, setGeoData] = useState(null)
    const [height, setHeight] = useState(window.innerHeight)
    const [width, setWidth] = useState(window.innerWidth)
    const [moveIt, setMoveIt] = useState(-(width * .28))
    
    useEffect(()=>{
        window.addEventListener('resize', handleResize)
        if(!getGeoData){
            fetchGeo()
        }
        else{
            const result = PhRegionProcess(getGeoData, toolData, tableData)
            renderMap(getGeoData, toolData, result)
        }
        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    },[toolData, getGeoData, width, moveIt, height, render])

    async function fetchGeo(){
        const response = await PhilippinesMapApi()
        setGeoData(response)
    }

    /* Renders the entire map */
    async function renderMap(geoDatax, params1, params2){
        const chart_dimensions = ({
            width: width * .9,
            height: height * .9,
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
        svg.selectAll('*').remove()
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
            .attr("transform", `translate(${moveIt},20)`)
            .attr('d', pathGen)
            .attr('stroke', bdC)
            .attr('fill', color)
        svg
            .selectAll('.geopath')
            .data(newArrMax)
            .enter()
            .append('path')
            .attr("transform", `translate(${moveIt},20)`)
            .attr('d', pathGen)
            .attr('stroke', bdC)
            .attr('fill', maxC)
        svg
            .selectAll('.geopath')
            .data(newArrMid)
            .enter()
            .append('path')
            .attr("transform", `translate(${moveIt},20)`)
            .attr('d', pathGen)
            .attr('stroke', bdC)
            .attr('fill', midC)
        svg
            .selectAll('.geopath')
            .data(newArrMin)
            .enter()
            .append('path')
            .attr("transform", `translate(${moveIt},20)`)
            .attr('d', pathGen)
            .attr('stroke', bdC)
            .attr('fill', minC)
        svg 
            .selectAll('text')
            .attr('font-family', 'sans-serif')
    }
    //from child philipiinestool
    function handleValue(params){
        setToolData(params)
    }
    function handleDataFromChild(params){
        setTableData(params)
        sendDataToParent(params)
    }
    function sendDataToParent(params){
        prop.sendDataToParent(params)
    }
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
    const lowerBars = (
        <Move.Provider value={handleMoveIt}>
            <DownloadBars />
        </Move.Provider>
    )
    const pagination = (
        <table.Provider value={tableData}>
            <DashBoard sendDataToParent={handleDataFromChild}/>
        </table.Provider>
    )
    const chart = (
        <div className='portrait'>
            <svg id='svg' ref={svgRef}></svg>
        </div>
    )
    /* functions */
    function handleResize(){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }
    return (
        <>
            <div id='chartContainer' className='inlineBlock vat'>
                <div id='content' className='inlineBlock vat'>
                    {(render)?pagination:(getGeoData)?chart:<JumpLoading />}
                    <div id='options'>
                        {lowerBars}
                    </div>
                </div>
                {
                    <toolsRegion.Provider value={handleValue}>
                        <PhTool />
                    </toolsRegion.Provider>
                }
            </div>
        </>
    )
    
}