import { useEffect, useState, useRef, useContext } from "react"
import { data } from "./adminDashboard"
import * as d3 from 'd3'

const LINECOLORS = [
    "steelblue", "green", "red", "orange", "purple",
    "blue", "yellow", "pink", "brown", "teal",
    "magenta", "cyan", "lime", "maroon", "navy",
    "olive", "peru", "plum", "salmon", "sienna"
]

export default function MultipleCharts( ){
    
    const contextData = useContext( data  )
    const parentRef = useRef(null)
    const svgRef = useRef( )
    const [screenwidth, setWidth] = useState( window.innerWidth)
    const [screebheight, setHeight] = useState( window.innerHeight)
    const [over, setHover] = useState( null )
    const [title, setTitle] = useState( 'Charts Request' )

    useEffect(( ) => {
        window.addEventListener('resize', handleResize)
        if( !contextData ) return 
        const simple = contextData.simple
        const availableDate = contextData.getDates
        const max = contextData.peak
        const simplified = contextData.simplifyRes
        const total = contextData.total
        renderLineChart( simple, availableDate, max, simplified, total )
        return () =>{
            window.removeEventListener('resize', handleResize)
        }
    }, [contextData, over, screenwidth, screebheight] )

    function handleResize(){
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    function renderLineChart( params1, params2, params3, params4, total ){
        if(!parentRef.current) return 
        let height = parentRef.current.clientHeight 
        let width = parentRef.current.clientWidth - height*.10
        let pieCenterX, pieCenterY, innerR, outerR, lineheight, linewidth, transX
        let xticks = 10
        if(screenwidth <= 666){
            transX = 45
            xticks = 5
        }
        else{
            transX = 80
        }
        if(screenwidth <= 980 && screenwidth > 425){
            pieCenterX = width*.55
            pieCenterY = height*.75
            innerR = height/3 * .4 
            outerR = height/3 * .7 
            lineheight = height/1.7
            linewidth = width*.85
        }
        else if(screenwidth <= 425){
            pieCenterX = width*.6
            pieCenterY = height*.75
            innerR = height/3 * .4 
            outerR = height/3 * .7 
            lineheight = height/1.7
            linewidth = width*.85
        }
        else{
            pieCenterX = width-(height/3)
            pieCenterY = height*.5
            innerR = height/2 * .4 
            outerR = height/2 * .7 
            lineheight = height 
            linewidth = width - lineheight
        }
        const svg = d3.select( svgRef.current )
            .attr( 'width', width )
            .attr( 'height', height )
        svg.selectAll( '*' ).remove()
        const x = d3.scaleTime()
            .domain(d3.extent( params2, function( d ) { return d3.timeParse( '%Y-%m-%d' )( d ) } ))
            .range( [0,linewidth] )
        const y = d3.scaleLinear()
            .domain( [params3,0] )
            .range( [0,lineheight-150] )
        //y-axis
        svg.append('g')
            .call( d3.axisLeft( y ).ticks( 5 ))
            .attr( "transform", "translate( " + transX + "," + 50 + ")")
        //x-axis
        svg.append( 'g' )
            .call( d3.axisBottom( x ).ticks( xticks ).tickFormat(d3.timeFormat("%b-%d-%Y")))
            .attr( "transform", "translate( " + transX + "," + (lineheight-100) + ")")
            .classed('x', true)
        //color lines white
        svg.selectAll( '.tick text' )
            .attr( 'fill', 'white' )
        svg.selectAll( '.domain' )
            .attr( 'stroke', 'white' )
        if(screenwidth < 1400){
            svg.selectAll( '.x g text' )
                .attr('transform', `translate(5,5) rotate(45)`)
                .attr('text-anchor', 'start')
        }
        svg.append('text')
            .attr('transform',`translate(${linewidth/1.55},${height*.1})`)
            .text(title)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
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
            const line = svg.append('path').attr( 'transform', `translate( 45, 50 )` )
            line
                .datum( params4[keys[i]] )
                .attr( 'fill', 'none' )
                .attr( 'class', 'line-graph' )
                .attr( "stroke", LINECOLORS[i] )
                .attr( "stroke-width", 1 )
                .attr( "d", d3.line(  )
                    .x( function( d ) { return x( d3.timeParse( "%Y-%m-%d" )( d.date ))})
                    .y( function( d ) { return y( parseInt( d.amount ))})
                )
                .on('mouseover', function() {
                    d3.select(this).raise();
                })
        }
        svg.selectAll('.tick line')
            .attr('stroke', 'white')

        /* Pie */
        let arr = []
        for( const i in params4 ){
            arr.push({name: i, value: params4[i].length})
        }
        const formatedData = d3.pie( ).value( ( d ) => d.value )( arr )
        const arc = d3.arc(  )
            .innerRadius( innerR )
            .outerRadius( outerR )
        svg
        const g = svg.append( "g" )
            .attr( "transform", `translate(  ${pieCenterX}, ${pieCenterY} )` );
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
            .on( "click", function( event, d, i ) {
                hov( d )
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
        <div  ref={parentRef} id='admindash'>
            <svg id="svg" ref={svgRef} />
        </div>
    )

}