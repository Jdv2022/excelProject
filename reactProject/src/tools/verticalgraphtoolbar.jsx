import { useEffect, useRef, useState } from 'react'
/* Vertical graph tool bar */
export default function VerticalGraphTool({upDateData}){
    const inputRef = useRef(null)
    const [rangeY, setRangeY] = useState(10)
    const [radio, setRadio] = useState('Horizontal')
    const [color, setColor] = useState('#F2BE22')
    const data = {
        data0: rangeY,
        data1: radio,
        data2: color
    }
    useEffect(()=>{
        upDateData(data)
    },[color,radio,rangeY])
    
    function handlerangeY(e){
        setRangeY(e.target.value)
    }

    function handleRadio(e){
        setRadio(e.target.value)
    }

    function handleColor(){
        if (inputRef.current) {
            setColor(inputRef.current.value)
        }
    }
    const sideTools = (
        <div className='d-inline-block rightbar'>
            <div className='y-panel'>
                <p className='margin-top'>Y-axis</p>
                <div className="form-outline">
                    <input type="number" defaultValue={10} className="form-control" onChange={handlerangeY}/>
                </div>
                <p className='margin-top'>X-axis</p>
                <div className="form-check">
                    <input className="form-check-input" value={'rotate(45)'} type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={handleRadio}/>
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                        45°
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" value={'Horizontal'} type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={handleRadio}/>
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                        Horizontal
                    </label>
                </div>
                <p className='margin-top'>Bar Color</p>
                <div>
                    <input className="form-control form-control-sm" type="text" placeholder="Color" ref={inputRef} defaultValue={'#F2BE22'}></input>
                    <input className="form-control form-control-sm bg-primary text-light mt-2" type="button" value="Update Color" onClick={handleColor}></input>
                </div>
            </div>
        </div>
    )
    return sideTools
}