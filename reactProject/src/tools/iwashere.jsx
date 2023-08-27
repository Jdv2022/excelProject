import { useEffect, useContext, useState } from "react"
import { tools } from "../graphs/iwashere/iwahere"

/* 
    Docu: Tool bar for iwashere.jsx
*/
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
        console.log(e.target.value)
        setRadio(e.target.value)
    }

    const sideTools = (
        <div id='toolsContainer' className="iwashereTool">
            <h5>Select choices here then click map.</h5>     
            <div>
                <input value={'red'} type="radio" name="flexRadioDefault" id="flexRadioDefault1" onClick={handleRadio}/>
                <label htmlFor="flexRadioDefault1">Settled</label>
            </div>
            <div className="iwashere">
                <input value={'yellow'} type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={handleRadio}/>
                <label htmlFor="flexRadioDefault2">Visited</label>
            </div>
            <div className="iwashere">
                <input value={'blue'} type="radio" name="flexRadioDefault" id="flexRadioDefault3" onClick={handleRadio}/>
                <label htmlFor="flexRadioDefault3">Explored</label>
            </div>
        </div>
    )

    return sideTools

}