import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { table as provinceTable } from '../graphs/ph_province/philippinesMap'
import { table as regionTable } from '../graphs/ph_region/phRegion'
import { table as  berticaltable } from '../graphs/bargraph_vertical/renderverticalBarGraph'
import { table as lineTable } from '../graphs/linechart/linechart'
import { table as horizontalTable } from '../graphs/horizontalbar/horizontalbar'
import './dashboard.css'
import convertToJson from './convertojson'

/* Renders the table */
export default function DashBoard(prop){

    const urlsData = {
        '/home/choroplethmap(ph-provinces)': useContext(provinceTable),
        '/home/choroplethmap(ph-region)': useContext(regionTable),
        '/home/verticalbargraph': useContext(berticaltable),
        '/home/linechart': useContext(lineTable),
        '/home/horizontalbarchart': useContext(horizontalTable),
    }

    const location = useLocation()
    const valueFromHome = urlsData[location.pathname]
    const [data, setData] = useState(valueFromHome)
    const [selectedFileName, setSelectedFileName] = useState('Sample Data')
    const [selectedFile, setSelectedFile] = useState(null)
    const [header, setHeader] = useState([])
    const [body, setBody] = useState([])

    useEffect(()=>{
        function dataConvert(){
            let newBody = []
            const headers = valueFromHome[0]
            const dataLength = valueFromHome.length
            const newHead = Object.keys(headers)
            setHeader(newHead)
            for(let i=0; i<dataLength; i++){
                const obj = Object.values(valueFromHome[i])
                newBody.push(obj)
            }
            setBody(newBody)
        }
        if(valueFromHome){
            dataConvert()
        }
    },[selectedFileName, valueFromHome])

    function downloadAsCSV(){
        const file = jsonToCsvConvert(valueFromHome)
        const blob = new Blob([file], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const fileName = "sampleData.csv"
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', fileName)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
    function jsonToCsvConvert(params){
        const headers = Object.keys(params[0])
        let obj= {}
        for(let i=0; i<headers.length; i++){
            obj[headers[i]] = headers[i]
        }
        params.splice(0,0,obj)
        let csvRows = []
        for (const row of params) {
            const values = headers.map((header) => {
                if(!row[header]) return
                const escapedValue = row[header].toString().replace(/"/g, '\\"')
                return `"${escapedValue}"`
            })
            csvRows.push(values.join(','))
        }
        return csvRows.join('\n')
    }
    function handleFileChange(event){
        const file = event.target.files[0]
        const name = file.name
        setSelectedFile(file)
        setSelectedFileName(name)
    }
    async function handleSubmit(){
        if(!selectedFile){
            console.error('No file selected')
            return null
        }
        const api = await convertToJson(selectedFile)
        sendDataToParent(api)
    }
    if(!valueFromHome) return
    const renderTable = (
        <table>
            <thead className="positionSticky headColor">
                <tr>
                    {header.map((item,index) => (
                        typeof data[index][item] != 'object' ? (<th key={item}>{item}</th>) : null
                    ))}
                </tr>
            </thead>
            <tbody>
                {body.map((bodyData, index) => (
                    <tr key={index} className={(index%2==0)?'greylight':'grey'} >
                        {bodyData.map((item, index) => (
                            typeof item != 'object' ? (<td key={index} className='borderCustom'>{item}</td>) : null
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
    const downloadSampleData = (
        <input className='inlineBlock vat downloadFile' type='button' value='Download File' onClick={()=>{downloadAsCSV()} } />
    )
    const upload = (
        <div id='uploadFile' className='inlineBlock vat'>
            <input id='handlechange' type='file' onChange={handleFileChange}></input>
            <input id='handlesubmit' type='submit' onClick={()=>{handleSubmit()}}></input>
        </div>
    )
    function sendDataToParent(params){
        prop.sendDataToParent(params)
    }
    return (
        <>
            <h1 id='titleFile'>{selectedFileName}</h1>
            <div id='tableDashboard'>
                {renderTable}
            </div>
            <div id='fileUploadcontainer'>
                {upload}
                {downloadSampleData}
            </div>
        </>
    )

}