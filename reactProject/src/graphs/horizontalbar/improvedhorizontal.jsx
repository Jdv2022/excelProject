import * as d3 from 'd3'
import horizontal from '../../sampleData/horizontal'
import DownloadBars from "../../common/downloadbars"
import DashBoard from "../../common/dashboard"
import ImpHorizontalBarTool from '../../tools/improvedhorizontal'
import { useState, useRef, createContext, useEffect } from 'react'

export const Move = createContext()
export const table = createContext()
export const tools = createContext()   

export default function ImpHorizontalBar(){
    /* COPY */
    const svgRef = useRef()
    const [data, setData] = useState(horizontal())
    const [subData, setSubData] = useState(horizontal())
    const [render, setRender] = useState(false)
    const [tool, setTool] = useState(null)
    const [width, setWidth] = useState(window.innerWidth * .7)
    const [height, setHeight] = useState(window.innerHeight * .77)
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
    },[data, render, tool, width, height, dark, moveIt])

    function handleResize(){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    function renderChart(main, tool){
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
        const total = getTotal(data, val)
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
        //const bar = svg.append('rect')
        svg.selectAll('*').remove()
        const x = d3.scaleLinear()
            .domain([0, max + max*.09])
            .range([0, width - 80])
        const y = d3.scaleBand()
            .domain(data.map(function(d) { return d[x_key] } ))
            .range([0, height-100])
            .padding(0.2)
        svg.append('g')
            .attr("transform", "translate(" + moveIt + "," + height + ")")
            .call(d3.axisBottom(x))
        svg.append('g')
            .attr("transform", "translate(" + moveIt + "," + 100 + ")")
            .call(d3.axisLeft(y))
        svg.append('g')
            .attr("transform", "translate(" + moveIt + "," + 100 + ")")
            .call(d3.axisLeft(y))
        const label = svg.append('g')
        const bar = svg.append('g')
        const text = svg.append('g')
        label.selectAll("label-polygon")
            .data(data)
            .enter()
            .append("polygon")
            .attr("points", function(d){ 
                const xEnd = x(parseInt(d[val])) 
                const xStart = xEnd
                const xMiddle = x(parseInt(d[val]))  
                const yCenter = y(d[x_key]) + y.bandwidth() / 2
                const yHalfBandwidth = y.bandwidth() / 2
                return (
                    xEnd + "," + (yCenter + yHalfBandwidth) + " " +
                    (xEnd + 50) + "," + (yCenter + yHalfBandwidth) + " " +
                    (xMiddle + 60) + "," + (yCenter) + " " +
                    (xEnd + 50) + "," + (yCenter - yHalfBandwidth) + " " +
                    xStart + "," + (yCenter - yHalfBandwidth) + " " +
                    (xMiddle + 10) + "," + (yCenter)
                )
            })
            .attr("transform", "translate(" + moveIt + "," + 100 + ")")
            .attr("fill", 'grey')
            .attr('opacity', .3)
        text.selectAll("label-text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", function(d){ 
                const xMiddle = x(parseInt(d[val])) + 15
                return xMiddle 
            })
            .attr("y", function(d) { return y(d[x_key]) + (y.bandwidth() + 10) / 2}) 
            .attr("transform", "translate(" + moveIt + "," + 100 + ")")
            .text(function(d){ 
                const ans = Math.round((d[val]/total)*100) + '%'
                return ans
            })
            .attr("fill", 'black')
            .attr('text-anchor', 'start')
            .attr('font-family', 'sans-serif')
            .attr('font-size', '1rem')
            .attr('font-weight', 'bold')
            .attr('fill', color)
        bar.selectAll("bar-polygon")
            .data(data)
            .enter()
            .append("polygon")
            .attr("points", function(d){ 
                const xStart = 0
                const xEnd = x(parseInt(d[val])) - 10
                const xMiddle = x(parseInt(d[val]))
                const yCenter = y(d[x_key]) + y.bandwidth() / 2
                const yHalfBandwidth = y.bandwidth() / 2
                return (
                    xStart + "," + (yCenter + yHalfBandwidth) + " " +
                    xEnd + "," + (yCenter + yHalfBandwidth) + " " +
                    xMiddle + "," + (yCenter) + " " +
                    xEnd + "," + (yCenter - yHalfBandwidth) + " " +
                    xStart + "," + (yCenter - yHalfBandwidth)
                )
            })
            .attr("transform", "translate(" + moveIt + "," + 100 + ")")
            .attr("fill", function(d) {return d.color})
        const title = svg.append('text')
            .attr("transform", "translate(" + width * 0.6 + "," + (height * 0.1 + 20) + ")")
            .text(tool.titleT)
            .attr('text-anchor', 'middle')
            .attr('font-size', '1.5rem')
            .attr('fill', color)
        const xlabel = svg.append('text')
            .attr("transform", "translate(" + width * 0.6 + "," + height * 1.1 + ")")
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
    /* this charts operations */
    function getTotal(params, key){
        let temp = 0
        for(let i = 0; i<params.length; i++){
            temp = temp + parseInt(params[i][key])
        }
        return temp
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
        <div id='screenShoot' className={(dark)?'landscape darkmode': 'landscape'}>
            <svg id='svgV' ref={svgRef}/>
        </div>
    )
    function handleMoveIt(params){
        console.log(params)
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
            <div id='chartContainer' className='inlineBlock vat'>
                <div id='content' className='inlineBlock vat'>
                    {(render)?pagination:chart}
                    <div id='options'>
                        {lowerBars}
                    </div>
                </div>
                {
                    <tools.Provider value={handleValue}>
                        <ImpHorizontalBarTool />
                    </tools.Provider>
                }
            </div>
        </>
    )
    /* -----------------------copy---------------------- */

}