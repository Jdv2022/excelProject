import { useEffect, useState, useRef, useContext } from "react"
import { data } from "./adminDashboard"
import * as d3 from 'd3'
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/get/timelog`

const hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]

export default function SoloPerDayChart(){
    /* HOOKS */
    const contextData = useContext(data)
    const svgRef = useRef(null)
    const [time, setTime] = useState(null)
    const [json, setJson] = useState(null)
    /* HOOKS */
    /* VARIABLEs */
    const height = 300
    const width = 600   
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
            if(hours.includes(Math.round(arr2[i]['time']))){
                expel.push(Math.round(arr2[i]['time']))
            }
        }
        for(const i in hours){
            if(!expel.includes(hours[i])){
                expel.push(hours[i])
                arr2.push({time: hours[i], value: 0})
            }
        }
        render(arr2, max)
    }   
    function render(params, maxheight){
        const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)
        svg.select('*').remove()
        const x = d3.scaleLinear().range([width, 0]).domain([24, 0])
        const y = d3.scaleLinear().range([height, 0]).domain([0, maxheight])
        const axis = svg.append('g').attr("transform", "translate(" + 70 + "," + 70 + ")")
        /* X-axis */
        axis.append('g')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll(".tick text") 
            .classed("X-Axis", true)
        /* Y-axis */
        axis.append("g")
            .call(d3.axisLeft(y)
            .tickFormat(function(d){return d}).ticks(5))
        /* Line */
        const linePath = svg.append('g')
        const line = d3.line()
            .x((d) => x(d?.time))
            .y((d) => y(d?.value))
        const pathData = line(params)
        linePath.append('path')
            .attr("transform", "translate(" + 70 + "," + 70 + ")")
            .attr('d', pathData)
            .attr('fill', 'none')
            .attr('stroke-width', 3)
            .attr('stroke', 'orange')
    }
    useEffect(()=>{   
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
        if(json) return
        getlogs()
    },[json])

    return (
        <div id="mul2">
            <svg className="w-100 h-100" ref={svgRef}></svg>
        </div>
    )
}