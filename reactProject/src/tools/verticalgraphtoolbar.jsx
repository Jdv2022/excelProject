import { useEffect, useRef, useState, useContext } from 'react'
import { tools } from '../graphs/bargraph_vertical/renderverticalBarGraph'

/* Vertical graph tool bar */
export default function VerticalGraphTool(){

    const handleValue = useContext(tools)
    const inputRef = useRef(null)
    const [rangeY, setRangeY] = useState(10)
    const [radio, setRadio] = useState('Horizontal')
    const [color, setColor] = useState('#F2BE22')
    const [y_label, sety_label] = useState('Amount')
    const [x_label, setx_label] = useState('Fruits')
    const [title, settitle] = useState('XYZ Food Stock Price')
    
    const data = {
        data0: rangeY,
        data1: radio,
        data2: color,
        data3: y_label,
        data4: x_label,
        data5: title
    }

    useEffect(()=>{
        handleValue(data)
    },[color,radio,rangeY, x_label, y_label, title])
    
    function handlerangeY(e){
        setRangeY(e.target.value)
    }

    function handleRadio(e){
        setRadio(e.target.value)
    }

    function handleColor(e){
        setColor(e.target.value)
    }
    function handleTitle(e){
        settitle(e.target.value)
    }
    function handleX(e){
        setx_label(e.target.value)
    }
    function handleY(e){
        sety_label(e.target.value)
    }
    const sideTools = (
        <div id='toolsContainer'>
            <h3>Y-axis</h3>
            <input type="number" defaultValue={10} onChange={handlerangeY}/>
            <h3>X-axis</h3>
            <input className='radio'  value={'rotate(45)'} type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={handleRadio}/>
            <label htmlFor="flexRadioDefault1">45°</label>
            <input className='radio'  value={'Horizontal'} type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={handleRadio}/>
            <label htmlFor="flexRadioDefault2">180°</label>
            <p>Bar Color</p>
            <input type="text" ref={inputRef} defaultValue={'#F2BE22'} onChange={handleColor}></input>
            <p>Title</p>
            <input type="text" ref={inputRef} defaultValue={'XYZ Food Stock Price'} onChange={handleTitle}></input>
            <p>X-label</p>
            <input type="text" ref={inputRef} defaultValue={'Fruits'} onChange={handleX}></input>
            <p>Y-label</p>
            <input type="text" ref={inputRef} defaultValue={'Amount'} onChange={handleY}></input>
        </div>
    )
    return sideTools
}