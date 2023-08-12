import * as d3 from 'd3'
import { useEffect, useState, useRef, createContext} from 'react'
import PieChartTool from '../../tools/piecharttool'
import DashBoard from '../../common/dashboard'
import DownloadBars from '../../common/downloadbars'
import pieData from '../../sampleData/piedata'

export const tools = createContext()
export const Move = createContext()
export const table = createContext()

export default function PieChart(){
    /* COPY */
    const svgRef = useRef()
    const [data, setData] = useState(pieData())
    const [render, setRender] = useState(false)
    const [tool, setTool] = useState(null)
    const [width, setWidth] = useState(window.innerWidth * .7)
    const [height, setHeight] = useState(window.innerHeight * .77)
    const [dark, setDark] = useState(false)
    const [color, setColor] = useState('black')
    const [moveIt, setMoveIt] = useState(150)
    /* COPY */
    useEffect(()=>{
        renderPie(data)
    },[])
    function renderPie(params){
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
            .outerRadius(width * .26)
        const pie = svg.append('g')
            .attr("transform", `translate(${width * .8},${height / 1.8})`)
        pie.selectAll("path")
            .data(formatedData)
            .enter()
            .append("path")
            .attr('d', arc)
            .attr("fill", (d) => d.data.color)
        const text = svg.append('text')
        text.selectAll("text")
            .data(formatedData)
            .enter()
            .text(function(d){ d.data[name] })
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
                        <PieChartTool />
                    </tools.Provider>
                }
            </div>
        </>
    )
    /* -----------------------copy---------------------- */

}