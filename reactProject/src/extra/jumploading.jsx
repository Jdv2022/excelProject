import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import'./extra.css'

function JumpLoading() {
    const svgRef = useRef(null)
    const [locY, setLocY] = useState({y1:150,y2:50})
    const [locY2, setLocY2] = useState({y1:140,y2:50})
    const [locY3, setLocY3] = useState({y1:130,y2:50})
    const [locY4, setLocY4] = useState({y1:120,y2:50})
    const [locY5, setLocY5] = useState({y1:110,y2:50})
    const [dir1, setDir1] = useState(true)
    const [dir2, setDir2] = useState(true)
    const [dir3, setDir3] = useState(true)
    const [dir4, setDir4] = useState(true)
    const [dir5, setDir5] = useState(true)
    const [t1, setT1] = useState(900)
    const [t2, setT2] = useState(800)
    const [t3, setT3] = useState(700)
    const [t4, setT4] = useState(600)
    const [t5, setT5] = useState(500)
    const color = '#068FFF'
    useEffect(() => {
        const svg = d3.select(svgRef.current)
        const circle1 = svg.append('circle')
            .attr('r', 20)
        circle1 
            .transition()
            .duration(t1) // Animation duration in milliseconds
            .attrTween('cy', function() {
                return function (t) {
                    const interpolatedX = locY.y1 + (locY.y2 - locY.y1) * t
                    if(dir1 && interpolatedX == 50){
                        setT1(800)
                        setDir1(false)
                        setLocY({y1:interpolatedX, y2: 150})
                        circle1.remove()
                    }
                    else if(!dir1 && interpolatedX == 150){
                        setDir1(true)
                        setLocY({y1:interpolatedX, y2: 50})
                        circle1.remove()
                    }
                    circle1.attr('fill', color)
                    return interpolatedX
                    };
            })
            .attrTween('cx', () => d3.interpolateNumber(150, 150))

    }, [locY])

    useEffect(() => {
        const svg = d3.select(svgRef.current)
        const circle2 = svg.append('circle')
            .attr('r', 20)
        circle2
            .transition()
            .duration(t2) // Animation duration in milliseconds
            .attrTween('cy', function() {
                return function (t) {
                    const interpolatedX = locY2.y1 + (locY2.y2 - locY2.y1) * t
                    if(dir2 && interpolatedX == 50){
                        setT2(800)
                        setDir2(false)
                        setLocY2({y1:interpolatedX, y2: 150})
                        circle2.remove()
                    }
                    else if(!dir2 && interpolatedX == 150){
                        setDir2(true)
                        setLocY2({y1:interpolatedX, y2: 50})
                        circle2.remove()
                    }
                    circle2.attr('fill', color)
                    return interpolatedX
                    };
            })
            .attrTween('cx', () => d3.interpolateNumber(200, 200))
    }, [locY2])

    useEffect(() => {
        const svg = d3.select(svgRef.current)
        const circle3 = svg.append('circle')
            .attr('r', 20)
        circle3
            .transition()
            .duration(t3) // Animation duration in milliseconds
            .attrTween('cy', function() {
                return function (t) {
                    const interpolatedX = locY3.y1 + (locY3.y2 - locY3.y1) * t
                    if(dir3 && interpolatedX == 50){
                        setT3(800)
                        setDir3(false)
                        setLocY3({y1:interpolatedX, y2: 150})
                        circle3.remove()
                    }
                    else if(!dir3 && interpolatedX == 150){
                        setDir3(true)
                        setLocY3({y1:interpolatedX, y2: 50})
                        circle3.remove()
                    }
                    circle3.attr('fill', color)
                    return interpolatedX
                };
            })
            .attrTween('cx', () => d3.interpolateNumber(250, 250))
    }, [locY3])

    useEffect(() => {
        const svg = d3.select(svgRef.current)
        const circle4 = svg.append('circle')
            .attr('r', 20)
        circle4
            .transition()
            .duration(t4) // Animation duration in milliseconds
            .attrTween('cy', function() {
                return function (t) {
                    const interpolatedX = locY4.y1 + (locY4.y2 - locY4.y1) * t
                    if(dir4 && interpolatedX == 50){
                        setT4(800)
                        setDir4(false)
                        setLocY4({y1:interpolatedX, y2: 150})
                        circle4.remove()
                    }
                    else if(!dir4 && interpolatedX == 150){
                        setDir4(true)
                        setLocY4({y1:interpolatedX, y2: 50})
                        circle4.remove()
                    }
                    circle4.attr('fill', color)
                    return interpolatedX
                };
            })
            .attrTween('cx', () => d3.interpolateNumber(300, 300))
    }, [locY4])


    useEffect(() => {
        const svg = d3.select(svgRef.current)
        const circle5 = svg.append('circle')
            .attr('r', 20)
        circle5
            .transition()
            .duration(t5) // Animation duration in milliseconds
            .attrTween('cy', function() {
                return function (t) {
                    const interpolatedX = locY5.y1 + (locY5.y2 - locY5.y1) * t
                    if(dir5 && interpolatedX == 50){
                        setDir5(false)
                        setLocY5({y1:interpolatedX, y2: 150})
                        circle5.remove()
                        setT5(800)
                    }
                    else if(!dir5 && interpolatedX == 150){
                        setDir5(true)
                        setLocY5({y1:interpolatedX, y2: 50})
                        circle5.remove()
                    }
                    circle5.attr('fill', color)
                    return interpolatedX
                };
            })
            .attrTween('cx', () => d3.interpolateNumber(350, 350))
    }, [locY5])

    return (
        <svg width="500" height="200" className='backgroundColor user-select-none' ref={svgRef}></svg>
    )
}

export default JumpLoading

