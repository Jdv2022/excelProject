import * as d3 from 'd3'
import { useEffect, useRef, useContext } from 'react'
import {VERTICALBAR} from '../home/home'
/* REnders the vertical bar chart */
export default function RenderVerticalBarGraph(){
    const svgRef = useRef<SVGSVGElement|null>(null)
    const verticalBarData = useContext<any>(VERTICALBAR)
    useEffect(()=>{
        function VBG(){
            const svg = d3.select(svgRef.current)
            svg.selectAll('*').remove()
            const width = 1100 
            const height = 400 
            const xScale = d3.scaleBand().range ([0, width]).padding(0.4)
            const yScale = d3.scaleLinear().range ([height, 0])
            if(!verticalBarData.data1) return
            const mainD = verticalBarData.data1
            const color = mainD.data2
            const fontAngle = mainD.data1
            const diff = mainD.data0 
            let g = svg.append("g")
                .attr("transform", "translate(" + 100 + "," + 100 + ")")
            svg.append("text")
                .attr("transform", "translate(100,0)")
                .attr("x", 425)
                .attr("y", 50)
                .attr("font-size", "24px")
                .text("XYZ Foods Stock Price")
            svg.append("text")
                .attr("transform", "translate(100,0)")
                .attr("text-anchor", "middle")
                .attr("x", 525)
                .attr("y", 580)
                .attr("font-size", "24px")
                .text("Fruits")
            svg.append("text")
                .attr("text-anchor", "start")
                .attr("transform", "rotate(270, 190, 140)")
                .attr("font-size", "24px")
                .text("Amount")           
            if(!verticalBarData) return
            const AxisX:any = Object.keys(verticalBarData.data0[0])
            const AxisY:any = Object.keys(verticalBarData.data0[1])
            let temp = 0;
            for(let i=0;i<verticalBarData.data0.length;i++){
                const num = parseInt(verticalBarData.data0[i][AxisY[1]])
                if(temp < num){
                    temp = num
                }
            }
            xScale.domain(verticalBarData.data0.map(function(d:any) { return d[AxisX[0]] }))
            yScale.domain([0, temp])
            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale))
                .selectAll(".tick text") // Select the text elements within the ticks
                .classed("X-Axis", true); // Add the class "my-class" to the selected text elements
            g.append("g")
                .call(d3.axisLeft(yScale).tickFormat(function(d:any){return d})
                .ticks(diff))
            g.selectAll('.X-Axis')
                .style('font-size', '12px')
                .attr("text-anchor", (fontAngle == 'Horizontal')?"middle":"start")
                .attr("transform", (fontAngle == 'Horizontal')?"":"rotate(45)")
            g.selectAll(".bar")
                .data(verticalBarData.data0)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d:any) { return xScale(d[AxisX[0]]) })
                .attr("y", function(d:any) { return yScale(d[AxisX[1]]) })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d:any) { return height - yScale(d[AxisX[1]]) })
                .attr('fill', color)
        }
        VBG()
    },[verticalBarData.data0, verticalBarData.data1])

    return <svg width="1250" height="600" ref={svgRef}></svg>

}