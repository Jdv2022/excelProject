import { useEffect, useState, useRef, useContext } from "react";
import { data } from "./adminDashboard";
import * as d3 from 'd3'

const MONTHS = ["Jan.", "Feb.", "Mar", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
const LINECOLORS = ["steelblue", "green", "red", "orange"]

export default function MultipleCharts(){
    /* HOOKS */
    const contextData = useContext(data)
    const svgRef = useRef(null)
    const highRef = useRef(null)
    const [filter, setFilter] = useState('All')
    const [x1, setX1] = useState(50)
    const [x2, setX2] = useState(70)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [screenHeight, setScreenHeight] = useState(window.innerHeight)
    /* HOOKS */
    /* VARIABLEs */
    const height = screenHeight*.1
    const width = screenWidth*.8 
    /* Get all names */
    function getlist(params){
        let arr = []
        for(const n in params){
            if(!arr.includes(params[n].name)){
                arr.push(params[n].name)
            }
        }
        return arr
    }
    function handleResize(){
        setScreenWidth(window.innerWidth)
        setScreenHeight(window.innerHeight)
    }
    function customTickFormat(params){
        let sampler = []
        if(screenWidth < 513){
            setX1(20)
            setX2(25)
            for(let i=0; i<params.length; i++){
                const me = Math.floor(params.length/5)
                if(i%me == 0){
                    sampler.push(params[i])
                }
            }
            return sampler
        }
        else{
            return params
        }
    }
    function getMaxDayOfMonth(year, month) {
        let setDate = []
        // Set the date to the first day of the following month
        const firstDayOfNextMonth = new Date(year, month + 1, 1);
      
        // Subtract one day to get the last day of the desired month
        const lastDayOfMonth = new Date(firstDayOfNextMonth - 1);

        for(let i=0; i < lastDayOfMonth.getDate(); i++){
            setDate.push(MONTHS[month] + ' ' + parseInt(i+1) + ', ' + year)
        }

        // Return the day of the last day of the month
        return setDate;
    }
    function segregateXY(params1, params2, params3){
        let stack = []
        let stack_ = []
        let tempO = {}
        let final = []
        let temp = 0
        for (const n in params1){
            for (const i in params2){
                const d = new Date(params2[i]['created@'])
                const month = MONTHS[d.getMonth()]
                const day = d.getDate()
                const yr = d.getFullYear()
                const displayD = month + ' ' + day + ', ' + yr 
                if(!stack.includes(displayD) && params2[i].name == params1[n]){
                    stack.push(displayD)
                    stack_.push({date: displayD, value: params2[i].count})
                    if(temp < params2[i].count){
                        temp = params2[i].count
                    }
                }
            }
            if(stack_.length != params3.length){
                let temp = []
                for(const x in stack_){
                    temp.push(stack_[x].date)
                }
                for(const x in params3){
                    if(!temp.includes(params3[x])){
                        stack_.push({date: params3[x], value: 0})
                    }
                }
                for(const x in params3){
                    for(const y in stack_){
                        if(stack_[y].date == params3[x]){
                            final.push(stack_[y])
                            break
                        }
                    }
                }
            }
            tempO[params1[n]] = final
            stack = []
            stack_ = []
            final = []
        }
        return ( {data: tempO, max: temp} )
    }
    useEffect(()=>{
        window.addEventListener('resize', handleResize)
        const LISTS = getlist(contextData)
        const xDates = getMaxDayOfMonth(2023, 7)
        const segXY = segregateXY(LISTS, contextData, xDates)
        const maxHeight = segXY.max
        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)
        svg.selectAll('*').remove()
        const xScale = d3.scaleBand().range([0, width]).domain(xDates.map(function(d) { return d}))
        const yScale = d3.scaleLinear().range([height, 0]).domain([0, maxHeight])
        /* X-axis */
        const axis = svg.append('g').attr("transform", "translate(" + x1 + "," + 40 + ")")
        axis.append('g')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).tickValues(customTickFormat(xDates)))
            .selectAll(".tick text") 
            .classed("X-Axis", true)
        /* X-axis label */
        axis.selectAll('.X-Axis')
            .style('font-size', '10px')
            .attr("text-anchor", "start")
            .attr('fill', 'white')
            .attr('transform', function (d) {
                return 'rotate(45) translate(10,0)';
            })
        /* Y-axis */
        axis.append("g")
            .attr('color', 'white')
            .call(d3.axisLeft(yScale)
            .tickFormat(function(d){return d}).ticks(5))
        /* Axis colors */
        axis.select('.domain') 
            .style('stroke', 'white')
        /* Line */
        const linePath = svg.append('g')
        const line = d3.line()
            .x((d) => xScale(d?.date))
            .y((d) => yScale(parseInt(d?.value)))
        let keys 
        if(filter == 'All'){
            keys = Object.keys(segXY.data)
        }
        else{
            keys = [filter]
        }
        /* Title */
        const text = svg.append('g')
        text.append('text')
            .attr('x', '50%') 
            .attr('y', 30) 
            .text('Request Per Day')
            .attr('fill', 'whitesmoke')
            .attr('text-anchor', 'middle')
            .attr('font-size', '1.5rem')
        keys.forEach((key, i) => {
            const dataPoint = segXY.data[key]
            const pathData = line(dataPoint)
            linePath.append('path')
                .attr("transform", "translate(" + x2 + "," + 40 + ")")
                .attr('d', pathData)
                .attr('fill', 'none')
                .attr('stroke-width', 3)
                .attr('stroke', LINECOLORS[i])
                .attr('class', 'line')
        })
        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    },[contextData, filter, screenWidth, screenHeight])
    function handleSelect(event){
        let temp = 0
        let date = ''
        const trans = event.target.value
        setFilter(trans)
        for(const i in segXY1.data[trans]){
            if(temp < parseInt(segXY1.data[trans][i].value)){
                temp = parseInt(segXY1.data[trans][i].value)
                date = segXY1.data[trans][i].date
            }
        }
        const highElement = highRef.current
        highElement.textContent = temp + ' request '+ date
    }
    return (
        <div id="mul">
            <svg id="svg_multiplecharts" ref={svgRef}></svg>
            <div id="multiplecharts_dash">
                <select id="select_multiplecharts" onChange={handleSelect}>
                    <option>All</option>
                    <option>Vertical Bar Graph</option>
                    <option>Choropleth Map (PH-Provinces)</option>
                    <option>Choropleth Map (PH-Region)</option>
                    <option>Heat Map</option>
                </select>
                <h3 id="h3_multiplecharts_dash">Peak request:</h3>
                <p id="p_multiplecharts_dash" ref={highRef}></p>
            </div>
        </div>
    )
}