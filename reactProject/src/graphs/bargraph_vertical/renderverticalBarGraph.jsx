import * as d3 from 'd3'
import { useEffect, useRef, useContext, createContext, useState } from 'react'
import { userData } from '../../home/home'
import VerticalGraphTool from '../../tools/verticalgraphtoolbar'
import DownloadBars from '../../common/downloadbars'
import DashBoard from '../../common/dashboard'
export const Move = createContext()
export const table = createContext()
export const tools = createContext()

/* REnders the vertical bar chart */
export default function RenderVerticalBarGraph(prop){
    /* copy */
    const svgRef = useRef(null)
    const fromHome = useContext(userData)
    const [tool, setTool] = useState(null)
    const [render, setRender] = useState(false)
    const [width, setWidth] = useState(window.innerWidth * .7)
    const [height, setHeight] = useState(window.innerHeight * .6)
    const [moveIt, setMoveIt] = useState(100)

    useEffect(()=>{
        if(!tool) return
        window.addEventListener('resize', handleResize)
        VBG(tool, fromHome)
        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    },[fromHome, tool, width, height, moveIt, render])
    /* copy */
    function handleResize(){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }
    function VBG(params1, params2){
        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()
        const xScale = d3.scaleBand().range ([0, width]).padding(0.4)
        const yScale = d3.scaleLinear().range ([height, 0])
        const color = params1.data2
        const fontAngle = params1.data1
        const diff = params1.data0 
        const title = params1.data5
        const x_label = params1.data3
        const y_label = params1.data4
    
        let g = svg.append("g")
            .attr("transform", "translate(" + moveIt + "," + 100 + ")")
        svg.append("text")
            .attr("transform", "translate(100,0)")
            .attr("text-anchor", "middle")
            .attr("x", width * .5)
            .attr("y", height * .1)
            .attr("font-size", "24px")
            .text(title)
        svg.append("text")
            .attr("transform", "translate(100,0)")
            .attr("text-anchor", "middle")
            .attr("x", width * .5)
            .attr("y", (height * 1)+ height * .45)
            .attr("font-size", "24px")
            .text(y_label)
        svg.append("text")
            .attr("text-anchor", "start")
            .attr("transform", "rotate(270, 190, 140)")
            .attr("font-size", "24px")
            .text(x_label)           

        const AxisX = Object.keys(params2[0])
        const AxisY = Object.keys(params2[1])
        let temp = 0;
        for(let i=0;i<params2.length;i++){
            const num = parseInt(params2[i][AxisY[1]])
            if(temp < num){
                temp = num
            }
        }
        xScale.domain(params2.map(function(d) { return d[AxisX[0]] }))
        yScale.domain([0, temp])
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll(".tick text") // Select the text elements within the ticks
            .classed("X-Axis", true); // Add the class "my-class" to the selected text elements
        g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){return d})
            .ticks(diff))
        g.selectAll('.X-Axis')
            .style('font-size', '12px')
            .attr("text-anchor", (fontAngle == 'Horizontal')?"middle":"start")
            .attr("transform", (fontAngle == 'Horizontal')?"":"rotate(45)")
        g.selectAll(".bar")
            .data(params2)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d[AxisX[0]]) })
            .attr("y", function(d) { return yScale(d[AxisX[1]]) })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - yScale(d[AxisX[1]]) })
            .attr('fill', color)
    }
    /* -----------------------copy---------------------- */
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
        <div id='screenShoot' className='landscape'>
            <svg id='svgV' ref={svgRef} />
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
        sendDataToParent(params)
    }
    function sendDataToParent(params){
        prop.sendDataToParent(params)
    }
    function handleValue(params){
        setTool(params)
    }
    /* -----------------------copy---------------------- */
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
                        <VerticalGraphTool />
                    </tools.Provider>
                }
            </div>
        </>
    )

}