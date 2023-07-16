import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import Api from './worldTourApi'
import Versor from './versor'
import './worldTour.css'
import { createContext } from 'react'
import Widget from './widget'
import Widget2 from './widget2'
import JumpLoading from '../extra/jumploading'
import NotYet from '../notYetAvailable'

export const MyWidget = createContext('')
/*  World in the landing page render */
export default function WorldTourD3() {
    const svgRef = useRef(null)
    const [data, setData] = useState(null)
    const [widgetData, setWidgetData] = useState(null)
    const [renderMainWorld, setRenderMainWorld] = useState(false)
    const [screenWidth, setScreenWidth] = useState(null)
    const nextCountryCallInterval = 5000
    let interval
    useEffect(() => {
        if(!data){
            fetchData()
        }
        async function fetchData() {
            try {
                setData(await Api())
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
    }, [])
    useEffect(() => {   
        function logScreenSize() {
            const screenWidth = window.innerWidth;
            setScreenWidth(screenWidth)
        }
        window.addEventListener("resize", logScreenSize);
        if(!data){
            return
        }
        world() 
        function world(){
            const sphere = { type: 'Sphere' }
            const width = 940
            const height = 640
            const tilt = 20
            let count = 0
            const svg = d3.select(svgRef.current)
            const projection = d3
                .geoOrthographic()
                .fitExtent([[10, 10], [width - 10, height - 10]], sphere)
            const path = d3.geoPath(projection)
            function render(country, arc) {
                svg.selectAll('*').remove()
                svg.selectAll('path')
                    .style('position', 'absolute')
                    .style('z-index', '-1');
                //countries color
                svg 
                    .append('path')
                    .datum(data.data2)
                    .attr('d', path)
                    .style('fill', '#367E18')
                    .attr('transform', 'translate(50, 50)')
                //next country 
                svg
                    .append('path')
                    .datum(country)
                    .attr('d', path)
                    .style('fill', '#FA9884')
                    .attr('transform', 'translate(50, 50)')
                //country border
                svg
                    .append('path')
                    .datum(data.data1)
                    .attr('d', path)
                    .style('stroke', '#17594A')
                    .style('stroke-width',1)
                    .style('fill', 'none')
                    .attr('transform', 'translate(50, 50)')
                //earth border
                svg
                    .append('path')
                    .datum(sphere)
                    .attr('d', path)
                    .style('stroke', 'rgb(0, 255, 209)')
                    .style('stroke-width', .5)
                    .style('fill', 'none')
                    .attr('transform', 'translate(50, 50)')
                //arc path
                svg
                    .append('path')
                    .datum(arc)
                    .attr('d', path)
                    .style('stroke', 'white')
                    .style('stroke-width', '2px')
                    .style('fill', 'none')
                    .attr('transform', 'translate(50, 50)')
            }
            function mainCall(){
                setRenderMainWorld(true)
                const numberOfCountries = 177
                const random = Math.ceil(Math.random()*numberOfCountries)
                const theData = data.data0[random]
                count++
                if(theData && theData.population){
                    setWidgetData(theData.population)
                }
                else{
                    setWidgetData(null)
                }
                whereTo(theData)
                if(data.data0.length == count){
                    count = 0
                }
            }
            interval = setInterval(()=>{
                mainCall()
            }, nextCountryCallInterval)
            let p1, p2 = [0, 0], r1, r2 = [0, 0, 0]
            async function whereTo(country){
                await new Promise((resolve) => {
                    render(country, null)
                    p1 = p2
                    p2 = d3.geoCentroid(country)
                    r1 = r2
                    r2 = [-p2[0], tilt - p2[1], 0]
                    const ip = d3.geoInterpolate(p1, p2)
                    const iv = Versor.interpolateAngles(r1, r2)
                    d3
                        .transition()
                        .duration(2000)
                        .tween('render', () => (t) => {
                            projection.rotate(iv(t))
                            render(country, {
                                type: 'LineString',
                                coordinates: [p1, ip(t)],
                            });
                        })
                        .transition()
                        .tween('render', () => (t) => {
                            render(country, {
                                type: 'LineString',
                                coordinates: [ip(t), p2],
                            });
                        })
                        .on('end', resolve)
                })
            } 
        }
        return () => {
            clearInterval(interval)
        }
    }, [data, renderMainWorld])
    if(screenWidth && screenWidth < 972) return <div><NotYet/></div>
    return (
        <div className="landingPage align-top w-100">
            <div className='d-inline-block col-md-7 align-top'>
                {renderMainWorld ? <svg id='svg' className='vh-100 w-100 world' ref={svgRef}></svg>: <div className='jumpLoading'><JumpLoading/></div>}
                {renderMainWorld ? <div className='sea'></div> : <></>}
                <MyWidget.Provider value={widgetData}>
                    <div className='widget'>
                        <Widget />
                    </div>
                    <div className='widget2'>
                        <Widget2 />
                    </div>
                </MyWidget.Provider>
            </div>
            <div className='d-inline-block col-md-5 content vh-100'>
                <h1 id='landingPagehead'>Convert Excel/CSV into Stunning Graphs</h1>
                <p>Introducing our powerful and user-friendly tool that transforms your Excel data into visually appealing and interactive graphs in just a few clicks.</p>
                <p>Benefits:</p>
                <ul>
                    <li>Save time and effort by automating the graph creation process</li>
                    <li>Create professional-looking graphs without the need for advanced design skills</li>
                    <li>Customize and visualize your data in a variety of graph types</li>
                    <li>Effortlessly share and export your graphs for presentations or reports</li>
                </ul>
                <a href='/home' id='button' className='bg-primary mt-5'>Get started!</a>
            </div>
        </div>
    )
}
