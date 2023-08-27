import { useEffect, useRef, useContext, createContext, useState } from "react"
import * as d3 from 'd3'
import linechart from "../../sampleData/linechart"
import DownloadBars from "../../common/downloadbars"
import DashBoard from "../../common/dashboard"
import LineTool from "../../tools/linecharttool"
import segregateData from "./segregatedata"

export const tools = createContext()
export const Move = createContext()
export const table = createContext()

/* 
    Docu: This for ph region component 
    parent component -> home.jsx
    child component -> downloadbars.jsx
    child component -> dashboard.jsx
    child componnent -> linecharttool.jsx
*/

export default function LineChart(){

    const svgRef = useRef(null)
    const parentRef = useRef(null)
    const [data, setData] = useState(null)
    const [tempData, setTempData] = useState(null)
    const [screenwidth, setWidth] = useState(window.innerWidth * .7)
    const [screenheight, setHeight] = useState(window.innerHeight * .77)
    const [render, setRender] = useState(false)
    const [moveIt, setMoveIt] = useState(100)
    const [tool, setTool] = useState(null)
    const [dark, setDark] = useState(false)
    const [color, setColor] = useState(null)
    const [title, setTiltle] = useState(null)
    const [xl, setXl] = useState(null)
    const [yl, setYl] = useState(null)

    useEffect(()=>{
        window.addEventListener('resize', handleResize)
        if(!data){
            setData(linechart())
            setTempData(linechart())
        }
        else{
            renderChart(data, tool)
            setTiltle(tool.titleT)
            setXl(tool.xlabel)
            setYl(tool.ylabel)
        }
        return () =>{
            window.removeEventListener('resize', handleResize)
        }
    },[data, screenheight, screenwidth, moveIt, render, tool, color, yl, xl, title])

    function handleResize(){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    function getMax(params){
        let temp = 0 
        for(const i in params){
            if(temp < params[i].value){
                temp = params[i].value
            }
        }
        return temp
    }

    function renderChart(params1, toolset){  
        if(!parentRef.current) return 
        const width = parentRef.current.clientWidth 
        const height = parentRef.current.clientHeight 
        const margin = 200
        let data
        let fill
        const segData = segregateData(params1)
        const val1 = segData[0].value
        const val2 = segData[segData.length - 1].value
        if(toolset.mode){
            setDark(true)
            setColor('white')
        }
        else{
            setDark(false)
            setColor('black')
        }
        if(toolset.fill && (val1 != 0 || val2 != 0)){
            fill = toolset.lcolor
            const date = segData[0].date
            tempData.unshift({date: date, value: 0})
            const last_date = segData[segData.length - 1].date
            tempData.push({date: last_date, value: 0})
            data = tempData
        }
        else{
            fill = 'none'
            data = segData
        }
        const maxHeight = getMax(data)
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
        svg
            .selectAll('*').remove()
        const x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d3.timeParse("%Y-%m-%d")(d.date) }))
            .range([ 0, width - margin ])
        svg
            .append('g')
            .attr("transform", "translate(" + moveIt + "," + (height - 100) + ")")
            .call(d3.axisBottom(x).ticks(toolset.ticksx))
        const y = d3.scaleLinear()
            .domain([ maxHeight, 0 ])
            .range([ 0 , height - margin ])
        svg
            .append('g')
            .attr("transform", "translate(" + moveIt + "," + 100 + ")")
            .call(d3.axisLeft(y).ticks(toolset.ticksy))
        const line = svg.append('path')
        line
            .attr("transform", "translate(" + moveIt + "," + 100 + ")")
            .datum(data)
            .attr("fill", fill)
            .attr('opacity', .5)
            .attr("stroke", fill)
            .attr("stroke-width", toolset.lwidth)
            .attr("d", d3.line()
                .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d.date)) })
                .y(function(d) { return y(d.value) })
            )
        svg.selectAll('.tick line')
            .attr('stroke', color)
        svg.selectAll('path')
            .attr('stroke', color)
        svg.selectAll('text')
            .attr('color', color)
        svg.append('text')
            .attr('font-size', '2rem')
            .attr("transform", "translate(" + width * .5 + "," + 100 + ")")
            .attr('text-anchor', 'middle')
            .attr('fill', color)
            .text(title)
        svg.append('text')
            .attr('font-size', '1.5rem')
            .attr("transform", "translate(" + width * .5 + "," + height * .95 + ")")
            .attr('text-anchor', 'middle')
            .attr('fill', color)
            .text(xl)
        svg.append('text')
            .attr('font-size', '1.5rem')
            .attr("transform", "translate(" + 50 + "," + height * .5 + ") " + "rotate(" + -90 + ")")
            .attr('text-anchor', 'middle')
            .attr('fill', color)
            .text(yl)
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
            <svg id='svg' ref={svgRef}/>
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
        setTempData(params)
    }
    function handleValue(params){
        setTool(params)
    }
    /* -----------------------copy---------------------- */
    return (
        <>
            <div id='landscapeContainer'>
                <div>
                    {(render)?pagination:chart}
                    {lowerBars}
                </div>
                {
                    <tools.Provider value={handleValue}>
                        <LineTool />
                    </tools.Provider>
                }
            </div>
        </>
    )

}