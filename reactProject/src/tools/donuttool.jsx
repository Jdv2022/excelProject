import { useEffect, useRef, useState, useContext } from 'react'
import { tools } from '../graphs/piechart/donut'
import './verticalTool.css'

export default function DonutChart(){

    const handlevalue = useContext(tools)
    const [lcolor, setLColor] = useState('white')
    const [title, setTitle] = useState('XYZ Sales')
    const [label, setLabel] = useState(false)
    const [r, setR] = useState(100)

    const res = {
        title: title,
        label: label,
        color: lcolor,
        r:r,
    }

    useEffect(()=>{
        handlevalue(res)
    },[title, label, lcolor, r])

    function handlTitle(e){
        setTitle(e.target.value)
    }
    function handleRadio(e){
        setLabel(e.target.checked)
    }
    function handlecolor(e){
        setLColor(e.target.value)
    }
    function handleInnerR(e){
        setR(e.target.value)
    }
    const sideTools = (
        <div id='toolsContainer' className='inlineBlock vat'>
            <div id="horizontal_tool">
                <p>Line-Width</p>
                <input type="text" placeholder='Line-Width' defaultValue={'XYZ Sales'} onChange={handlTitle} />
                <p>Percent</p>
                <input className="inlineBlock vat width_50 rad" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1" onClick={handleRadio}/>
                <label className="inlineBlock vat width_50 mt_5 w_70pr p_10px" htmlFor="flexRadioDefault1">Pie Label</label>
                <input type="text" placeholder='Line-Width' defaultValue={'white'} onChange={handlecolor} />
                <p>Inner Radius</p>
                <input className="inlineBlock vat width_50" type="number" defaultValue={100} onClick={handleInnerR}/>
            </div>
        </div>
    )

    return sideTools
}