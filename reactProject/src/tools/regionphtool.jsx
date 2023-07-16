import { useEffect, useState } from 'react'
import PhilippinesMapApi from '../graphs/philippinesMapApi'
/* Ph-region tool */
export default function RegionPhTool({updateData}){
    const [candidate_x,setCandidate_x] = useState('Candidate X')
    const [candidate_y,setCandidate_y] = useState('Candidate y')
    const [candidate_z,setCandidate_z] = useState('Candidate z')
    const [geoJson, setGeoJson] = useState(null)
    const [borderColor, setBorderColor] = useState('White')
    const [titleT, setTitle] = useState('Ph Election Result 2053')
    const [colorx, setColor_x] = useState('Blue')
    const [colory, setColor_y] = useState('Green')
    const [colorz, setColor_z] = useState('Red')
    const [pieBorderD, setPieBorder] = useState('black')
    const [pieThickness, setPieThickness] = useState(2)
    const [radius, setRadius] = useState(25)
    const data = {
        borderC: borderColor,
        orig: geoJson,
        cand: [candidate_x,candidate_y,candidate_z],
        titleD: titleT,
        col: [colorx,colory,colorz],
        pieBorder: pieBorderD,
        tPie: pieThickness,
        pieR: radius
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
    },[geoJson, borderColor, titleT, candidate_x, candidate_y, candidate_z, colorx,colory,colorz,pieBorderD,pieThickness,radius])

    function candidateX(e){
        setCandidate_x(e.target.value)
    }

    function colorX(e){
        setColor_x(e.target.value)
    }

    function candidateY(e){
        setCandidate_y(e.target.value)
    }

    function colorY(e){
        setColor_y(e.target.value)
    }

    function candidateZ(e){
        setCandidate_z(e.target.value)
    }

    function colorZ(e){
        setColor_z(e.target.value)
    }

    function borderColorHandle(e){
        setBorderColor(e.target.value)
    }

    function title(e){
        setTitle(e.target.value)
    }

    function pieBorder(e){
        setPieBorder(e.target.value)
    }

    function pieThick(e){
        setPieThickness(e.target.value)
    }

    function innerRadius(e){
        setRadius(e.target.value)
    }

    const sideTools = (
        <div className='d-inline-block rightbar'>
            <div className='y-panel'>
                <div className="form-outline">
                    <p className='m-0 mt-3'>Text A</p>
                    <input className="form-control form-control-sm" type="text" placeholder="Title" defaultValue={'Candidate X'} onChange={candidateX} />
                    <input className="form-control form-control-sm" type="text" placeholder="Title" defaultValue={'Blue'} onChange={colorX} />
                    <p className='m-0 mt-3'>Text B</p>
                    <input className="form-control form-control-sm" type="text" placeholder="Title" defaultValue={'Candidate Y'} onChange={candidateY} />
                    <input className="form-control form-control-sm" type="text" placeholder="Title" defaultValue={'Green'} onChange={colorY} />
                    <p className='m-0 mt-3'>Text C</p>
                    <input className="form-control form-control-sm" type="text" placeholder="Title" defaultValue={'Candidate Z'} onChange={candidateZ} />
                    <input className="form-control form-control-sm" type="text" placeholder="Title" defaultValue={'Red'} onChange={colorZ} />
                    <p className='m-0 mt-3'>Pie Border</p>
                    <input className="form-control form-control-sm" type="text" placeholder="Color" defaultValue={'black'} onChange={pieBorder} />
                    <input type="number" className="form-control" placeholder='Mid. min' defaultValue={2} onChange={pieThick}/>
                    <input type="number" className="form-control" placeholder='Mid. min' defaultValue={25} onChange={innerRadius}/>
                    <p className='m-0 mt-3'>Border Color</p>
                    <input className="form-control form-control-sm" type="text" placeholder="Color" defaultValue={'White'} onChange={borderColorHandle} />
                    <p className='m-0 mt-3'>Title</p>
                    <input className="form-control form-control-sm" type="text" placeholder="Title" defaultValue={'Ph Election Result 2053'} onChange={title} />
                </div>
            </div>
        </div>
    )

    return sideTools

}