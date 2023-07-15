import { useEffect, useState } from 'react'
import PhilippinesMapApi from '../graphs/philippinesMapApi'
/* ph-province tool bar */
export default function PhTool({updateData}:any){
    const [maxUpD, setMaxUp] = useState(7)
    const [maxC, setMaxD] = useState('Red')
    const [midMaxD, setMidMax] = useState(6)
    const [midMinD, setMidMin] = useState(4)
    const [midC, setMidD] = useState('Orange')
    const [bgD, setBg] = useState('#69b3a2')
    const [minC, setMinColor] = useState('Green')
    const [minD, setMin] = useState(0)
    const [geoJson, setGeoJson] = useState<any>(null)
    const [borderColor, setBorderColor] = useState<any>('White')
    const [titleT, setTitle] = useState<any>('XYZ Foods Stock Price Index')
    const data = {
        borderC: borderColor,
        maxColor: maxC,
        midColor: midC,
        minColor: minC,
        bg: bgD,
        orig: geoJson,
        max: maxUpD,
        maxMid: midMaxD,
        minMid: midMinD,
        min: minD,
        titleD: titleT
    }
    useEffect(()=>{
        async function phMapData(){
            const data = await PhilippinesMapApi()
            setGeoJson(data) 
        }
        if(!geoJson){
            phMapData()
        }
        updateData(data)
    },[maxUpD, maxC, midMaxD, midMinD, midC, bgD, minC, minD, geoJson, borderColor, titleT])

    function maxUp(e:any){
        setMaxUp(e.target.value)
    }

    function maxCo(e:any){
        setMaxD(e.target.value)
    }

    function midMax(e:any){
        setMidMax(e.target.value)
    }

    function midMin(e:any){
        setMidMin(e.target.value)
    }

    function midCo(e:any){
        setMidD(e.target.value)
    }

    function min(e:any){
        setMin(e.target.value)
    }

    function minCo(e:any){
        setMinColor(e.target.value)
    }

    function bgC(e:any){
        setBg(e.target.value)
    }

    function borderColorHandle(e:any){
        setBorderColor(e.target.value)
    }

    function title(e:any){
        setTitle(e.target.value)
    }

    const sideTools = (
        <div className='d-inline-block rightbar'>
            <div className='y-panel'>
                <p className='mt-1'>Range</p>
                <div className="form-outline">
                    <p className='m-0'>Minimum Max.</p>
                    <input type="number" className="form-control" placeholder='Max up' defaultValue={7} onChange={maxUp}/>
                    <input className="form-control form-control-sm" type="text" placeholder="Color" defaultValue={'Red'} onChange={maxCo} />
                    <p className='m-0 mt-3'>Middle</p>
                    <input type="number" className="form-control" placeholder='Mid. max' defaultValue={6} onChange={midMax}/>
                    <input type="number" className="form-control" placeholder='Mid. min' defaultValue={4} onChange={midMin}/>
                    <input className="form-control form-control-sm" type="text" placeholder="Color" defaultValue={'Orange'} onChange={midCo} />
                    <p className='m-0 mt-3'>Minimum</p>
                    <input type="number" className="form-control" placeholder='Min' defaultValue={0} onChange={min}/>
                    <input className="form-control form-control-sm" type="text" placeholder="Color" defaultValue={'Green'} onChange={minCo} />
                    <p className='m-0 mt-3'>No Data</p>
                    <input className="form-control form-control-sm" type="text" placeholder="Color" defaultValue={'#69b3a2'} onChange={bgC} />
                    <p className='m-0 mt-3'>Border Color</p>
                    <input className="form-control form-control-sm" type="text" placeholder="Color" defaultValue={'White'} onChange={borderColorHandle} />
                    <p className='m-0 mt-3'>Title</p>
                    <input className="form-control form-control-sm" type="text" placeholder="Title" defaultValue={'XYZ Foods Stock Price Index'} onChange={title} />
                </div>
            </div>
        </div>
    )

    return sideTools

}