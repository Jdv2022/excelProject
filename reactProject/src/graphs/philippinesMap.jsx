import { useEffect, useRef, useContext, useState } from 'react'
import * as d3 from 'd3'
import { PH } from '../home/home'
import JumpLoading from '../extra/jumploading'
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/api/philippinesmap/`

//GLOBALS
const chart_dimensions = ({
    width: 1200,
    height: 2000,
    margin: 50,
})
/* Renders the ph-region */
export default function Philippines(){
    
    const svgRef = useRef(null)
    const [render, setRender] = useState(false)
    const tableData = useContext(PH)
    const tools = tableData.data1

    useEffect(()=>{
        if(tableData && tools && tools.orig){
            const bdC = tools.borderC
            const geoJson = tools.orig.data0
            const color = tools.bg
            const maxC = tools.maxColor
            const midC = tools.midColor
            const minC = tools.minColor
            const title = tools.titleD
            /* Process is done backend */
            async function Province(params0){
                const jsonData = JSON.stringify(params0)
                try {
                    const response = await fetch(endpointUrl, {
                        method: 'POST',
                        body: jsonData,
                    })
                    if (response.ok) {
                        const viewData = await response.json()
                        return viewData
                    } 
                    else {
                        throw new Error('Request failed')
                    }
                } 
                catch (error) {
                    console.error('Error uploading file:', error)
                }
                return null
            }

            renderMap()

            async function renderMap(){
                const tool = {
                    max: tableData.data1.max, 
                    maxmid: tableData.data1.maxMid,
                    minmid: tableData.data1.minMid,
                    min: tableData.data1.min,
                }

                const read = await Province({tableData:tableData.data0, tool: tool, geoJson: geoJson})
                
                const newArrMax = read.newArrMax
                const newArrMid = read.newArrMid
                const newArrMin = read.newArrMin
                const noDataArray = read.noDataArray
                
                if(!geoJson) return
                const svg = d3.select(svgRef.current)
                    .attr('width', chart_dimensions.width)
                    .attr('height', chart_dimensions.height);
                svg.selectAll('*').remove()
                const clippedWidth = chart_dimensions.width - chart_dimensions.margin * 2;
                const clippedHeight = chart_dimensions.height - chart_dimensions.margin * 2;
                const geoMercator = d3
                    .geoMercator()
                    // the center uses longtitude and latitude
                    // get Long/Lat data from google maps
                    .center([128, 36])
                    .fitSize([clippedWidth, clippedHeight], geoJson);
                const pathGen = d3.geoPath(geoMercator)
                const arr = [
                    {color:maxC, intensity: 'High'}, 
                    {color:midC, intensity: 'Moderate'}, 
                    {color:minC, intensity: 'Low'},
                    {color:color, intensity: 'No Data'}
                ]
                if(newArrMax && newArrMid && newArrMin){ 
                    svg
                        .selectAll('rect')
                        .data(arr)
                        .enter()
                        .append('rect')
                        .attr("transform", "translate(0,150)")
                        .attr("y", function(d, i) {return i * 80 })
                        .attr("x", 50)
                        .style('fill', function(d) {return d.color})  
                        .attr('height', 20)
                        .attr('width', 20)
                        .attr('stroke', bdC)
                        .attr('stroke-width', 2)
                    svg
                        .selectAll('text')
                        .data(arr)
                        .enter()
                        .append('text')
                        .attr('x', 100) 
                        .attr("transform", "translate(0,165)")
                        .attr('y', function(d, i) {return (i * 80)})
                        .text(function(d) {return d.intensity})
                        .attr('font-size', '20px')
                        .attr("font-weight", "bold")
                    svg
                        .append("text")
                        .attr("text-anchor", "start")
                        .attr("x", 50)
                        .attr("y", 50)
                        .attr("font-size", "35px")
                        .attr("font-weight", "bold")
                        .text(title) 
                    svg
                        .append('text')
                        .attr('x', 50) 
                        .attr("y", 110)
                        .text('Legend:')
                        .attr('font-size', '20px')
                        .attr("font-weight", "bold")  
                    svg
                        .selectAll('.geopath')
                        .data(noDataArray)
                        .enter()
                        .append('path')
                        .attr("transform", "translate(100,20)")
                        .attr('d', pathGen)
                        .attr('stroke', bdC)
                        .attr('fill', color)
                    svg
                        .selectAll('.geopath')
                        .data(newArrMax)
                        .enter()
                        .append('path')
                        .attr("transform", "translate(100,20)")
                        .attr('d', pathGen)
                        .attr('stroke', bdC)
                        .attr('fill', maxC)
                    svg
                        .selectAll('.geopath')
                        .data(newArrMid)
                        .enter()
                        .append('path')
                        .attr("transform", "translate(100,20)")
                        .attr('d', pathGen)
                        .attr('stroke', bdC)
                        .attr('fill', midC)
                    svg
                        .selectAll('.geopath')
                        .data(newArrMin)
                        .enter()
                        .append('path')
                        .attr("transform", "translate(100,20)")
                        .attr('d', pathGen)
                        .attr('stroke', bdC)
                        .attr('fill', minC)
                    }
                setRender(true)
                return svg.node();
            }
        }
    },[tableData])

    if(render){
        return <svg ref={svgRef}></svg>
    }
    else{
        return <div id='loadingJump'><JumpLoading/></div>
    }
    
}