import { useEffect, useRef, useContext } from 'react'
import * as d3 from 'd3'
import { PH } from '../home/home'

const CHART_DIMENTIONS = ({
    width: 1200,
    height: 2000,
    margin: 50,
})

export default function PhRegion(){

    const svgRef = useRef<SVGSVGElement|null>(null)
    const tableData = useContext<any>(PH)
    const raw = tableData.data0
    const tools = tableData.data1
    let arr1:any[] = []
    /* Hard coded x and y coordinates for pie graph */
    const locations:any = {
        'Region I':{x:450,y:500},
        'Cordillera Administrative Region':{x:580,y:450},
        'Region II':{x:680,y:470},
        'Region III':{x:500,y:700},
        'National Capital Region':{x:350,y:750},
        'Region IV-A':{x:650,y:800},
        'Region V':{x:900,y:900},
        'Region IV-B':{x:400,y:1100},
        'Region VI':{x:725,y:1175},
        'Region VIII':{x:1000,y:1100},
        'Negros Island Region':{x:750,y:1350},
        'Region VII':{x:900,y:1300},
        'Region IX':{x:750,y:1500},
        'Region X':{x:950,y:1450},
        'Region XIII':{x:1100,y:1450},
        'Region XI':{x:1150,y:1600},
        'Autonomous Region in Muslim Mindanao':{x:900,y:1625},
        'Region XII':{x:1000,y:1750},
    }
    
    useEffect(()=>{
        if(tableData && tools && tools.orig){
            const bdC = tools.borderC
            const geoJson = tools.orig.data0
            const title = tools.titleD

            operation()

            function operation(){
                let objTable:any = {}
                const column1 = Object.keys(tableData.data0[0])[0]
                let filterRaw = []
                if(geoJson) {
                    //get what are user's region
                    for(let i=0; i<raw.length; i++){
                        objTable[raw[i][column1]] = raw[i]
                    }
                    //filter what is in the geoJson from user's input
                    for(let j=0; j<geoJson.features.length; j++){
                        const name = geoJson.features[j].properties.ADM1_EN
                        if(objTable[name]){
                            const appendData = geoJson.features[j]
                            appendData['color'] = objTable[name]
                            arr1.push(appendData)
                        }
                    }
                    //datas from user (amount #)
                    for(let i=0; i<raw.length; i++){
                        filterRaw.push(raw[i])
                    }
                    for(let i=0; i<raw.length; i++){
                        filterRaw[i]['loc'] = locations[raw[i]['region']]
                        filterRaw[i]['amount'] = [raw[i].amount0, raw[i].amount1, raw[i].amount2]
                    }
                    renderMap(filterRaw)
                }
            }
            /* Renders the pie charts */
            function pieGraph(svg:any, dataPie:any, x:any, y:any, pieColor:any, innerR:any){
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
                    .attr('fill', (d:any, i:any) => pieColor[i])
                    .attr('stroke', tableData.data1.pieBorder)
                    .attr('stroke-width', tableData.data1.tPie)
            }
            /* Renders the entire map */
            function renderMap(filterRaw:any){
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
                        .attr("y", function(d:any, i:any) {return i * 50 })
                        .attr("x", 50)
                        .style('fill', function(d:any) {return d.color})  
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
                        .attr('y', function(d:any, i:any) {return (i * 50)})
                        .text(function(d:any) {return d.region})
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
                        .attr('fill', function(d:any){return d.color.color})
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
                        .attr("y", function(d:any, i:any) {return i * 50 })
                        .attr("x", 900)
                        .style('fill', function(d:any) {return d})  
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
                        .attr('y', function(d:any, i:any) {return (i * 50)})
                        .text(function(d:any) {return d})
                        .attr('font-size', '15px')
                        .attr("font-weight", "bold") 
                    //remove the custom for text legend after rendering
                    tableData.data0.pop()
                }
                /* renders the pie chart */
                for(let i=0; i<filterRaw.length; i++){
                    const dataPie = d3.pie().value((c:any) => c)(filterRaw[i].amount)  
                    const locX = filterRaw[i].loc.x
                    const locY = filterRaw[i].loc.y
                    const innerR = tableData.data1.pieR
                    pieGraph(svg,dataPie,locX,locY,pieColor,innerR)
                }
                return svg.node();
            }
        }
    },[tableData,])

    return <svg ref={svgRef}></svg>
}