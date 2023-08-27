import * as d3 from 'd3'
import horizontal from '../../sampleData/horizontal'
import DownloadBars from "../../common/downloadbars"
import DashBoard from "../../common/dashboard"
import HorizontalBarTool from '../../tools/horizontalbartool'
import { useState, useRef, createContext, useEffect } from 'react'

export const Move = createContext()
export const table = createContext()
export const tools = createContext()  

/* 
    Docu: This for ph region component 
    parent component -> home.jsx
    child component -> downloadbars.jsx
    child component -> dashboard.jsx
    child componnent -> horizontalbar.jsx
*/

export default function HorizontalBar(){
    /* COPY */
    const svgRef = useRef()
    const parentRef = useRef(null)
    const [data, setData] = useState(horizontal())
    const [subData, setSubData] = useState(horizontal())
    const [render, setRender] = useState(false)
    const [tool, setTool] = useState(null)
    const [screenwidth, setWidth] = useState(window.innerWidth * .7)
    const [screenheight, setHeight] = useState(window.innerHeight * .77)
    const [dark, setDark] = useState(false)
    const [color, setColor] = useState('black')
    const [moveIt, setMoveIt] = useState(150)
    /* COPY */
    useEffect(()=>{
        window.addEventListener('resize', handleResize)
        renderChart(data, tool)
        return () =>{
            window.removeEventListener('resize', handleResize)
        }
    },[data, render, tool, screenwidth, screenheight, dark, moveIt])

    function handleResize(){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    function renderChart(main, tool){
        if(!parentRef.current) return 
        const width = parentRef.current.clientWidth 
        const height = parentRef.current.clientHeight 
        const margin = 100
        if(!tool)return
        let data
        if(tool.asc == 'nrm'){
            data = subData
        }
        else if(tool.asc == 'dsc'){
            data = dscOrder(main)
        }
        else{
            data = ascOrder(main)
        }
        console.log(tool)
        if(tool.mode){
            setDark(true)
            setColor('white')
        }
        else{
            setDark(false)
            setColor('black')
        }
        const x_key = Object.keys(data[0])[0]
        const val = Object.keys(data[0])[1]
        const max = getmax(data, val)
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
        //const bar = svg.append('rect')
        svg.selectAll('*').remove()
        const x = d3.scaleLinear()
            .domain([0, max + max*.09])
            .range([0, width - 200])
        const y = d3.scaleBand()
            .domain(data.map(function(d) { return d[x_key] } ))
            .range([0, height-200])
            .padding(0.2)
        svg.append('g')
            .attr("transform", "translate(" + moveIt + "," + (height-margin) + ")")
            .call(d3.axisBottom(x))
        svg.append('g')
            .attr("transform", "translate(" + moveIt + "," + 100 + ")")
            .call(d3.axisLeft(y))
        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", moveIt) 
            .attr("y", function(d) { return 100 + y(d[x_key])}) 
            .attr("width", function(d) { return x(parseInt(d[val]))})
            .attr("height", y.bandwidth())
            .attr("fill", function(d) {return d.color})
            .attr('opacity', .9)
        const title = svg.append('text')
            .attr("transform", "translate(" + width * 0.5 + "," + (height * 0.1 + 20) + ")")
            .text(tool.titleT)
            .attr('text-anchor', 'middle')
            .attr('font-size', '1.5rem')
            .attr('fill', color)
        const xlabel = svg.append('text')
            .attr("transform", "translate(" + width * 0.5 + "," + height * 1.1 + ")")
            .text(tool.xlabel)
            .attr('text-anchor', 'middle')
            .attr('font-size', '1.3rem')
            .attr('fill', color)
        svg.selectAll('.tick line')
            .attr('stroke', color)
        svg.selectAll('path')
            .attr('stroke', color)
        svg.selectAll('text')
            .attr('color', color)
    }
    //max value
    function getmax(params, key){
        let temp = 0
        for(let i = 0; i<params.length; i++){
            const num = parseInt(params[i][key])
            if(temp < num){
                temp = num
            }
        }
        return temp
    }
    //order by decending
    function dscOrder(params){
        let end = 0
        let key = Object.keys(params[0])[1]
        for(let i=0; i<params.length; i++){
            let val = parseInt(params[i][key])
            if(end <= val){
                end = val
                if(params[i+1] == undefined){
                    return params
                }
            }
            else{
                const temp = params[i]
                params[i] = params[i-1]
                params[i-1] = temp
                break
            }
        }
        return dscOrder(params)
    }
    //orderby ascending
    function ascOrder(params){
        let key = Object.keys(params[0])[1]
        let end = 0
        for(let i=0; i<params.length; i++){
            let val = parseInt(params[i][key])
            if(i == 0 && end <= val){
                end = val
            }
            else if(end <= val){
                const temp = params[i]
                params[i] = params[i-1]
                params[i-1] = temp
                break
            }
            else{
                end = val
                if(params[i+1] == undefined){
                    return params
                }
            }
        }
        return ascOrder(params)
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
    return (
        <>
            <div id='landscapeContainer'>
                <div>
                    {(render)?pagination:chart}
                    {lowerBars}
                </div>
                {
                    <tools.Provider value={handleValue}>
                        <HorizontalBarTool />
                    </tools.Provider>
                }
            </div>
        </>
    )
    /* -----------------------copy---------------------- */

}