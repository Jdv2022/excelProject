import { useEffect, useState, useRef, useContext } from "react"
import { data } from "./adminDashboard"
import * as d3 from 'd3'
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/get/timelog`

const hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

export default function SoloPerDayChart(){
    /* HOOKS */
    const svgRef = useRef(null)
    const [json, setJson] = useState(null)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const [screenHeight, setScreenHeight] = useState(window.innerHeight)
    const [visorWidth, setVisorWidth] = useState(.4)
    const [x1, setX] = useState(70)
    /* HOOKS */
    /* VARIABLEs */
    const height = screenHeight * .38
    const width = screenWidth * visorWidth
    /* Get all names */
    function segregate(params){
        let arr = []
        let arr2 = []
        let ch = []
        let tep = 0
        let max = 0
        for(const i in params){
            const min = parseInt(params[i]['min'])/60
            const time = parseInt(params[i]['hr'])+min
            const value = parseInt(params[i]['name_count'])
            if(!arr.includes(time)){
                arr.push({time: time, value: value})
            }
        }
        for(const i in arr){
            for(let j=0; j<arr.length; j++){
                if(arr[i]['time'] == arr[j]['time']){
                    if(j != i){
                        tep = tep + parseInt(arr[j]['value'])
                        arr[i]['value'] = tep
                    }
                    else{
                        tep = parseInt(arr[i]['value'])
                    }
                }
            }
            tep = 0
        }
        for(const i in arr){
            if(!ch.includes(arr[i]['time'])){
                ch.push(arr[i]['time'])
                arr2.push(arr[i])
                if(max < arr[i]['value']){
                    max = max + arr[i]['value']
                }
            }
        }
        let expel = []
        for(const i in arr2){
            const up = Math.ceil(arr2[i]['time'])
            const down = Math.floor(arr2[i]['time'])
            if(hours.includes(up) || hours.includes(down)){
                expel.push(Math.round(arr2[i]['time']))
            }
        }
        for(const i in hours){
            if(!expel.includes(hours[i])){
                arr2.push({time: hours[i], value: 0})
            }
        }
        function rec(params, count = 0){
            let temp = 0
            for(let i=0; i<params.length; i++){
                if(params[i].time > params[i+1]?.time){
                    const uss = params[i]
                    params[i] = params[i + 1]
                    params[i + 1] = uss
                }
            }
            for(let i=0; i<params.length; i++){
                if(params.length - 1 == i){
                    params.push({time: 24, value: 0})
                    params.push({time: 0, value: 0})
                    return params
                }
                if(temp <= params[i].time){
                    temp = params[i].time
                }
                else{
                    break
                }
            }
            count++
            return rec(params, count)
        }
        const rets = rec(arr2)
        render(rets, max)
    }   
    function render(params, maxheight){
        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)
        svg.selectAll('*').remove()
        const x = d3.scaleLinear().range([width, 0]).domain([24, 0])
        const y = d3.scaleLinear().range([height, 0]).domain([0, maxheight])
        const axis = svg.append('g').attr("transform", "translate(" + x1 + "," + 90 + ")")
        const axisY = svg.append('g').attr("transform", "translate(" + x1 + "," + 90 + ")")
        /* X-axis */
        axis.append('g')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll(".tick text") 
            .classed("X-Axis", true)
            .attr('color', 'white')
        /* Y-axis */
        axisY.append("g")
            .attr('color', 'white')
            .call(d3.axisLeft(y).tickFormat(function(d){return d}).ticks(5))
        axisY.selectAll(".tick line")
            .attr("x2", width)
            .attr('opacity', .1)
        /* Line */
        const linePath = svg.append('g')
        const line = d3.line()
            .x((d) => x(d?.time))
            .y((d) => y(d?.value))
        const pathData = line(params)
        linePath.append('path')
            .attr("transform", "translate(" + x1 + "," + 90 + ")")
            .attr('d', pathData)
            .attr('fill', 'rgb(70, 130, 180, .05)')
            .attr('stroke-width', 2)
            .attr('stroke', 'steelblue')
        /* Title */
        const text = svg.append('g')
        text.append('text')
            .attr('x', '50%') 
            .attr('y', 50) 
            .text('Total Request Per Hour')
            .attr('text-anchor', 'middle')
            .attr('font-size', '1.5rem')
            .attr('fill', 'white')
        text.append('text')
            .attr('x', '50%') 
            .attr('y', screenHeight*.6) 
            .text('Time')
            .attr('text-anchor', 'middle')
            .attr('font-size', '1.5rem')
            .attr('fill', 'white')
    }
    useEffect(()=>{   
        if(window.innerWidth <= 1018){
            setVisorWidth(.8)
        }
        else{
            setVisorWidth(.4)
        }
        if(screenWidth < 513){
            setX(50)
        }
        setScreenWidth(window.innerWidth)
        setScreenHeight(window.innerHeight)
        async function getlogs(){
            try{
                const response = await fetch(endpointUrl, {
                    method : 'GET'
                })
                if(response.ok){
                    const apiData = await response.text()
                    const jsonData = apiData ? await JSON.parse(apiData) : {}
                    setJson(jsonData.response)
                    segregate(jsonData.response)
                }
                else {
                    throw new Error('Request failed')
                }
            }
            catch(err){
                console.error(err)
            }
        }   
        if(json){
            segregate(json)
        }
        else{
            getlogs()
        }
    },[json, screenHeight, screenWidth])

    return (
        <div id="mul2">
            <svg className="w-100 h-100" ref={svgRef}></svg>
        </div>
    )
}