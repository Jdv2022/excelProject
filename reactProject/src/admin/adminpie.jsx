import { useState, useEffect, useRef } from 'react'
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/get/logtraffic`
import * as d3 from 'd3'

const color = ["steelblue", "green", "red", "orange"]

export default function Adminpie(){
    const svgRef = useRef(null)
    const titleRef =  useRef('Loading')
    const totalRef =  useRef('Loading')
    const totalpRef =  useRef('Loading')
    const [t, setT] = useState(100)
    useEffect(()=>{
        api()
    },[t])
    async function api(){
        try{
            const response = await fetch(endpointUrl, {
                method : 'GET'
            })
            if(response.ok){
                const apiData = await response.text()
                const jsonData = apiData ? await JSON.parse(apiData) : {}
                processData(jsonData.response)
            }
            else {
                throw new Error('Request failed')
            }
        }
        catch(err){
            console.error(err)
        }
    }
    function processData(params){
        let namearr = []
        /* Get all names */
        params.forEach((item) => {
            if(!namearr.includes(item.name)){
                namearr.push(item.name)
            }
        })
        /* segregate data for eacg name */
        let obj = {}
        let temp = []
        let get = 0
        let res = []
        for(const i in namearr){
            params.forEach((item) => {
                const d = new Date(item['created@'])
                const month = d.getMonth()
                const day = d.getDate()
                const yr = d.getFullYear()
                const displayD = month + ' ' + day + ', ' + yr 
                if(item.name == namearr[i]){
                    if(!temp.includes(displayD)){
                        temp.push(displayD)
                        get = get + parseInt(item.count)
                    }
                }
            })
            obj[namearr[i]] = get
            temp = []
            get = 0
        }
        for(const i in obj){
            get = get + obj[i]
            res.push({name: i, value: obj[i]})
        }
        setT(get)
        chart(res)
    }
    function hov(data){
        const titleElement = titleRef.current
        titleElement.textContent = data.data.name
        const totalElement = totalRef.current
        totalElement.textContent = data.data.value
        const totalpElemnt = totalpRef.current
        totalpElemnt.textContent = (((data.data.value)/t)*100).toFixed(2) + '%'
    }
    function unhov(){
        const titleElement = titleRef.current
        titleElement.textContent = 'Overall'
        const totalElement = totalRef.current
        totalElement.textContent = t
        const totalpElemnt = totalpRef.current
        totalpElemnt.textContent = '100%'
    }
    function chart(params){  
        const formatedData = d3.pie().value((d) => d.value)(params)
        const width = 500;
        const height = 450;
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(200)
            const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)
        svg
            .selectAll('*').remove()
        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);
        g.selectAll("path")
            .data(formatedData)
            .join("path")
            .attr("class", "pie") 
            .attr('d', arc)
            .attr("fill", (d, i) => color[i])
            .attr("stroke", "white")
            .on("mouseover", function(event, d, i) {
                hov(d)
            })
            .on("mouseout", function(event, d, i) {
                unhov(d)
            });

    }
    return (
        <div id='mul3'>
            <svg ref={svgRef}></svg>
            <div id='pie_dash'>
                <h2 className='pie_dash_h2' ref={titleRef}></h2>
                <h3 className='pie_dash_h3'>The total number of request in the past 31 days:</h3>
                <p className='pie_dash_p' ref={totalRef}></p>
                <h3 className='pie_dash_h3'>The total percentage of request in the past 31 days:</h3>
                <p className='pie_dash_p' ref={totalpRef}></p>
            </div>
        </div>
    )
}