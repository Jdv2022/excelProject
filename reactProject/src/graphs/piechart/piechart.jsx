import * as d3 from 'd3'
import { useEffect, useState, useRef, createContext} from 'react'
import PieChartTool from '../../tools/piecharttool'
import DashBoard from '../../common/dashboard'
import DownloadBars from '../../common/downloadbars'
import pieData from '../../sampleData/piedata'

export const tools = createContext()
export const Move = createContext()
export const table = createContext()

/* 
    Docu: This for ph region component 
    parent component -> home.jsx
    child component -> downloadbars.jsx
    child component -> dashboard.jsx
    child componnent -> piechartool.jsx
*/

export default function PieChart(){
    /* COPY */
    const svgRef = useRef()
    const parentRef = useRef(null)
    const [data, setData] = useState(pieData())
    const [render, setRender] = useState(false)
    const [tool, setTool] = useState(null)
    const [screenwidth, setWidth] = useState(window.innerWidth * .7)
    const [screenheight, setHeight] = useState(window.innerHeight * .77)
    const [moveIt, setMoveIt] = useState(screenwidth * .8)
    const [display, setDisplay] = useState('none')
    /* COPY */
    useEffect(()=>{
        window.addEventListener('resize', handleResize)
        if(!tool) return
        renderPie(data, tool)
        return () =>{
            window.removeEventListener('resize', handleResize)
        }
    },[data, screenwidth, screenheight, moveIt, tool, render, display])
    function handleResize(){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }
    function renderPie(params, tool){
        if(!parentRef.current) return 
        const width = parentRef.current.clientWidth 
        const height = parentRef.current.clientHeight 
        if(tool.label){
            setDisplay(null)
        }
        else{
            setDisplay('none')
        }
        const sum = total(params)
        const name = Object.keys(params[0])[0]
        const key = Object.keys(params[0])[1]
        const color = Object.keys(params[0])[2]
        const formatedData = d3.pie().value((d) => parseInt(d[key]))(params)
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
        svg.selectAll('*').remove()
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(width * .25)
        const pie = svg.append('g')
            .attr("transform", `translate(${moveIt},${height / 2})`)
        pie.selectAll("path")
            .data(formatedData)
            .enter()
            .append("path")
            .attr('d', arc)
            .attr("fill", (d) => d.data.color)
        svg.append('g') 
            .selectAll("text") 
            .data(formatedData)
            .enter()
            .append('text')
            .attr("transform", `translate(${width * .1},100)`)
            .attr('y', function(d, i) {
                return i * ((width + height) * 0.03) + 100
            })
            .attr('x', 100)
            .attr('font-size', (width + height) * 0.015)
            .attr("font-weight", "bold")
            .attr('font-family', 'sans-serif')
            .text(function(d) {
                return d.data[name]
            })
        svg.append('g')
            .selectAll('rect')
            .data(formatedData)
            .enter()
            .append('rect')
            .attr("transform", `translate(${width * .15},83)`)
            .attr('y', function(d, i) {
                return i * ((width + height) * 0.03) + 100
            })
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', function(d) { return d.data[color] })
        pie.append('g')
            .selectAll()
            .data(formatedData)
            .join('text')
            .text((d) => ((d.data[key]/sum)*100).toFixed(2) + '%')
            .attr('transform', (d) => `translate(${arc.centroid(d)})`)
            .style('text-anchor','middle')
            .style('font-size','1.5rem')
            .style('font-weight','bold')
            .attr('fill', tool.color)
            .attr('font-family', 'sans-serif')
            .attr('display', display);
        svg.append('text')
            .attr("transform", `translate(${width * .15}, 100)`)
            .text(tool.title)
            .attr('text-anchor', 'start')
            .style('font-size','2rem')
            .style('font-weight','bold')
            .attr('font-family', 'sans-serif')
    }   
    function total(params){
        const key = Object.keys(params[0])[1]
        let total = 0
        for(let i=0; i<params.length; i++){
            total = total + parseInt(params[i][key])
        }
        return total
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
        <div id='screenShoot' ref={parentRef} className='landscape'>
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
    }
    function handleValue(params){
        setTool(params)
    }
    return (
        <div id='landscapeContainer'>
            <div>
                {(render)?pagination:chart}
                {lowerBars}
            </div>
            {
                <tools.Provider value={handleValue}>
                    <PieChartTool />
                </tools.Provider>
            }
        </div>
    )
    /* -----------------------copy---------------------- */

}