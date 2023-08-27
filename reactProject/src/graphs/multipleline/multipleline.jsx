import multipleline from "../../sampleData/multipleline"
import { useEffect, useRef, useContext, createContext, useState } from "react"
import DownloadBars from "../../common/downloadbars"
import DashBoard from "../../common/dashboard"
import MultipleLineTool from "../../tools/multipleline"
import segregateData, { allDates, max } from "./segregatedata"
import * as d3 from 'd3'

export const tools = createContext()
export const Move = createContext()
export const table = createContext()

const colors = ["red","green","blue","yellow","purple","orange","pink","cyan","magenta","lime","indigo","teal","violet","brown","gray","black","white"]

/* 
    Docu: This for ph region component 
    parent component -> home.jsx
    child component -> downloadbars.jsx
    child component -> dashboard.jsx
    child componnent -> multipleline.jsx
*/

export default function Multipleline(){

    /* COPY */
    const svgRef = useRef()
    const parentRef = useRef(null)
    const [data, setData] = useState(multipleline())
    const [render, setRender] = useState(false)
    const [tool, setTool] = useState(null)
    const [screenwidth, setWidth] = useState(window.innerWidth * .7)
    const [screenheight, setHeight] = useState(window.innerHeight * .77)
    const [moveIt, setMoveIt] = useState(100)
    const [display, setDisplay] = useState('none')
    const [dark, setDark] = useState(false)
    const [color, setColor] = useState('black')
    /* COPY */

    useEffect(()=>{
        window.addEventListener('resize', handleResize)

        if(!tool) return
        setDark(tool.mode)
        if(tool.mode){
            setColor('White')
        }
        else{
            setColor('black')
        }
        renderchart(data, tool)
        return () =>{
            window.removeEventListener('resize', handleResize)
        }
    },[data, screenwidth, screenheight, moveIt, tool, render, display, dark])
    
    function handleResize(){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    function renderchart(params, tool){
        if(!parentRef.current) return 
        const width = parentRef.current.clientWidth 
        const height = parentRef.current.clientHeight 
        const margin = 100
        const maximum = max(params)
        const dat = Object.keys(params[0])[1]
        const val = Object.keys(params[0])[2]
        const segData = segregateData(params)
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
        svg.selectAll('*').remove()
        const x = d3.scaleTime()
            .domain(d3.extent(segData[0], function (d) {return d3.timeParse('%Y-%m-%d')(d[dat])}))
            .range([0, width-100-margin])
        const y = d3.scaleLinear()
            .domain([0, maximum])
            .range([height - 100 - margin, 0])
        svg.append('g')
            .attr('transform', `translate(${moveIt}, ${height-margin})`)
            .call(d3.axisBottom(x).ticks(tool.ticksx))
        svg.append('g')
            .attr('transform', `translate(${moveIt}, 100)`)
            .call(d3.axisLeft(y).ticks(tool.ticksy))
        svg.selectAll('.tick line')
            .attr('stroke',color)
        for(let i=0; i<segData.length; i++){
            const line = svg.append('path').attr('transform', `translate(${moveIt}, 100)`)
            line
                .datum(segData[i])
                .attr('fill', 'none')
                .attr("stroke", colors[i])
                .attr("stroke-width", tool.lwidth)
                .attr("d", d3.line()
                    .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d[dat])) })
                    .y(function(d) { return y(parseInt(d[val])) })
                )
        }
        svg.selectAll('text')
            .attr('fill', color)
        svg.selectAll('.domain')
            .attr('stroke', color)
        svg.append('text')
            .attr('transform', `translate(${width * .5}, 50)`)
            .text(tool.titleT)
            .attr('font-size', '2rem')
            .attr('text-anchor', 'middle')
            .attr('fill', color)
        svg.append('text')
            .attr('transform', `translate(${width * .5}, ${height * .95})`)
            .text(tool.xlabel)
            .attr('font-size', '1.5rem')
            .attr('text-anchor', 'middle')
            .attr('fill', color)
        svg.append('text')
            .attr("transform", "translate(" + 50 + "," + height * .5 + ") " + "rotate(" + -90 + ")")
            .text(tool.ylabel)
            .attr('font-size', '1.5rem')
            .attr('text-anchor', 'middle')
            .attr('fill', color)
    }
    /* -----------------------copy---------------------- */
    const lowerBars = (
        <Move.Provider value={handleMoveIt}>
            <DownloadBars />
        </Move.Provider>
    )
    const pagination = (
        <table.Provider value={data}>
            <DashBoard sendDataToParent={handleDataFromChild}/>
        </table.Provider>
    )
    const chart = (
        <div id='screenShoot' ref={parentRef} className={(dark)?'landscape darkmode': 'landscape'}>
            <svg id='svgV' ref={svgRef}/>
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
        setData(params)
    }
    function handleValue(params){
        setTool(params)
    }
    return (
        <>
            <div id='landscapeContainer'>
                <div>
                    {(render)?pagination:chart}
                    {lowerBars}
                </div>
                {
                    <tools.Provider value={handleValue}>
                        <MultipleLineTool />
                    </tools.Provider>
                }
            </div>
        </>
    )
    /* -----------------------copy---------------------- */

}