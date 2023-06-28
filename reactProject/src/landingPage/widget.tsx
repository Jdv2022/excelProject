import { useContext, useEffect, useRef } from 'react'
import { MyWidget } from './worldTour'
import * as d3 from 'd3'
import './widget.css'

export default function Widget(){
    const myValue: any = useContext(MyWidget)
    const svgRef = useRef<SVGSVGElement|null>(null)

    useEffect(()=>{
        if (!myValue) return;
        let populationArray = [
            {'key':'2020','value':myValue['2020']},
            {'key':'2019','value':myValue['2019']},
            {'key':'2018','value':myValue['2018']},
            {'key':'2017','value':myValue['2017']},
            {'key':'2016','value':myValue['2016']},
            {'key':'2015','value':myValue['2015']},
        ]
        const name = myValue['Country Name']
        function chart(){   
            const marginTop = 30;
            const marginRight = 0;
            const marginBottom = 10;
            const marginLeft = 35;
            const width = 100;
            const height = 100;

            // Create the scales.
            const x = d3.scaleLinear()
                .domain([0, d3.max(populationArray, (d:any) => d.value)])
                .range([marginLeft, width - marginRight]);
            
            const y = d3.scaleBand()
                .domain(populationArray.map((d:any) => d.key))
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
                .text(name);

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
                .attr("y", (d:any) => y(d.key))
                .attr("width", (d:any) => x(d.value) - x(0))
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
                .attr("x", (d:any) => x(d.value))
                .attr("y", (d:any) => y(d.key) + y.bandwidth() / 2)
                .attr("dy", "0.35em")
                .attr("dx", -4)
                .text((d:any) => format(d.value))
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

        chart();
        
    },[myValue])
    
    return <svg className='widget1' ref={svgRef}></svg>
}