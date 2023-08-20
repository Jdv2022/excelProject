import { useEffect, useRef, createContext, useState, useContext } from 'react'
import * as d3 from 'd3'
import '../graph.css'
import './iwashere.css'
import DownloadBars from '../../common/downloadbars'
import JumpLoading from '../../extra/jumploading'
import IwasHereTool from '../../tools/iwashere'
import PhilippinesMapApi from '../process/philippinesMapApi'

export const downloadBars = createContext()
export const tools = createContext()
export const Move = createContext()
export const table = createContext()

/* Parent home */
export default function IwasHere(prop){
    
    /* hooks */
    const svgRef = useRef(null)
    const [render, setRender] = useState(false)
    const [getGeoData, setGeoData] = useState(null)
    const [height, setHeight] = useState(window.innerHeight)
    const [width, setWidth] = useState(window.innerWidth)
    const [moveIt, setMoveIt] = useState(-(width * .28))
    let cls = null

    useEffect(()=>{
        window.addEventListener('resize', handleResize)
        if(!getGeoData){
            fetchGeo()
        }
        else{
            renderMap(getGeoData)
        }
        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    },[getGeoData, width, moveIt, height, render])

    useEffect(()=>{
        setRender(false)
    },[location.pathname])

    /* functions */
    function handleResize(){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    async function fetchGeo(){
        const response = await PhilippinesMapApi()
        setGeoData(response)
    }

    function renderMap(geoDatax){
        const arr = [
            {color:'red', intensity: 'Settled'}, 
            {color:'yellow', intensity: 'Visited'}, 
            {color:'blue', intensity: 'Explored'}
        ]
        const chart_dimensions = ({
            width: width * .9,
            height: height * .9,
            margin: 50,
        })
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

    function handleClick(event) {
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

    const lowerBars = (
        <Move.Provider value={handleMoveIt}>
            <DownloadBars sendDataToParent={handleDataFromChild}/>
        </Move.Provider>
    )

    const chart = (
        <div id='screenShoot' className='portrait paleblue'>
            <svg id='svg' ref={svgRef} />
        </div>
    )

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
                    <tools.Provider value={handleValue}>
                        <IwasHereTool />
                    </tools.Provider>
                }
            </div>
        </>
    )
}