import { useEffect, useContext, useState } from "react"
import { tools } from "../graphs/iwashere/iwahere"

/* ph-province tool bar */
export default function IwasHereTool(){

    const handleValue = useContext(tools)
    const [radio, setRadio] = useState(null)

    const data = {  
        radio: radio,
    }

    useEffect(()=>{
        handleValue(data)
    },[radio])

    function handleRadio(e){
        setRadio(e.target.value)
    }

    const sideTools = (
        <div id='toolsContainer' className='inlineBlock vat'>
            <h5 id="iwasheretool">Select choices here then click map.</h5>     
            <div className="iwashere">
                <input className="inlineBlock vat width_50" value={'red'} type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={handleRadio}/>
                <label className="inlineBlock vat width_50 mt_5" htmlFor="flexRadioDefault1">Settled</label>
            </div>
            <div className="iwashere">
                <input className="inlineBlock vat width_50" value={'yellow'} type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={handleRadio}/>
                <label className="inlineBlock vat width_50 mt_5" htmlFor="flexRadioDefault2">Visited</label>
            </div>
            <div className="iwashere">
                <input className="inlineBlock vat width_50" value={'blue'} type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={handleRadio}/>
                <label className="inlineBlock vat width_50 mt_5" htmlFor="flexRadioDefault2">Explored</label>
            </div>
        </div>
    )

    return sideTools

}