import * as d3 from 'd3'
import { useEffect, useRef, useContext, createContext, useState } from 'react'
import { userData } from '../../home/home'
import VerticalGraphTool from '../../tools/verticalgraphtoolbar'
import DownloadBars from '../../common/downloadbars'
import DashBoard from '../../common/dashboard'
export const Move = createContext()
export const table = createContext()
export const tools = createContext()

/* 
    Docu: This for ph region component 
    parent component -> home.jsx
    child component -> downloadbars.jsx
    child component -> dashboard.jsx
    child componnent -> verticalgraphtoolbar.jsx
*/

export default function RenderVerticalBarGraph(prop){

    /* copy */
    const parentRef = useRef(null)
    const svgRef = useRef(null)
    const fromHome = useContext(userData)
    const [tool, setTool] = useState(null)
    const [render, setRender] = useState(false)
    const [screenWidth, setWidth] = useState(window.innerWidth)
    const [screenHeight, setHeight] = useState(window.innerHeight)
    const [moveIt, setMoveIt] = useState(100)

    useEffect(()=>{
        if(!tool) return
        window.addEventListener('resize', handleResize)
        VBG(tool, fromHome)
        // Clean up the event listener when the component is unmounted, do not remove
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    },[fromHome, tool, screenWidth, screenHeight, moveIt, render])
    /* copy */

    function handleResize(){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    function maxs(params, key){
        let temp = 0
        for(let i=0; i<params.length; i++){
            const val = params[i][key]
            if(temp < val){
                temp = val
            }
        }
        return temp
    }

    function VBG(params1, params2){
        if(!parentRef.current) return 
        const width = parentRef.current.clientWidth 
        const height = parentRef.current.clientHeight 
        const margin = 200
        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove() //remove previous render with new. Do not remove so charts wont stack
        const keys = Object.keys(params2[0])
        const max = maxs(params2, keys[1])
        console.log(params1, params2, max)
        const x = d3.scaleBand()
            .domain( params2.map(function(d){ return d[keys[0]] }) )
            .range( [0,width-margin] )
            .padding(.2)
        const y = d3.scaleLinear()
            .domain( [0, max] )
            .range( [height-margin ,0] )
        svg.append('g')
            .call( d3.axisBottom(x) )
            .attr("transform", "translate(" + moveIt + "," + (height-100) + ")")
            .classed('x-label', true)
        svg.append('g')
            .call( d3.axisLeft(y).ticks(params1.data0) )
            .attr("transform", "translate(" + moveIt + "," + 100 + ")")
        svg.selectAll('rect')
            .data(params2)
            .enter()
            .append('rect')
            .attr('x', function(d){return x(d[keys[0]])})
            .attr('y', function(d){return y(d[keys[1]])})
            .attr('width', x.bandwidth())
            .attr('height', function(d){return (height-margin) - y(d[keys[1]])})
            .attr('fill', params1.data2)
            .attr("transform", "translate(" + moveIt + "," + 100 + ")")
        svg.append('text')
            .attr('x', width*.5)
            .attr('y', height*.95)
            .text(params1.data3)
            .attr('text-anchor', 'middle')
            .attr('font-size', '1.5rem')
        svg.append('text')
            .text(params1.data4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '1.5rem')
            .attr('transform', `translate(${width*.04}, ${height*.5}) rotate(-90)`)
        svg.append('text')
            .text(params1.data5)
            .attr('x', width*.5)
            .attr('y', height*.1)
            .attr('text-anchor', 'middle')
            .attr('font-size', '2rem')
        svg.selectAll('.tick line')
            .attr('stroke', 'black')
        svg.selectAll('.x-label .tick text')
            .attr('transform', `translate(5,0) ${params1.data1}`)
            .attr('text-anchor',(params1.data1 == 'rotate(45)')?'start':'middle')
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
        <div id='screenShoot' className='landscape' ref={parentRef}>
            <svg id='svg' ref={svgRef} />
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
            <div id='landscapeContainer'>
                <div>
                    {(render)?pagination:chart}
                    {lowerBars}
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