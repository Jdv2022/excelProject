import './verticalbar.css'
import { useEffect, useState, useRef } from 'react'
import FileUpload from '../home/fileUploadApi'
import { createContext } from 'react'
import RenderVerticalBarGraph from './renderverticalBarGraph'
import html2canvas from 'html2canvas';

export const verticalBar = createContext<any>(null)

const SAMPLEDATA = {data : [
    { 'Fruits': 'Apple', 'Amount': 25 },
    { 'Fruits': 'Banana', 'Amount': 15 },
    { 'Fruits': 'Orange', 'Amount': 20 },
    { 'Fruits': 'Grapes', 'Amount': 12 },
    { 'Fruits': 'Mango', 'Amount': 18 },
    { 'Fruits': 'Watermelon', 'Amount': 33 },
    { 'Fruits': 'Lemon', 'Amount': 21 },
    { 'Fruits': 'Coconut', 'Amount': 8 },
    { 'Fruits': 'Pineapple', 'Amount': 16 },
]}

let BODY:any[] = []
const HEAD = Object.keys(SAMPLEDATA.data[0])
for(let i=0; i<SAMPLEDATA.data.length; i++){
    const obj = Object.values(SAMPLEDATA.data[i])
    BODY.push(obj)
}

export default function VerticalBarGraph(){

    const [rangeY, setRangeY] = useState(10)
    const [selectedFile, setSelectedFile] = useState(null)
    const [name, setName] = useState('Sample Data')
    const [data, setData] = useState(SAMPLEDATA)
    const [header, setHeader] = useState(HEAD)
    const [body, setBody] = useState(BODY)
    const [render, setRender] = useState(false)
    const [radio, setRadio] = useState(0)
    const [color, setColor] = useState('#F2BE22')
    const inputRef = useRef<any>(null);

    function handleFileChange(event:any){
        const file = event.target.files[0]
        setSelectedFile(file)
        setName(file.name)
    }

    async function handleSubmit(){
        if(!selectedFile){
            console.error('No file selected')
            return null
        }
        const api = await FileUpload(selectedFile)
        setData(api)
    }

    function generate(){
        setRender(true)
    }

    useEffect(()=>{
        function dataConvert(){
            let newBody = []
            const newHead = Object.keys(data.data[0])
            setHeader(newHead)
            for(let i=0; i<data.data.length; i++){
                const obj = Object.values(data.data[i])
                newBody.push(obj)
            }
            setBody(newBody)
        }
        dataConvert()
    },[data])

    const toChild = {
        data0: data.data,
        data1: rangeY,
        data2: radio,
        data3: color
    }

    const renderGraph = (
        <div>
            <verticalBar.Provider value={toChild}>
                <RenderVerticalBarGraph />
            </verticalBar.Provider>
        </div>
    )
    let count = 0
    const renderTable = (
        <table>
            <thead>
                <tr>
                    {header.map((item:any, index:number) => (
                        <th key={item} className='greydark borderCustom' >{item}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {body.map((bodyData:any, index:number) => (
                    <tr key={index} className={(index%2==0)?'greylight':'grey'} >
                        {bodyData.map((item:any, index:number) => (
                            <td key={index} className='borderCustom'>{item}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )

    const sideTools = (
        <div className='col-md-1 d-inline-block rightbar'>
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

    const generateGraphButton = (
        <input className='bg-primary text-light border-1' type='button' value='Generate Pagination' onClick={()=>{generatePagi()}}></input>
    )

    const generatePaginationhButton = (
        <input className='bg-primary text-light border-1' type='button' value='Generate Graph' onClick={()=>{generate()}}></input>
    )

    function downloadAsPDF() {
        const element:any = document.getElementById('pdf')
        const options = {scale: 5};
        html2canvas(element, options).then((canvas) => {
            const imageDataURL = canvas.toDataURL('image/jpeg');
            const link = document.createElement('a');
            link.href = imageDataURL;
            link.download = 'Graph.jpg';
            link.click();
        });
    }

    function handlerangeY(e:any){
        setRangeY(e.target.value)
    }

    function handleRadio(e:any){
        setRadio(e.target.value)
    }

    function handleColor(e:any){
        if (inputRef.current) {
            setColor(inputRef.current.value)
        }
    }

    function generatePagi(){
        setRender(false)
    }
    
    return (
        <div className='verticalBarGraphContainer'>
            <div className="d-inline-block w-100 displayGraph">
                <h1 className='fixed-div'>{name}</h1>
                <div>
                    <div id='pdf' className='col-md-11 d-inline-block align-top marginTop'>
                        {render ? renderGraph : renderTable}
                    </div>
                    {render ? sideTools : <></>}
                </div>
            </div>
            <div className="w-100 downloadBars">
                <div className='d-inline-block'>
                    <input type='file' onChange={handleFileChange}></input>
                    <input type='submit' onClick={()=>{handleSubmit()}}></input>
                </div>
                {render ? generateGraphButton : generatePaginationhButton}
                {render && <input className='bg-primary text-light border-1' type='button' value='Download Image' onClick={()=>{downloadAsPDF()}}></input>}
                
            </div>
        </div>
    )

}