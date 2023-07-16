import { useEffect, useRef, useContext, useState } from 'react'
import * as d3 from 'd3'
import { HEATMAP } from '../home/home'
import samplePic from '../assets/chiller.jpg'

export default function HeatMap(){

    const tableData = useContext(HEATMAP)
    const svgRef = useRef(null)
    const [pic, setPic] = useState(samplePic)

    useEffect(()=>{
        const data = tableData.data0
        const picUrl = tableData.url
        let coor = null
        let high = null
        let normal = null
        let low = null
        if(data){
            coor = data.data2.coor
            high = data.data2.high
            normal = data.data2.normal
            low = data.data2.low
            render(data.data0, data.data1)
        }
        if(picUrl){
            setPic(picUrl)
        }
        function render(params, orig){
            const maxColorEnd = 'rgb(255, 255, 0, 0.1)'
            const maxColorStart = 'rgba(255, 0, 0, 0.1)'
            const midColorEnd = 'rgb(255, 0, 0, 0.1)'
            const midColorStart = 'rgb(0, 0, 255, 0.1)'
            const minColorEnd = 'rgb(0, 0, 255, 0.1)'
            const minColorStart = 'rgba(0, 0, 0, 0.1)'
            const svg = d3
                .select(svgRef.current)
                .attr('width', 1200)
                .attr('height', 600)
            const colorScaleHigh = d3.scaleLinear()
                .domain([101, 1000]) 
                .range([maxColorStart, maxColorEnd])
            const colorScaleMid = d3.scaleLinear()
                .domain([41, 100]) 
                .range([midColorStart, midColorEnd])
            const colorScaleLow = d3.scaleLinear()
                .domain([-10, 40]) 
                .range([minColorStart, minColorEnd])
            svg.selectAll('*').remove()
            svg
                .selectAll('circle')
                .data(params)
                .enter()
                .append('circle')
                .attr('r',40)
                .attr('fill', function(d){
                    if(high && d.val >=75) return 'none'
                    if(normal && d.val <= 74 && d.val >= 41) return 'none'
                    if(low && d.val <= 40) return 'none'
                    if(d.val >= 75) return colorScaleHigh(d.val)
                    else if(d.val <= 74 && d.val >= 41) return colorScaleMid(d.val)
                    else if(d.val <= 40) return colorScaleLow(d.val)
                    else {return 'none'}
                })
                .attr('cx', function(d){return d.x})
                .attr('cy', function(d){return d.y})
                .style('filter', 'blur(5px)')
            const dots = svg.append('g')
            if(coor){
                dots
                    .selectAll('text')
                    .data(orig)
                    .enter()
                    .append('text')
                    .attr('r',5)
                    .text('+')
                    .attr('x', function(d){return d.x})
                    .attr('y', function(d){return d.y+8})
                    .attr('text-anchor', 'middle')
                    .attr('fill','white')
                    .attr('font-size', '30px')
                    .attr('font-weight','bold')
                const inten = svg.append('g')
                inten 
                    .selectAll('text')
                    .data(orig)
                    .enter()
                    .append('text')
                    .text(function(d){return `(${d.val})`})
                    .attr('x', function(d){
                        if(d.x == 1200){
                            return d.x - 20
                        }
                        else if(d.x == 0){
                            return d.x + 20
                        }
                        else{
                            return d.x
                        }
                    })
                    .attr('y', function(d){
                        if(d.y == 600){
                            return d.y - 20
                        }
                        else{
                            return d.y + 20
                        }
                    })
                    .attr("text-anchor", "middle")
                    .attr('fill', 'black')
                    .style('font','Sans Serif')
            }
        }
    },[tableData, pic])
    return (
        <div className='img' style={{ backgroundImage: `url(${pic})` }} >
            <svg height={600} width={1100} ref={svgRef}></svg>
        </div>
    )

}