import { useContext, useEffect, useRef, useState } from 'react'
import { MyContext } from './App'
import * as d3 from 'd3'
import Api from './worldTourApi'
import Versor from './versor'
import './worldTour.css'

export default function WorldTourD3() {
    const value = useContext(MyContext)
    const svgRef = useRef<SVGSVGElement|null>(null)
    const [data, setData] = useState<any|null>(null)
    let interval: any

    useEffect(() => {
        if(!data){
            fetchData()
        }
        async function fetchData() {
            try {
                console.log('This should be only executed twice!')
                setData(await Api())
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
    }, [data])

    useEffect(() => {   
        if(!data){
            return
        }
        world() 
        function world(){
            console.log('every two seconds')
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

            function render(country: any, arc: any) {
                const name = country.properties.name
                const len = name.length
                const x = (1050 - 8*len) / 2
                svg.selectAll('path').remove()
                svg.select('text').remove()

                svg
                    .append('text')
                    .attr('x', x)
                    .attr('y', 20)
                    .style('font','Sans Serif')
                    .style('font-weight','bold')
                    .text(name);

                svg
                    .append('path')
                    .datum(data.data2)
                    .attr('d', path)
                    .style('fill', '#17594A')
                    .attr('transform', 'translate(50, 50)');

                svg
                    .append('path')
                    .datum(country)
                    .attr('d', path)
                    .style('fill', '#090580')
                    .attr('transform', 'translate(50, 50)');

                svg
                    .append('path')
                    .datum(data.data1)
                    .attr('d', path)
                    .style('stroke', '#fff')
                    .style('stroke-width', 0.5)
                    .style('fill', 'none')
                    .attr('transform', 'translate(50, 50)');

                svg
                    .append('path')
                    .datum(sphere)
                    .attr('d', path)
                    .style('stroke', '#000')
                    .style('stroke-width', 1.5)
                    .style('fill', 'none')
                    .attr('transform', 'translate(50, 50)');

                svg
                    .append('path')
                    .datum(arc)
                    .attr('d', path)
                    .style('stroke', 'white')
                    .style('stroke-width', '2px')
                    .style('fill', 'none')
                    .attr('transform', 'translate(50, 50)');
            }

            interval = setInterval(()=>{
                console.log(count)
                count++
                whereTo(data.data0[count])
                if(data.data0.length == count){
                    count = 0
                }
            }, 4000)

            let p1: any, p2 = [0, 0], r1, r2 = [0, 0, 0]
            async function whereTo(country: any){
                await new Promise((resolve) => {
                    render(country, null)
                    p1 = p2
                    p2 = d3.geoCentroid(country)
                    r1 = r2
                    r2 = [-p2[0], tilt - p2[1], 0]
                    const ip = d3.geoInterpolate(p1, p2)
                    const iv = Versor.interpolateAngles(r1, r2)

                    d3.transition()
                    .duration(2000)
                    .tween('render', () => (t: any) => {
                        projection.rotate(iv(t))
                        render(country, {
                            type: 'LineString',
                            coordinates: [p1, ip(t)],
                        });
                    })
                    .transition()
                    .tween('render', () => (t: any) => {
                        render(country, {
                            type: 'LineString',
                            coordinates: [ip(t), p2],
                        })
                    })
                    .on('end', resolve)
                })
            } 
        }
        

        return () => {
            clearInterval(interval);
        }

    }, [data])

    return (
        <div className="row w-100 align-top">
            <svg className="col-md-10 panel1 align-top" ref={svgRef}></svg>
            <div className="col-md-2 panel align-top">
                <div className='panel3'>

                </div>
            </div>
        </div>
    )
}
