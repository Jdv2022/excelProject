import { useEffect, useState, useContext } from 'react'
import { tools } from '../graphs/horizontalbar/improvedhorizontal'

export default function ImpHorizontalBarTool(){

    const handlevalue = useContext(tools)
    const [asc, setAsc] = useState(false)
    const [titleT, setTitle] = useState('GDP')
    const [xlabel, setXlabel] = useState('Dates')
    const [mode, setMode] = useState(false)

    const res = {
        asc: asc,
        titleT: titleT,
        xlabel: xlabel,
        mode: mode
    }

    useEffect(()=>{
        handlevalue(res)
    },[asc, titleT, xlabel, mode])

    function handleRadio(e){
        setAsc(e.target.value)
    }

    function handleTitle(e){
        setTitle(e.target.value)
    }

    function handleXlabel(e){
        setXlabel(e.target.value)
    }
    
    function handleMode(e){
        setMode(e.target.checked)
    }
   
    const sideTools = (
        <div id='toolsContainer'>
            <p>Title</p>
            <input type="text" placeholder="Title" defaultValue={'GDP'} onChange={handleTitle} />
            <p>X-Label</p>
            <input type="text" placeholder="X-label" defaultValue={'Dates'} onChange={handleXlabel} />
            <p>Order</p>
            <label>
                <input className='radio' value={'asc'} type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={handleRadio}/>
                Ascending
            </label>
            <label>
                <input className='radio' value={'dsc'} type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={handleRadio}/>
                Descending
            </label>
            <label>
                <input className='radio' value={'nrm'} type="radio" name="flexRadioDefault" id="flexRadioDefault3" onClick={handleRadio}/>
                Normal
            </label>
            <p>Dark Mode</p>
            <input className='checkbox' type="checkbox" onChange={handleMode} />
        </div>
    )

    return sideTools
}