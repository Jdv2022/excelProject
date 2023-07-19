import { useEffect, useRef, useContext,useState } from 'react'
import * as d3 from 'd3'
import { PH } from '../home/home'
import JumpLoading from '../extra/jumploading'
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/api/phregion/`

const CHART_DIMENTIONS = ({
    width: 1200,
    height: 2000,
    margin: 50,
})

export default function PhRegion(){

    const svgRef = useRef(null)
    const [render, setRender] = useState(false)
    const tableData = useContext(PH)
    const raw = tableData.data0
    const tools = tableData.data1
    let arr1 = []
    
    useEffect(()=>{
        if(tableData && tools && tools.orig){
            const bdC = tools.borderC
            const geoJson = tools.orig.data0
            const title = tools.titleD
            const toProcess = {raw: raw, geoJson: geoJson}

            op(toProcess)

            async function op(params){
                const processedData = await operation(params)
                arr1 = processedData.arr1
                await renderMap(processedData.filterRaw)
            }

            async function operation(params){
                const jsonData = JSON.stringify(params)
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
            /* Renders the pie charts */
            async function pieGraph(svg, dataPie, x, y, pieColor, innerR){
                const pieGroup = svg.append('g')
                const arc = d3.arc()
                    .innerRadius(innerR)
                    .outerRadius(50)
                pieGroup
                    .selectAll('.piePath')
                    .data(dataPie)
                    .enter()
                    .append('path')
                    .attr('d', arc)
                    .attr('transform', `translate(${x}, ${y})`)
                    .attr('fill', (d, i) => pieColor[i])
                    .attr('stroke', tableData.data1.pieBorder)
                    .attr('stroke-width', tableData.data1.tPie)
            }
            /* Renders the entire map */
            async function renderMap(filterRaw){
                if(!geoJson) return
                const svg = d3.select(svgRef.current)
                    .attr('width', CHART_DIMENTIONS.width)
                    .attr('height', CHART_DIMENTIONS.height);
                svg.selectAll('*').remove()
                const clippedWidth = CHART_DIMENTIONS.width - CHART_DIMENTIONS.margin * 2;
                const clippedHeight = CHART_DIMENTIONS.height - CHART_DIMENTIONS.margin * 2;
                const pieColor = tableData.data1.col
                const pieText = tableData.data1.cand
                const pieLegend = svg.append('g')
                const geoMercator = d3
                    .geoMercator()
                    // the center uses longtitude and latitude
                    // get Long/Lat data from google maps
                    .center([128, 36])
                    .fitSize([clippedWidth, clippedHeight], geoJson);
                const pathGen = d3.geoPath(geoMercator)

                if(arr1 && filterRaw && filterRaw[0].loc.x){     
                    //add a custom for text legend    
                    tableData.data0.push({region: 'No Data', amount: 0, color: 'black'})
                    
                    svg
                        .selectAll('rect')
                        .data(tableData.data0)
                        .enter()
                        .append('rect')
                        .attr("transform", "translate(0,150)")
                        .attr("y", function(d, i) {return i * 50 })
                        .attr("x", 50)
                        .style('fill', function(d) {return d.color})  
                        .attr('height', 20)
                        .attr('width', 20)
                        .attr('stroke', bdC)
                        .attr('stroke-width', 2)
                    svg
                        .selectAll('text')
                        .data(tableData.data0)
                        .enter()
                        .append('text')
                        .attr('x', 100) 
                        .attr("transform", "translate(0,165)")
                        .attr('y', function(d, i) {return (i * 50)})
                        .text(function(d) {return d.region})
                        .attr('font-size', '15px')
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
                        .attr('font-size', '25px')
                        .attr("font-weight", "bold")  
                    svg
                        .selectAll('.geopath')
                        .data(arr1)
                        .enter()
                        .append('path')
                        .attr("transform", "translate(100,20)")
                        .attr('d', pathGen)
                        .attr('stroke', bdC)
                        .attr('fill', function(d){return d.color.color})
                    svg
                        .append('path')
                        .attr("stroke", "black")
                        .attr("stroke-width", 2)
                        .attr("d", "M 400 750 L 570 770")
                    svg
                        .append('text')
                        .attr('x', 900) 
                        .attr("y", 110)
                        .text('Pie Chart Legend:')
                        .attr('font-size', '25px')
                        .attr("font-weight", "bold") 
                    pieLegend
                        .selectAll('rect')
                        .data(pieColor)
                        .enter()
                        .append('rect')
                        .attr("transform", "translate(0,150)")
                        .attr("y", function(d, i) {return i * 50 })
                        .attr("x", 900)
                        .style('fill', function(d) {return d})  
                        .attr('height', 20)
                        .attr('width', 20)
                        .attr('stroke', bdC)
                        .attr('stroke-width', 2)
                    pieLegend   
                        .selectAll('text')
                        .data(pieText)
                        .enter()
                        .append('text')
                        .attr('x', 950) 
                        .attr("transform", "translate(0,165)")
                        .attr('y', function(d, i) {return (i * 50)})
                        .text(function(d) {return d})
                        .attr('font-size', '15px')
                        .attr("font-weight", "bold") 
                    //remove the custom for text legend after rendering
                    tableData.data0.pop()
                }
                /* renders the pie chart */
                for(let i=0; i<filterRaw.length; i++){
                    const dataPie = d3.pie().value((c) => c)(filterRaw[i].amount)  
                    const locX = filterRaw[i].loc.x
                    const locY = filterRaw[i].loc.y
                    const innerR = tableData.data1.pieR
                    await pieGraph(svg,dataPie,locX,locY,pieColor,innerR)
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