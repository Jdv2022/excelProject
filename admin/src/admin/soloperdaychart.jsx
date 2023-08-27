import { useEffect, useState, useRef, useContext } from "react"
import { data } from "./adminDashboard"
import * as d3 from 'd3'

const times = [
    '00', '01', '02', '03',
    '04', '05', '06', '07',
    '08', '09', '10', '11',
    '12', '13', '14', '15',
    '16', '17', '18', '19',
    '20', '21', '22', '23'
]

export default function SoloPerDayChart(){
    
    const contextData = useContext(data)
    const parentRef = useRef(null)
    const svgRef = useRef()
    const [screenwidth, setWidth] = useState( window.innerWidth )
    const [screenheight, setHeight] = useState( window.innerHeight )

    useEffect( ()=>{
        window.addEventListener('resize', handleResize)
        if(!contextData) return
        const allData = contextData.getAll
        render(allData)
        return () =>{
            window.removeEventListener('resize', handleResize)
        }
    }, [contextData, screenwidth, screenheight] )

    function handleResize(){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    function render( thisData ){
        if(!parentRef.current) return 
        const width = parentRef.current.clientWidth 
        const height = parentRef.current.clientHeight //minus 10 so it wont overflow
        let title, transX
        if(screenwidth <= 666){
            transX = 45
        }
        else{
            transX = 80
        }
        if(screenwidth <= 980){
            title = ''
        }
        else{
            title = 'Request per hour'
        }
        const maxH = domainH( thisData )
        const svg = d3.select( svgRef.current )
            .attr( 'width', width )
            .attr( 'height', height )
        svg.selectAll( '*' ).remove()
        const x = d3.scaleBand()
            .domain( times.map(function(d) { return d } ) )
            .range( [0, width*.8] )
            .padding(.1)
        const y = d3.scaleLinear()
            .domain( [maxH+50,0] )
            .range( [0,height-120] )
        svg.append( 'g' )
            .call( d3.axisBottom( x ) )
            .attr( 'transform', `translate(${transX},${height-120+50})` )
            .classed('x',true)
        svg.append( 'g' )
            .call( d3.axisLeft( y ) )
            .attr( 'transform', `translate(${transX},50)` )
        //color lines white
        svg.selectAll( '.tick text' )
            .attr( 'fill', 'white' )
        if(screenwidth <= 400){
            svg.selectAll('.x text')
                .attr( 'transform', `translate(10,10) rotate(90)` )
                .attr('text-anchor', 'start')
        }
        svg.selectAll( '.domain' )
            .attr( 'stroke', 'white' )
        svg.selectAll('rect')
            .data( thisData )
            .enter()
            .append('rect')
            .attr('x', function(d) {return x(d.date)})
            .attr('y', function(d) {return y(d.value)})
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height-120 - y(d.value) })
            .attr( 'transform', `translate(${transX},50)` )
            .attr('fill', '#F86F03')
        svg.append('text')
            .text('Time')
            .attr('fill','white')
            .attr('transform', `translate(${width*.5},${height-20})`)
            .attr('text-anchor','middle')
        svg.append('text')
            .text(title)
            .attr('font-size','1.5rem')
            .attr('fill','white')
            .attr('transform', `translate(${width*.5},${20})`)
            .attr('text-anchor','middle')
        svg.selectAll('.tick line')
            .attr('stroke', 'white')
    }

    function domainH(d){
        let temp = 0
        for(let i=0; i<d.length; i++){
            if(temp < d[i].value){
                temp = d[i].value
            }
        }
        return temp
    }

    return (
        <div ref={parentRef} >
            <svg id="svg" ref={svgRef}></svg>
        </div>
    )
}