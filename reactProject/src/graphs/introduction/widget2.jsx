import { useContext, useEffect, useRef, useState } from 'react'
import { MyWidget } from './welcome'
import * as d3 from 'd3'

export default function Widget2(){
    const myValue = useContext(MyWidget)
    const svgRef = useRef(null)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    useEffect(()=>{
        window.addEventListener("resize", logScreenSize)
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
    },[myValue, screenWidth])

    function logScreenSize() {
        setScreenWidth(window.innerWidth)
    }
        
    function chart(populationArray){  
        const population = myValue['total']
        const low = myValue['0-14']
        const mid = myValue['15-64']
        const hi = myValue['65+']
        const length = population.length
        let num = ''
        //for population number comma
        for(let i=0;i<length;i++){
            if(length%3==0){
                if(i%3==0 && i!=0){
                    num = num + ',' + population[i] 
                }
                else{
                    num = num + population[i] 
                }
            }
            else{
                if(length%3 == 2){
                    if(i==2 || ((i+1)%3==0 && i!=3 && i!=0)){
                        num = num + ',' + population[i] 
                    }   
                    else{
                        num = num + population[i]
                    }
                }
                else if(length%3 == 1){
                    if(i==1 || ((i-1)%3==0 && i!=3 && i!=0)){
                        num = num + ',' + population[i] 
                    }   
                    else{
                        num = num + population[i]
                    }
                }
            }
        }
        const data = [
            {'age':'0-14','amount':low},
            {'age':'15-64','amount':mid},
            {'age':'65','amount':hi}
        ]
        const color = [
            "#38E54D",
            "#2192FF",
            "#F24C3D",
        ] 
        const formatedData = d3.pie().value((d) => d.amount)(data)
        const width = 200
        const height = 450
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(100)
        const svg = d3.select(svgRef.current)
            .style("font", "12px sans-serif");
        svg
            .selectAll('*').remove()
        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);
        svg
            .append('text')
            .attr('x', 5)
            .attr('y', 10)
            .style('fill','#E1ECC8')
            .style('font','Sans Serif')
            .style('font-weight','bold')
            .style('font-size','1.1em')
            .text('Population:');
        svg
            .append('text')
            .attr('x', 85)
            .attr('y', 10)
            .style('fill','#E1ECC8')
            .style('font','Sans Serif')
            .style('font-weight','bold')
            .style('font-size','1.1em')
            .style('fill','#FFED00')
            .text(num);
        svg
            .append('text')
            .attr('x', 5)
            .attr('y', 30)
            .style('fill','#E1ECC8')
            .style('font','Sans Serif')
            .style('font-weight','bold')
            .style('font-size','1.1em')
            .text('Legend:');
        svg
            .append('text')
            .attr('x', 28)
            .attr('y', 53)
            .style('fill','#E1ECC8')
            .style('font','Sans Serif')
            .style('font-weight','bold')
            .style('font-size','1.1em')
            .text('0-14 Years Old');
        svg
            .append('text')
            .attr('x', 28)
            .attr('y', 73)
            .style('fill','#E1ECC8')
            .style('font','Sans Serif')
            .style('font-weight','bold')
            .style('font-size','1.1em')
            .text('15-64 Years Old');
        svg
            .append('text')
            .attr('x', 28)
            .attr('y', 93)
            .style('fill','#E1ECC8')
            .style('font','Sans Serif')
            .style('font-weight','bold')
            .style('font-size','1.1em')
            .text('65+ Years Old');
        svg
            .append('rect')
            .attr('x', 5)
            .attr('y', 41)
            .style('fill','#38E54D')
            .attr('height', 10)
            .attr('width', 10)
        svg
            .append('rect')
            .attr('x', 5)
            .attr('y', 63)
            .style('fill','#2192FF')
            .attr('height', 10)
            .attr('width', 10)
        svg
            .append('rect')
            .attr('x', 5)
            .attr('y', 83)
            .style('fill','#F24C3D')
            .attr('height', 10)
            .attr('width', 10)
        g.selectAll()
            .data(formatedData)
            .join("path")
            .attr('d',arc)
            .attr("fill", (d,i) => color[i])
            .attr("stroke", "none")
        g.selectAll()
            .data(formatedData)
            .join('text')
            .text((d) => d.data.amount + '%')
            .attr('transform', (d) => `translate(${arc.centroid(d)})`)
            .style('text-anchor','middle')
            .style('font-size','1.2em')
            .style('font-weight','bold')
            .attr('fill','#1d1b1b')
        }
    return <svg id='widget2' ref={svgRef}></svg>
}