import { useEffect, useState } from 'react'
import PhilippinesMapApi from '../graphs/philippinesMapApi'
/* Ph-region tool */
export default function RegionPhTool({updateData}:any){
    const [candidate_x,setCandidate_x] = useState<any>('Candidate X')
    const [candidate_y,setCandidate_y] = useState<any>('Candidate y')
    const [candidate_z,setCandidate_z] = useState<any>('Candidate z')
    const [geoJson, setGeoJson] = useState<any>(null)
    const [borderColor, setBorderColor] = useState<any>('White')
    const [titleT, setTitle] = useState<any>('Ph Election Result 2053')
    const [colorx, setColor_x] = useState<any>('Blue')
    const [colory, setColor_y] = useState<any>('Green')
    const [colorz, setColor_z] = useState<any>('Red')
    const [pieBorderD, setPieBorder] = useState<any>('black')
    const [pieThickness, setPieThickness] = useState<any>(2)
    const [radius, setRadius] = useState<any>(25)
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

    function candidateX(e:any){
        setCandidate_x(e.target.value)
    }

    function colorX(e:any){
        setColor_x(e.target.value)
    }

    function candidateY(e:any){
        setCandidate_y(e.target.value)
    }

    function colorY(e:any){
        setColor_y(e.target.value)
    }

    function candidateZ(e:any){
        setCandidate_z(e.target.value)
    }

    function colorZ(e:any){
        setColor_z(e.target.value)
    }

    function borderColorHandle(e:any){
        setBorderColor(e.target.value)
    }

    function title(e:any){
        setTitle(e.target.value)
    }

    function pieBorder(e:any){
        setPieBorder(e.target.value)
    }

    function pieThick(e:any){
        setPieThickness(e.target.value)
    }

    function innerRadius(e:any){
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