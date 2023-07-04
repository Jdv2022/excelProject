import { useEffect, useRef, useContext } from 'react'
import * as d3 from 'd3'
import { PH } from '../home/home'

const chart_dimensions = ({
    width: 1200,
    height: 2000,
    margin: 50,
})
/* Renders the ph-region */
export default function Philippines(){

    const svgRef = useRef<SVGSVGElement|null>(null)
    const tableData = useContext<any>(PH)
    const tools = tableData.data1
    let newArrMax:any = []
    let newArrMid:any = []
    let newArrMin:any = []
    let noDataArray:any = []
    let obj: any = {}
    
    useEffect(()=>{
        if(tableData && tools && tools.orig){
            const maxC = tools.maxColor
            const midC = tools.midColor
            const minC = tools.minColor
            const bdC = tools.borderC
            const geoJson = tools.orig.data0
            const color = tools.bg
            const maxUpD = tools.max
            const midMaxD = tools.maxMid
            const midMinD = tools.minMid
            const minD = tools.min
            const title = tools.titleD

            Province()

            function Province(){
                if(geoJson) {
                    let arrMax:any = []
                    let arrMid:any = []
                    let arrMin:any = []
                    let arrNoData:any = []
                    const column1 = Object.keys(tableData.data0[0])[0]
                    const column2 = Object.keys(tableData.data0[0])[1]
                    const lenT = tableData.data0.length
                    const tableD = tableData.data0
                    const len = geoJson.features.length
                    for(let i=0; i<len; i++){
                        const name = geoJson.features[i].properties.ADM2_EN
                        const value = geoJson.features[i]
                        obj[name] = value
                    } 

                    for(let i=0; i<lenT; i++){
                        const item = parseInt(tableD[i][column2])
                        if((item >= maxUpD) && maxUpD){
                            arrMax.push(tableD[i][column1])
                        }
                        else if(item <= midMaxD && item >= midMinD && midMaxD && midMinD){
                            arrMid.push(tableD[i][column1])
                        }
                        else if(item < midMinD && item >= minD && midMinD && (minD || minD == 0)){
                            arrMin.push(tableD[i][column1])
                        }
                        else{
                            arrNoData.push(tableD[i][column1])
                        }
                    }
                    const segragatedData = [arrMax, arrMid, arrMin, arrNoData]
                    for(let i=0; i<segragatedData.length; i++){
                        for(let j=0; j<segragatedData[i].length; j++){
                            const name = segragatedData[i][j]
                            if(i==0 && obj[name]){
                                newArrMax.push(obj[name])
                            }
                            else if(i==1 && obj[name]){
                                newArrMid.push(obj[name])
                            }
                            else if(i==2 && obj[name]){
                                newArrMin.push(obj[name])
                            }
                            else if(i==3 && obj[name]){
                                noDataArray.push(obj[name])
                            }
                        }
                    }
                }
            }
            
            renderMap()

            function renderMap(){
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
                    {color: maxC, intensity: 'High'}, 
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
                        .attr("y", function(d:any, i:any) {return i * 80 })
                        .attr("x", 50)
                        .style('fill', function(d:any) {return d.color})  
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
                        .attr('y', function(d:any, i:any) {return (i * 80)})
                        .text(function(d:any) {return d.intensity})
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
                            
                return svg.node();
            }
        }
    },[tableData,])

    return <svg ref={svgRef}></svg>
}