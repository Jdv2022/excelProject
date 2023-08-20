import { useEffect, useRef, useState, useContext } from 'react'
import { tools } from '../graphs/horizontalbar/horizontalbar'
import './verticalTool.css'

export default function HorizontalBarTool(){

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
        <div id='toolsContainer' className='inlineBlock vat'>
            <div id="horizontal_tool">
                <p>Title</p>
                <input type="text" placeholder="Title" defaultValue={'GDP'} onChange={handleTitle} />
                <p>X-Label</p>
                <input type="text" placeholder="X-label" defaultValue={'Dates'} onChange={handleXlabel} />
                <p>Order</p>
                <input className="inlineBlock vat width_50 rad" value={'asc'} type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={handleRadio}/>
                <label className="inlineBlock vat width_50 mt_5 w_70pr p_10px" htmlFor="flexRadioDefault1">Ascending</label>
                <input className="inlineBlock vat width_50 rad" value={'dsc'} type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={handleRadio}/>
                <label className="inlineBlock vat width_50 mt_5 w_70pr p_10px" htmlFor="flexRadioDefault2">Descending</label>
                <input className="inlineBlock vat width_50 rad" value={'nrm'} type="radio" name="flexRadioDefault" id="flexRadioDefault3" onClick={handleRadio}/>
                <label className="inlineBlock vat width_50 mt_5 w_70pr p_10px" htmlFor="flexRadioDefault3">Normal</label>
                <p>Dark Mode</p>
                <input type="checkbox" className="rad" onChange={handleMode} />
            </div>
        </div>
    )

    return sideTools
}