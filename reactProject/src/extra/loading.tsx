import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useLocation } from 'react-router-dom'

function CircleMove() {
    const Location = useLocation()
    const svgRef = useRef<SVGSVGElement|null>(null)
    const [locX, setLocX] = useState<any>({x1:100,x2:1170})
    const [dir, setDir] = useState<boolean>(true)
    const [text, setText] =useState<any>('Welcome!')

    useEffect(() => {
        if(Location.pathname == '/home'){
            setText('Welcome!')
        }
        else(
            setText('Loading...')
        )
        const svg = d3.select(svgRef.current)

        const circle1 = svg.append('circle')
            .attr('r', 100)

        svg
            .append('text')
            .attr('x',550)
            .attr('y',300)
            .text(text)
            .attr('fill', 'whitesmoke')
            .style('font-size', 50)
            .style('font-weight', 'bold')
            
        function runTime(){
            circle1 
                .transition()
                .duration(4000) // Animation duration in milliseconds
                .attrTween('cx', function() {
                    return function (t:any) {
                        const interpolatedX = locX.x1 + (locX.x2 - locX.x1) * t
                        if(dir && interpolatedX == 1170){
                            setDir(false)
                            setLocX({x1:interpolatedX, x2: 100})
                            circle1.remove()
                        }
                        else if(!dir && interpolatedX == 100){
                            setDir(true)
                            setLocX({x1:interpolatedX, x2: 1170})
                            circle1.remove()
                        }
                        circle1.attr('fill', '#6C757D')
                        return interpolatedX
                      };
                })
                .attrTween('cy', () => d3.interpolateNumber(300, 300))
        }
        runTime()
    }, [locX,Location.pathname])
    return (
        <svg width="1300" height="600" className='user-select-none' ref={svgRef}></svg>
    )
}

export default CircleMove
