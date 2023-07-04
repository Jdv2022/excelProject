import SideBar from './sidebar'
import './sidebar.css'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import FileUpload from '../home/fileUploadApi'
import { createContext } from 'react'
import DashBoard from '../graphs/dashboard'
import RenderVerticalBarGraph from '../graphs/renderverticalBarGraph'
import html2canvas from 'html2canvas'
import provincePh from '../sampleData/provincesPh'
import VerticalBarGraphSampleData from '../sampleData/verticalGraph'
import Philippines from '../graphs/philippinesMap'
import VerticalGraphTool from './verticalgraphtoolbar'
import PhTool from './phtool'
import regionPh from '../sampleData/regionPh'
import PhRegion from '../graphs/phRegion'
import RegionPhTool from './regionphtool'

/* Contexts */
export const VERTICALBAR = createContext<any>(null)     //vertical bar chart and ph-province tree
export const PH = createContext<any>(null)              //ph-region tree

/* Global URLS */
const URLS = [
    {url:'/home/verticalbargraph', 'value':VerticalBarGraphSampleData()}, //vertical bar chart
    {url:'/home/choroplethmap(ph-provinces)', 'value':provincePh()},      //ph-province
    {url:'/home/choroplethmap(ph-region)', 'value':regionPh()}            //ph-region
]

/* Home Component (Route= '/home/*') */
export default function Home(){
    /* Hooks */
    const location = useLocation()                                                         //for url's
    const [selectedFile, setSelectedFile] = useState(null)                                 //the selected file
    const [name, setName] = useState('Sample Data')                                        //data title, will be rendered when a chart is selected 
    const [render, setRender] = useState(true)                                             //this sets what to render and what not
    const [data, setData] = useState<any>(VerticalBarGraphSampleData())                    //this sets the different hard coded data for different charts
    const [verticalDataTool, setVerticalDataTool] = useState(null)                         //sets the settings of tool widget for vertical chart
    const [phToolbar, setPhToolBar] = useState<any>(null)                                  //sets the settings of tool widget for ph-province
    const [verticalDataToolRegion, setVerticalDataToolRegion] = useState<any>(null)        //sets the settings of tool widget for ph-region
    const [renderRegion, setRenderRegion] = useState<any>(null)                            //sets the data for ph-region 
    /* End hooks */

    /* Context data */
    const toChild = {   
        data0: data,
        data1: verticalDataTool,
    }

    const toPhRegion = {    
        data0: renderRegion,
        data1: verticalDataToolRegion,
    }

    const toPh = {
        data0: data,
        data1: phToolbar
    }
    /* End Context Data */
    /* Contexts tree */
    const renderTable = (
        <>
            <VERTICALBAR.Provider value={toChild}>
                <DashBoard />
            </VERTICALBAR.Provider>
        </>
    )

    const renderGraph = (
        <>
            <VERTICALBAR.Provider value={toChild}>
                <RenderVerticalBarGraph />
            </VERTICALBAR.Provider>
        </>
    )

    const renderPh = (
        <>
            <PH.Provider value={toPh}>
                <Philippines /> 
            </PH.Provider>
        </>
    )

    const renderPhRegion = (
        <>
            <PH.Provider value={toPhRegion}>
                <PhRegion /> 
            </PH.Provider>
        </>
    )
    /* End Contexts tree */
    useEffect(()=>{
        //This will set the temporary data to the corresponding url
        function temp(){
            const url = URLS
            for(let i=0; i< url.length; i++){
                if(url[i].url === location.pathname){
                    if(location.pathname == '/home/choroplethmap(ph-provinces)' || location.pathname == '/home/verticalbargraph'){
                        setData(url[i].value)
                    }
                    else if(location.pathname == '/home/choroplethmap(ph-region)'){
                        setRenderRegion(url[i].value)
                        setData(url[i].value)
                    }
                }
            }
        }
        temp()
        setRender(true)
    },[location.pathname])
    /* Function call for user interactions */
    function handleFileChange(event:any){
        const file = event.target.files[0]
        const name = file.name
        setSelectedFile(file)
        setName(name)
    }
        
    function updateData(newData:any){
        setVerticalDataTool(newData);
    }

    function phTool(newData:any){
        setPhToolBar(newData)
    }

    function regionTool(newData:any){
        setVerticalDataToolRegion(newData)
    }
    
    async function handleSubmit(){
        if(!selectedFile){
            console.error('No file selected')
            return null
        }
        const api = await FileUpload(selectedFile)
        setData(api)
    }

    function generatePagi(){
        setRender(true)
    }

    function generate(){
        setRender(false)
    }

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

    function jsonToCsvConvert(){
        const headers = Object.keys(data[0])
        let obj:any= {}
        for(let i=0; i<headers.length; i++){
            obj[headers[i]] = headers[i]
        }
        data.splice(0,0,obj)
        let csvRows = []
        for (const row of data) {
            const values = headers.map((header:any) => {
                const escapedValue = row[header].toString().replace(/"/g, '\\"');
                return `"${escapedValue}"`;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    }

    function downloadAsCSV(){
        const file = jsonToCsvConvert()
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
    /* End for function calls */       
    /* Buttons */
    const downloadSampleData = (
        <input className='bg-primary text-light border-0 rounded p-1 ' type='button' value='Download Sample File' onClick={()=>{downloadAsCSV()} } />
    )

    const generatePaginationhButton = (
        <input className='bg-primary text-light border-0' type='button' value='Generate Table' onClick={()=>{generatePagi()}}></input>
    )

    const generateGraphButton = (
        <input className='bg-primary text-light border-0' type='button' value='Generate Graph' onClick={()=>{generate()}}></input>
    )

    const up = (
        <div >
            <input type='file' onChange={handleFileChange}></input>
            <input type='submit' onClick={()=>{handleSubmit()}}></input>
        </div>
    )

    return (

        <div className="vh-100 home w-100 bg-custom">
            <div className='col-md-1 d-inline-block bg-secondary vh-100 align-top'>
                <SideBar />
            </div>
            <div className='col-md-11 d-inline-block display-container align-top '>
                {(location.pathname != '/home') ? <h1 className='d-block'>{name}</h1>:<h1 className='text-light'>.</h1>}
                <div className="custom-container">
                    <div className='custom-dashboard  overflow-auto'>
                        <div id='pdf' className='col-md-11 d-inline-block align-top' >
                            {location.pathname === '/home/verticalbargraph' && (render ? renderTable : renderGraph)}
                            {location.pathname === '/home/choroplethmap(ph-provinces)' && (render ? renderTable : renderPh)}
                            {location.pathname === '/home/choroplethmap(ph-region)' && (render ? renderTable : renderPhRegion)}
                        </div>
                        <div className='col-md-1 d-inline-block align-top bg-prmary position-sticky top-0'>
                            {location.pathname === '/home/verticalbargraph' && !render && <VerticalGraphTool upDateData={updateData} />}
                            {location.pathname === '/home/choroplethmap(ph-provinces)'&& !render && <PhTool updateData={phTool} />}
                            {location.pathname === '/home/choroplethmap(ph-region)' && !render && <RegionPhTool updateData={regionTool} />}
                        </div>
                    </div>
                    <div className='w-100 d-inline-block'>
                        <div className="w-100 downloadBars">
                            {location.pathname != '/home' && up}
                            {location.pathname != '/home' && (render ? generateGraphButton : generatePaginationhButton)}
                            {location.pathname != '/home' && (!render ? <input className='bg-primary text-light border-0' type='button' value='Download Image' onClick={()=>{downloadAsPDF()} }></input>:downloadSampleData)}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}