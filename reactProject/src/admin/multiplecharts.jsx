import { useEffect, useState, useRef, useContext } from "react"
import { data } from "./adminDashboard"
import './administration.css'
import * as d3 from 'd3'

const LINECOLORS = [
    "steelblue", "green", "red", "orange", "purple",
    "blue", "yellow", "pink", "brown", "teal",
    "magenta", "cyan", "lime", "maroon", "navy",
    "olive", "peru", "plum", "salmon", "sienna"
]

export default function MultipleCharts( ){
    
    const contextData = useContext( data  )
    const svgRef = useRef( )
    const svgPieRef = useRef( )
    const [width, setWidth] = useState( 1500 )
    const [height, setHeight] = useState( 300 )
    const [over, setHover] = useState( null )
    const [title, setTitle] = useState( 'Charts Request' )

    useEffect(( ) => {
        if( !contextData ) return 
        const simple = contextData.simple
        const availableDate = contextData.getDates
        const max = contextData.peak
        const simplified = contextData.simplifyRes
        const total = contextData.total
        renderLineChart( simple, availableDate, max, simplified, total )
    }, [contextData, over] )

    function renderLineChart( params1, params2, params3, params4, total ){
        const svg = d3.select( svgRef.current )
            .attr( 'width', width )
            .attr( 'height', height )
        svg.selectAll( '*' ).remove()
        const x = d3.scaleTime()
            .domain(d3.extent( params2, function( d ) { return d3.timeParse( '%Y-%m-%d' )( d ) } ))
            .range( [0,1000] )
        const y = d3.scaleLinear()
            .domain( [params3,0] )
            .range( [0,200] )
        //y-axis
        svg.append('g')
            .call( d3.axisLeft( y ).ticks( 5 ))
            .attr( "transform", "translate( " + 80 + "," + 50 + ")")
        //x-axis
        svg.append( 'g' )
            .call( d3.axisBottom( x ).ticks(  ))
            .attr( "transform", "translate( " + 80 + "," + 250 + ")")
        //color lines white
        svg.selectAll( '.tick text' )
            .attr( 'fill', 'white' )
        svg.selectAll( '.domain' )
            .attr( 'stroke', 'white' )
        //generate lines
        let keys
        if( over ){
            const arr = [ over ]
            keys = arr
        }
        else{
            keys = Object.keys(contextData.simplifyRes)
        }
        for( let i=0; i<keys.length; i++ ){
            const line = svg.append('path').attr( 'transform', `translate( 80, 50 )` )
            line
                .datum( params4[keys[i]] )
                .attr( 'fill', 'none' )
                .attr( 'class', 'line-graph' )
                .attr( "stroke", LINECOLORS[i] )
                .attr( "stroke-width", 2 )
                .attr( "d", d3.line(  )
                    .x( function( d ) { return x( d3.timeParse( "%Y-%m-%d" )( d.date ))})
                    .y( function( d ) { return y( parseInt( d.amount ))})
                )
                .on('mouseover', function() {
                    d3.select(this).raise();
                })
        }
        /* Pie */
        let arr = []
        for( const i in params4 ){
            arr.push({name: i, value: params4[i].length})
        }
        const formatedData = d3.pie( ).value( ( d ) => d.value )( arr )
        const arc = d3.arc(  )
            .innerRadius( 90 )
            .outerRadius( 140 )
        svg
        const g = svg.append( "g" )
            .attr( "transform", `translate(  1300, 150 )` );
        g.selectAll( "path" )
            .data( formatedData )
            .join( "path" )
            .attr( "class", "pie" ) 
            .attr( 'd', arc )
            .attr( "fill", ( d, i ) => LINECOLORS[i] )
            .attr( "stroke", "white" )
            .on( "mouseover", function( event, d, i ) {
                hov( d )
            } )
            .on( "mouseout", function( event, d, i ) {
                unhov(  )
            } )
        g.append( 'text' )
            .text( (params1[over])?params1[over]:total )
            .attr( "transform", `translate(  0, -10 )` )
            .attr( "fill", 'white' )
            .attr( 'text-anchor', 'middle' )
        g.append( 'text' )
            .text( ((params1[over]/total)?(params1[over]/total * 100).toFixed(2) :100) + '%')
            .attr( "transform", `translate(  0, 40 )` )
            .attr( "fill", 'white' )
            .attr( 'text-anchor', 'middle' )
        g.selectAll( 'text' )
            .attr( 'font-family', 'sans-serif' )
            .attr( 'font-size', '2rem' )
            .attr( 'font-weight', 'bold' )
        g.append( 'text' )
            .text( title )
            .attr( "transform", `translate(  -700, -120 )` )
            .attr( 'font-size', '1.5rem' )
            .attr( "fill", 'white' )
            .attr( 'text-anchor', 'middle' )
            .attr( 'font-weight', 400 )
            .attr( 'font-family', 'sans-serif' )
    }

    function hov( params ){
        setHover( params.data.name )
        setTitle( params.data.name )
    }

    function unhov(  ){
        setHover( null )
        setTitle( 'Charts Request' )
    }
   
    return ( 
        <>
            <svg ref={svgRef} />
        </>
    )

}