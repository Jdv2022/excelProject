import { useEffect, useRef, useState, useContext } from 'react'
import { tools } from '../graphs/linechart/linechart'

export default function LineTool(){

    const handlevalue = useContext(tools)
    const [lwidth, setLiWidth] = useState(1.5)
    const [lcolor, setLColor] = useState('SteelBlue')
    const [titleT, setTitle] = useState('XYZ Sales')
    const [ticksx, setTicksX] = useState(4)
    const [ticksy, setTicksY] = useState(10)
    const [xlabel, setXlabel] = useState('Dates')
    const [ylabel, setYlabel] = useState('Amount')
    const [fill, setFill] = useState(false)
    const [mode, setMode] = useState(false)

    const res = {
        lwidth: lwidth,
        lcolor: lcolor,
        titleT: titleT,
        ticksx: ticksx,
        ticksy: ticksy,
        xlabel: xlabel,
        ylabel: ylabel,
        fill: fill,
        mode: mode
    }

    useEffect(()=>{
        handlevalue(res)
    },[lwidth, lcolor, ticksx, ticksy, xlabel, ylabel, fill, titleT, mode])

    function handleLWidth(e){
        setLiWidth(e.target.value)
    }

    function lcoloro(e){
        setLColor(e.target.value)
    }

    function handleX(e){
        setTicksX(e.target.value)
    }

    function handleY(e){
        setTicksY(e.target.value)
    }

    function handleTitle(e){
        setTitle(e.target.value)
    }

    function handleXlabel(e){
        setXlabel(e.target.value)
    }

    function handleYlabel(e){
        setYlabel(e.target.value)
    }

    function handlefill(e){
        setFill(e.target.checked)
    }

    function handlemode(e){
        setMode(e.target.checked)
    }

    const sideTools = (
        <div id='toolsContainer'>
            <p>Line-Width</p>
            <input type="number" placeholder='Line-Width' defaultValue={1.5} onChange={handleLWidth} />
            <input type="text" placeholder="Color" defaultValue={'SteelBlue'} onChange={lcoloro} />
            <p>Ticks X & Y</p>
            <input type="number" placeholder='Ticks X' defaultValue={4} onChange={handleX}/>
            <input type="number" placeholder='Ticks Y' defaultValue={10} onChange={handleY}/>
            <p>Title</p>
            <input type="text" placeholder="Title" defaultValue={'XYZ Sales'} onChange={handleTitle} />
            <p>X-Label</p>
            <input type="text" placeholder="X-label" defaultValue={'Dates'} onChange={handleXlabel} />
            <p>Y-Label</p>
            <input type="text" placeholder="Y-label" defaultValue={'Amount'} onChange={handleYlabel} />
            <p>Fill</p>
            <input className='checkbox' type="checkbox" onChange={handlefill} />
            <p>Dark Mode</p>
            <input className='checkbox' type="checkbox" onChange={handlemode} />
        </div>
    )

    return sideTools
}