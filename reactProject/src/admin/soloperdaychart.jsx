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
    const svgRef = useRef()
    const [width, setWidth] = useState( 1500 )
    const [height, setHeight] = useState( 350 )

    useEffect( ()=>{
        if(!contextData) return
        const allData = contextData.getAll
        render(allData)
    }, [contextData] )

    function render( thisData ){
        const maxH = domainH( thisData )
        const svg = d3.select( svgRef.current )
            .attr( 'width', width )
            .attr( 'height', height )
        svg.selectAll( '*' ).remove()
        const x = d3.scaleBand()
            .domain( times.map(function(d) { return d } ) )
            .range( [0,500] )
            .padding(.1)
        const y = d3.scaleLinear()
            .domain( [maxH+50,0] )
            .range( [0,250] )
        svg.append( 'g' )
            .call( d3.axisBottom( x ) )
            .attr( 'transform', 'translate(80,300)' )
        svg.append( 'g' )
            .call( d3.axisLeft( y ) )
            .attr( 'transform', 'translate(80,50)' )
        //color lines white
        svg.selectAll( '.tick text' )
            .attr( 'fill', 'white' )
        svg.selectAll( '.domain' )
            .attr( 'stroke', 'white' )
        svg.selectAll('rect')
            .data( thisData )
            .enter()
            .append('rect')
            .attr('x', function(d) {return x(d.date)})
            .attr('y', function(d) {return y(d.value)})
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return 250 - y(d.value) })
            .attr( 'transform', 'translate(80,50)' )
            .attr('fill', '#F86F03')
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
        <svg className="inlineBlock vat" ref={svgRef}></svg>
    )
}