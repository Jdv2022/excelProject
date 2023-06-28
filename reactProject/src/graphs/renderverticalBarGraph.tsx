import * as d3 from 'd3'
import { useEffect, useRef, useState, useContext } from 'react'
import {verticalBar} from './verticalbargraphj'

export default function RenderVerticalBarGraph(){

    const svgRef = useRef<SVGSVGElement|null>(null)
    const verticalBarData = useContext<any>(verticalBar)
    const [sign, setSign] = useState('')

    useEffect(()=>{
        function VBG(){
            const svg = d3.select(svgRef.current)
            svg.selectAll('*').remove()
            const width = 1100 
            const height = 400 
            console.log(verticalBarData.data1)
            const xScale = d3.scaleBand().range ([0, width]).padding(0.4)
            const yScale = d3.scaleLinear().range ([height, 0])

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
            xScale.domain(verticalBarData.data0.map(function(d:any) { return d[AxisX[0]] }))
            yScale.domain([0, d3.max(verticalBarData.data0, function(d:any) { return d[AxisY[1]] })])

            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale))
                .selectAll(".tick text") // Select the text elements within the ticks
                .classed("X-Axis", true); // Add the class "my-class" to the selected text elements

            g.append("g")
                .call(d3.axisLeft(yScale).tickFormat(function(d:any){return sign + d})
                .ticks(verticalBarData.data1))

            g.selectAll('.X-Axis')
                .style('font-size', '12px')
                .attr("text-anchor", (verticalBarData.data2 == 'Horizontal')?"middle":"start")
                .attr("transform", (verticalBarData.data2 == 'Horizontal')?"Horizontal":"rotate(45)")
            
            g.selectAll(".bar")
                .data(verticalBarData.data0)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d:any) { return xScale(d[AxisX[0]]) })
                .attr("y", function(d:any) { return yScale(d[AxisX[1]]); })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d:any) { return height - yScale(d[AxisX[1]]) })
                .attr('fill', verticalBarData.data3)

        }
        VBG()
    },[verticalBarData.data1, verticalBarData.data2, verticalBarData.data3])

    return <svg width="1300" height="600" ref={svgRef}></svg>

}