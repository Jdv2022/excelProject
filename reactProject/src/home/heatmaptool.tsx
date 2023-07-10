import { useEffect, useState } from 'react'
import HeatMapData from '../sampleData/heatmap'
/* ph-province tool bar */
export default function HeatMapTool({updateData}:any){

    const original: any = HeatMapData()
    const [XY, setXY] = useState<any>(<></>)
    const [editValue, setEditValue] = useState<any>(null)
    const [coor, setCoor] = useState(false)
    const [high, setHigh] = useState(false)
    const [normal, setNormal] = useState(false)
    const [low, setLow] = useState(false)
    const [arr, setArr] = useState<any[]>([])
    const [up, setUp] = useState<any>(null)
    const [isDisabled, setIsDisabled] = useState(true)

    useEffect(()=>{
        if(original){
            operation(original)
        }
        function operation(obj:any){SVGAnimatedBoolean
            let x1; let y1; let x2; let y2; let ul; let ur; let bl; let br
            let orig:any = []
            for(let k=0; k<=600; k=k+100){
                for(let i=0; i<=1200; i=i+100){
                    x1 = obj[`x${i}`]
                    y1 = obj[`y${k}`]
                    x2 = obj[`x${i+100}`]
                    y2 = obj[`y${k+100}`]
                    ul = obj[`${y1}${x1}`]
                    ur = obj[`${y1}${x2}`]
                    bl = obj[`${y2}${x1}`]
                    br = obj[`${y2}${x2}`]
                    orig.push({x:x1, y:y1, val: ul})
                }
            }
            setUp(orig)
            setXY(
                <>
                    {orig.map((item:any, i:any) => (
                        <div className='heatmap2 mb-1' key={i}>
                            <input type="number" className="heatmap2" placeholder='NaN' key={`${item.x}a`} defaultValue={item.x} disabled />
                            <input type="number" className="heatmap2" placeholder='NaN' key={`${item.y}b`} defaultValue={item.y} disabled />
                            <input type="number" className="heatmap2" placeholder='NaN' key={`${item.x}${item.y}${item.val}`} defaultValue={item.val} onChange={(e:any)=>handleEditedData({data0:`${item.y}${item.x}`, data1:e.target.value})} />
                        </div>
                    ))}
                </>
            )
            function handleEditedData(params:any){
                obj[`${params.data0}`] = parseInt(params.data1)
                setEditValue(obj)
            }
        }
        updateData({data0: arr, data1: up, data2: {coor: coor, high: high, normal: normal, low: low}})
    },[editValue, coor, high, normal, low, isDisabled])


    function editedData(){
        if(!original)return
        setIsDisabled(false)
        const obj = original
        let x1; let y1; let x2; let y2; let ul; let ur; let bl; let br
        let arr = []
        let orig:any = []
        for(let k=0; k<=600; k=k+100){
            for(let i=0; i<=1200; i=i+100){
                x1 = obj[`x${i}`]
                y1 = obj[`y${k}`]
                x2 = obj[`x${i+100}`]
                y2 = obj[`y${k+100}`]
                if(editValue && (editValue[`${y1}${x1}`] || editValue[`${y1}${x2}`] || editValue[`${y2}${x1}`] || editValue[`${y2}${x2}`])){
                    ul = editValue[`${y1}${x1}`]
                    ur = editValue[`${y1}${x2}`]
                    bl = editValue[`${y2}${x1}`]
                    br = editValue[`${y2}${x2}`]
                }
                else{
                    ul = obj[`${y1}${x1}`]
                    ur = obj[`${y1}${x2}`]
                    bl = obj[`${y2}${x1}`]
                    br = obj[`${y2}${x2}`]
                }
                orig.push({x:x1, y:y1, val: ul})
                for(let j=k; j<=k+99; j=j+20){
                    for(let m=i; m<=i+99; m=m+20){
                        const u:number = (m - x1) / (x2 - x1)
                        const v:number = (j - y1) / (y2 - y1)
                        const value = (1 - u)*(1 - v) * ul + u*(1 - v) * ur + (1 - u)*v * bl + u*v * br
                        const obj = {x:m, y:j, val: value}
                        arr.push(obj)
                    }
                }
            }
        }
        setArr(arr)
        setUp(orig)
        updateData({data0: arr, data1: up, data2: {coor: coor, high: high, normal: normal, low: low}})
    }

    function handlePoints(e:any){
        setCoor(e.target.checked)
    }

    function handleHigh(e:any){
        setHigh(e.target.checked)
    }

    function handleNormal(e:any){
        setNormal(e.target.checked)
    }

    function handleLow(e:any){
        setLow(e.target.checked)
    }
    
    return (
        <div className='d-inline-block rightbar'>
            <div className='y-panel'>
                <p className='m-0'>{`X, Y, Value and Show Location`}</p>
                <div className='overflow-auto border-1 heatmap'>
                    {XY}
                </div>
                <input type='button' value='Update Graph' className='mt-2 w-100 bg-primary text-light' onClick = {editedData}/>
                <div className='mb-0 mt-3'>
                    <p className='m-0'>Filter</p>
                    <span className='d-block'>
                        <input className="form-check-input" type="checkbox" id="Coordinates" onChange={handlePoints}/>
                        <label className="form-check-label margin-3" htmlFor="Coordinates">Coordinates</label>
                    </span>
                    <span className='d-block'>
                        <input disabled={isDisabled} className="form-check-input" type="checkbox" id="High" onChange={handleHigh}/>
                        <label className="form-check-label margin-3" htmlFor="High">High</label>
                    </span>
                    <span className='d-block'>
                        <input disabled={isDisabled} className="form-check-input" type="checkbox" id="Normal" onChange={handleNormal}/>
                        <label className="form-check-label margin-3" htmlFor="Normal">Normal</label>
                    </span>
                    <span className='d-block'>
                        <input disabled={isDisabled} className="form-check-input" type="checkbox" id="Low" onChange={handleLow}/>
                        <label className="form-check-label margin-3" htmlFor="Low">Low</label>
                    </span>
                </div>
            </div>
        </div>
    )

}