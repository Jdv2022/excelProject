import { useEffect, useState, useContext } from 'react'
import { tools } from '../graphs/ph_province/philippinesMap'
import { toolsRegion } from '../graphs/ph_region/phRegion'
import { useLocation } from 'react-router-dom'
/* 
    Docu: Toolbar for philippinesmap.jsx and phRegion.jsx
*/
export default function PhTool(){
    const [maxUpD, setMaxUp] = useState(7)
    const [maxC, setMaxD] = useState('Red')
    const [midMaxD, setMidMax] = useState(6)
    const [midMinD, setMidMin] = useState(4)
    const [midC, setMidD] = useState('Orange')
    const [bgD, setBg] = useState('#69b3a2')
    const [minC, setMinColor] = useState('Green')
    const [minD, setMin] = useState(0)
    const [borderColor, setBorderColor] = useState('White')
    const [titleT, setTitle] = useState('XYZ Foods Stock Price Index')
    const location = useLocation()
    const handlevalue = useContext(tools)
    const handlevalue2 = useContext(toolsRegion)
    const res = {
        borderC: borderColor,
        maxColor: maxC,
        midColor: midC,
        minColor: minC,
        bg: bgD,
        max: maxUpD,
        maxMid: midMaxD,
        minMid: midMinD,
        min: minD,
        titleD: titleT
    }
    useEffect(()=>{
        if(location.pathname == '/home/choroplethmap(ph-region)'){
            handlevalue2(res)
        }
        else if(location.pathname == '/home/choroplethmap(ph-provinces)'){
            handlevalue(res)
        }
    },[maxUpD, maxC, midMaxD, midMinD, midC, bgD, minC, minD, borderColor, titleT])

    function maxUp(e){
        setMaxUp(e.target.value)
    }

    function maxCo(e){
        setMaxD(e.target.value)
    }

    function midMax(e){
        setMidMax(e.target.value)
    }

    function midMin(e){
        setMidMin(e.target.value)
    }

    function midCo(e){
        setMidD(e.target.value)
    }

    function min(e){
        setMin(e.target.value)
    }

    function minCo(e){
        setMinColor(e.target.value)
    }

    function bgC(e){
        setBg(e.target.value)
    }

    function borderColorHandle(e){
        setBorderColor(e.target.value)
    }

    function title(e){
        setTitle(e.target.value)
    }

    const sideTools = (
        <div id='toolsContainer'>
            <h3>Range</h3>
            <p>Maximum</p>
            <input type="number" placeholder='Max up' defaultValue={7} onChange={maxUp}/>
            <input type="text" placeholder="Color" defaultValue={'Red'} onChange={maxCo} />
            <p>Middle</p>
            <input type="number" placeholder='Mid. max' defaultValue={6} onChange={midMax}/>
            <input type="number" placeholder='Mid. min' defaultValue={4} onChange={midMin}/>
            <input type="text" placeholder="Color" defaultValue={'Orange'} onChange={midCo} />
            <p>Minimum</p>
            <input type="number" placeholder='Min' defaultValue={0} onChange={min}/>
            <input type="text" placeholder="Color" defaultValue={'Green'} onChange={minCo} />
            <p>No Data</p>
            <input type="text" placeholder="Color" defaultValue={'#69b3a2'} onChange={bgC} />
            <p>Border Color</p>
            <input type="text" placeholder="Color" defaultValue={'White'} onChange={borderColorHandle} />
            <p>Title</p>
            <input type="text" placeholder="Title" defaultValue={'XYZ Foods Stock Price Index'} onChange={title} />
        </div>
    )

    return sideTools

}