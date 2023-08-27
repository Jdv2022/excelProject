import { useContext, useEffect, useRef, useState } from 'react'
import { MyWidget } from './welcome'
import * as d3 from 'd3'

/* 
    Docu: This is a horizontal bar loaded in the welcome page. This component's parent is ./welcome.jsx
*/
export default function Widget(){

    const parentRef = useRef(null)
    const myValue = useContext(MyWidget) //from ./welcome.js
    const svgRef = useRef(null)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)

    useEffect(()=>{
        window.addEventListener("resize", logScreenSize) //rerender when screen resizes
        if (!myValue) return
        let populationArray = [
            {'key':'2020','value':myValue['2020']},
            {'key':'2019','value':myValue['2019']},
            {'key':'2018','value':myValue['2018']},
            {'key':'2017','value':myValue['2017']},
            {'key':'2016','value':myValue['2016']},
            {'key':'2015','value':myValue['2015']},
        ]
        chart(populationArray)
        return () => {
            window.removeEventListener('resize', logScreenSize) //remove resize eventlistener when unmounted do not remove
        }
    },[myValue, screenWidth])

    function logScreenSize() {
        setScreenWidth(window.innerWidth)
    }

    function chart(populationArray){  
        if(screenWidth <= 925) return //for smallest screen width, do not render below 768px
        if(!parentRef.current) return 
        const width = parentRef.current.clientWidth
        const height = parentRef.current.clientHeight
        const name = myValue['Country Name'] 
        const marginTop = 50
        const marginRight = 0
        const marginBottom = 10
        const marginLeft = 35
        // Create the scales.
        const x = d3.scaleLinear()
            .domain([0, d3.max(populationArray, (d) => d.value)])
            .range([marginLeft, width - marginRight])
        const y = d3.scaleBand()
            .domain(populationArray.map((d) => d.key))
            .rangeRound([marginTop, height * .5 - marginBottom])
            .padding(0.1)
        // Create a value format.
        const format = x.tickFormat(10, ".2f")
        // Create the SVG container.
        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()
        svg
            .attr("width", width)
            .attr("height", height)
            .attr("transform", `translate(${0},${0})`)
        svg
            .append('text')
            .attr('x', 10)
            .attr('y', 20)
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
            .text('Population per km²')
            .attr("transform", `translate(${0},20)`)
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
    
    return (
        <div ref={parentRef} className='parent-container'>
            <svg ref={svgRef}></svg>
        </div>
    )
}