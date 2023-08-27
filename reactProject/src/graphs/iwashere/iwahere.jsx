import { useEffect, useRef, createContext, useState, useContext } from 'react'
import * as d3 from 'd3'
import DownloadBars from '../../common/downloadbars'
import JumpLoading from '../../extra/jumploading'
import IwasHereTool from '../../tools/iwashere'
import PhilippinesMapApi from '../process/philippinesMapApi'
import './iwas.css'

export const tools = createContext() //heading to ../../tools/iwashere.jsx
export const Move = createContext() //heading to ../../common/downloadbars.jsx
export const table = createContext() //heading to ../../common/dashboard.jsx

/* 
    Docu: This component order in the sidebar menu can be change in the sidebar.jsx
    (parent component is home.jsx)
    This is done only with css and rerendering will cause it to reset default css
*/
export default function IwasHere(prop){
    
    const svgRef = useRef(null)
    const parentRef = useRef(null)
    const [render, setRender] = useState(false)
    const [getGeoData, setGeoData] = useState(null)
    const [height, setHeight] = useState(window.innerHeight)
    const [screenWidth, setWidth] = useState(window.innerWidth)
    const [moveIt, setMoveIt] = useState(0)
    let cls = null //for css colors

    useEffect(()=>{
        window.addEventListener('resize', handleResize)
        if(!getGeoData){
            fetchGeo()
        }
        else{
            renderMap(getGeoData)
        }
        // Clean up the event listener when the component is unmounted, do not remove
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    },[getGeoData, screenWidth, moveIt, height, render])

    useEffect(()=>{
        setRender(false)
    },[location.pathname])

    function handleResize(){
        if(window.innerWidth > 925){
            setWidth(window.innerWidth)
        }
        if(window.innerHeight > 700){
            setHeight(window.innerHeight)
        }
    }

    async function fetchGeo(){ //fetch data that renders Philippines map
        const response = await PhilippinesMapApi()
        setGeoData(response)
    }

    function renderMap(geoDatax){
        if(!parentRef.current) return 
        const width = parentRef.current.clientWidth
        const height = parentRef.current.clientHeight
        const arr = [
            {color:'red', intensity: 'Settled'}, 
            {color:'yellow', intensity: 'Visited'}, 
            {color:'blue', intensity: 'Explored'}
        ]
        const chart_dimensions = {
            width: width,
            height: height,
            margin: 50,
        }
        const svg = d3.select(svgRef.current)
            .attr('width', chart_dimensions.width)
            .attr('height', chart_dimensions.height)
        svg.selectAll('*').remove() //resets svg when rerendered
        const clippedWidth = chart_dimensions.width 
        const clippedHeight = chart_dimensions.height - chart_dimensions.margin 
        
        const geoMercator = d3
            .geoMercator()
            // the center uses longtitude and latitude
            // get Long/Lat data from google maps
            .center([128, 36])
            .fitSize([clippedWidth, clippedHeight], geoDatax)
        const pathGen = d3.geoPath(geoMercator)
        svg
            .selectAll('.geopath')
            .data(geoDatax.features)
            .enter()
            .append('path')
            .attr("transform", `translate(${moveIt},20)`)
            .attr('d', pathGen)
            .attr('stroke', 'black')
            .attr('fill', '#C4C1A4')
            .attr('class', 'hov')
            .on('click', handleClick)
        svg 
            .append('text')
            .attr("transform", `translate(${width * .03},50)`)
            .text('I was here!')
            .attr('font-family', 'sans-serif')
            .attr('font-size', '2rem')
            .attr('font-weight', 'bold')
        svg
            .selectAll('.label')
            .data(arr)
            .enter()
            .append('text')
            .attr('x', 100) 
            .attr("transform", "translate(-20,160)")
            .attr('y', function(d, i) {return (i * (width+height)*.02)})
            .text(function(d) {return d.intensity})
            .attr('font-size', (width+height)*.005)
            .attr("font-weight", "bold")
            .attr('font-size', '1rem')
            .attr('font-family', 'sans-serif')
        svg
            .selectAll('label-rect')
            .data(arr)
            .enter()
            .append('rect')
            .attr("transform", "translate(0,150)")
            .attr("y", function(d, i) {return i * (width+height)*.02 })
            .attr("x", 50)
            .style('fill', function(d) {return d.color})  
            .attr('height', (width+height)*.005)
            .attr('width', (width+height)*.005)
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
    }

    function handleClick(event) { //handles color changes when a province is clicked 
        if(cls == null) return
        if(cls == 'red'){
            d3.select(event.target).classed('yellow', false)
            d3.select(event.target).classed('blue', false)
        }
        else if(cls == 'yellow'){
            d3.select(event.target).classed('red', false)
            d3.select(event.target).classed('blue', false)
        }
        else if(cls == 'blue'){
            d3.select(event.target).classed('yellow', false)
            d3.select(event.target).classed('red', false)
        }
        d3.select(event.target).classed(cls, true)
    }

    function handleDataFromChild(params){
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
    function handleValue(params){
        cls = params.radio
    }

    const lowerBars = (
        <Move.Provider value={handleMoveIt}>
            <DownloadBars sendDataToParent={handleDataFromChild}/>
        </Move.Provider>
    )

    const chart = (
        <div id='screenShoot' className='portrait' ref={parentRef}>
            <svg ref={svgRef} />
        </div>
    )

    return (
        <div id='phchart'>
            <div>
                {(render)?pagination:(getGeoData)?chart:<JumpLoading />}
                {lowerBars}
            </div>
            {
                <tools.Provider value={handleValue}>
                    <IwasHereTool />
                </tools.Provider>
            }
        </div>
    )
}