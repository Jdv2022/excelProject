import { useContext, useEffect, useRef, useState } from 'react'
import { MyWidget } from './welcome'
import * as d3 from 'd3'
/* Horizontal bar chart in the landiong page widget */
export default function Widget(){
    const myValue = useContext(MyWidget)
    const svgRef = useRef(null)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    useEffect(()=>{
        window.addEventListener("resize", logScreenSize)
        if (!myValue) return;
        let populationArray = [
            {'key':'2020','value':myValue['2020']},
            {'key':'2019','value':myValue['2019']},
            {'key':'2018','value':myValue['2018']},
            {'key':'2017','value':myValue['2017']},
            {'key':'2016','value':myValue['2016']},
            {'key':'2015','value':myValue['2015']},
        ]
        chart(populationArray)
    },[myValue, screenWidth])

    function logScreenSize() {
        setScreenWidth(window.innerWidth)
    }

    function chart(populationArray){  
        const name = myValue['Country Name'] 
        const marginTop = 30
        const marginRight = 0
        const marginBottom = 10
        const marginLeft = 35
        const width = screenWidth * .1
        const height = screenWidth * .1
        // Create the scales.
        const x = d3.scaleLinear()
            .domain([0, d3.max(populationArray, (d) => d.value)])
            .range([marginLeft, width - marginRight]);
        const y = d3.scaleBand()
            .domain(populationArray.map((d) => d.key))
            .rangeRound([marginTop, height - marginBottom])
            .padding(0.1);
        // Create a value format.
        const format = x.tickFormat(10, ".2f");
        // Create the SVG container.
        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()
        svg
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, -10, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
        svg
            .append('text')
            .attr('x', 10)
            .attr('y', 10)
            .style('fill','#E1ECC8')
            .style('font','Sans Serif')
            .style('font-weight','bold')
            .style('font-size','1em')
            .text(name)
        svg
            .append('text')
            .attr('x', 10)
            .attr('y', 20)
            .style('fill','#E1ECC8')
            .style('font','Sans Serif')
            .style('font-weight','bold')
            .style('font-size','.85em')
            .text('Population per km²');
        // Append a rect for each letter.
        svg.append("g")
            .selectAll("rect")
            .data(populationArray)
            .join("rect")
            .attr("fill", "#FFA41B")
            .attr("x", x(0))
            .attr("y", (d) => y(d.key))
            .attr("width", (d) => x(d.value) - x(0))
            .attr("height", y.bandwidth())
            .selectAll('g text')
            .attr('fill', 'black')
        // Append a label for each letter.
        svg.append("g")
            .attr("fill", "white")
            .attr("text-anchor", "end")
            .selectAll()
            .data(populationArray)
            .join("text")
            .attr("x", (d) => x(d.value))
            .attr("y", (d) => y(d.key) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("dx", -4)
            .text((d) => format(d.value))
            .style('font-size','.7em')
            .style('fill','#333333')
            .style('font-weight','bold')
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .selectAll("text, path, line")
            .style("fill", "#E1ECC8")
            .style('font-size','.7em')    
    }
    return <svg id='widget1' ref={svgRef}></svg>
}