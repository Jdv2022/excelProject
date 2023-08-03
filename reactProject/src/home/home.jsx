import SideBar from './sidebar'
import './sidebar.css'
import { useEffect, useState, useRef, createContext } from 'react'
import { useLocation } from 'react-router-dom'
import FileUpload from './fileUploadApi'
import DashBoard from '../graphs/dashboard'
import RenderVerticalBarGraph from '../graphs/renderverticalBarGraph'
import html2canvas from 'html2canvas'
import provincePh from '../sampleData/provincesPh'
import VerticalBarGraphSampleData from '../sampleData/verticalGraph'
import Philippines from '../graphs/philippinesMap'
import VerticalGraphTool from '../tools/verticalgraphtoolbar'
import PhTool from '../tools/phtool'
import regionPh from '../sampleData/regionPh'
import PhRegion from '../graphs/phRegion'
import RegionPhTool from '../tools/regionphtool'
import arrowImage from '../assets/arrow.png'
import NotYet from '../notYetAvailable'
import HeatMap from '../graphs/heatmap'
import HeatMapTool from '../tools/heatmaptool'
import { Link } from 'react-router-dom'
import Contact from '../extra/contact'
import AdminLogin from '../admin/adminLogin'

/* Contexts */
export const VERTICALBAR = createContext(null)     //vertical bar chart and ph-province tree
export const PH = createContext(null)              //ph-region tree
export const HEATMAP = createContext(null)              //ph-region tree

/* Global URLS */
const URLS = [
    {url:'/home/verticalbargraph', 'value':VerticalBarGraphSampleData()}, //vertical bar chart
    {url:'/home/choroplethmap(ph-provinces)', 'value':provincePh()},      //ph-province
    {url:'/home/choroplethmap(ph-region)', 'value':regionPh()},           //ph-region
]

/* Home Component (Route= '/home/*') */
export default function Home(){
    /* Hooks */
    const location = useLocation()                                                         //for url's
    const [selectedFile, setSelectedFile] = useState(null)                                 //the selected file                                 //data title, will be rendered when a chart is selected 
    const [render, setRender] = useState(true)                                             //this sets what to render and what not
    const [data, setData] = useState(VerticalBarGraphSampleData())                    //this sets the different hard coded data for different charts
    const [verticalDataTool, setVerticalDataTool] = useState(null)                         //sets the settings of tool widget for vertical chart
    const [phToolbar, setPhToolBar] = useState(null)                                  //sets the settings of tool widget for ph-province
    const [verticalDataToolRegion, setVerticalDataToolRegion] = useState(null)        //sets the settings of tool widget for ph-region
    const [renderRegion, setRenderRegion] = useState(null)                            //sets the data for ph-region        
    const [screenWidth, setScreenWidth] = useState(null)             
    const [selectedPic, setSelectedPic] = useState(null)
    const [heatMapTool, setHeatTool] = useState(null)
    let nameRef = useRef(null)
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

    const toHeat = {
        data0: heatMapTool,
        url: data
    }
    /* End Context Data */
    /* Contexts tree */
    const heat = (
        <>
            <HEATMAP.Provider value={toHeat}>
                <HeatMap />
            </HEATMAP.Provider>
        </>
    )

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
        function logScreenSize() {
            const screenWidth = window.innerWidth;
            setScreenWidth(screenWidth)
        }
        window.addEventListener("resize", logScreenSize);
        function temp(){
            const url = URLS
            for(let i=0; i< url.length; i++){
                if(url[i].url === location.pathname){
                    nameRef.current.textContent = 'Sample Data'
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
    },[location.pathname,screenWidth])
    /* Function call for user interactions */
    function handleFileChange(event){
        const file = event.target.files[0]
        const name = file.name
        setSelectedFile(file)
        nameRef.current.textContent = name;
    }

    function handlePicChange(event){
        const file = event.target.files[0]
        const name = file.name
        const temporaryURL = URL.createObjectURL(file);
        setSelectedPic(temporaryURL)
        nameRef.current.textContent = name;
    }
        
    function updateData(newData){
        setVerticalDataTool(newData)
    }

    function phTool(newData){
        setPhToolBar(newData)
    }

    function regionTool(newData){
        setVerticalDataToolRegion(newData)
    }

    function heatTool(newData){
        setHeatTool(newData)
    }
    
    async function handleSubmit(){
        if(!selectedFile){
            console.error('No file selected')
            return null
        }
        const api = await FileUpload(selectedFile)
        setData(api)
        setRenderRegion(api)
    }

    function handleSubmitPic(){
        if(!selectedPic){
            console.error('No file selected')
            return null
        }
        setData(selectedPic)
    }

    function generatePagi(){
        setRender(true)
    }

    function generate(){
        setRender(false)
    }

    function downloadAsPDF(){
        const element = document.getElementById('pdf')
        const options = {scale: 10}
        html2canvas(element, options).then((canvas) => {
            const imageDataURL = canvas.toDataURL('image/jpeg')
            const link = document.createElement('a')
            link.href = imageDataURL
            link.download = 'Graph.jpg'
            link.click()
        });
    }

    function jsonToCsvConvert(){
        const headers = Object.keys(data[0])
        let obj= {}
        for(let i=0; i<headers.length; i++){
            obj[headers[i]] = headers[i]
        }
        data.splice(0,0,obj)
        let csvRows = []
        for (const row of data) {
            const values = headers.map((header) => {
                const escapedValue = row[header].toString().replace(/"/g, '\\"')
                return `"${escapedValue}"`
            })
            csvRows.push(values.join(','))
        }
        return csvRows.join('\n')
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
        <input className='bg-primary text-light border-0 rounded p-1 ' type='button' value='Download File' onClick={()=>{downloadAsCSV()} } />
    )

    const generatePaginationhButton = (
        <input className='bg-primary text-light border-0' type='button' value='Generate Table' onClick={()=>{generatePagi()}}></input>
    )

    const generateGraphButton = (
        <input className='bg-primary text-light border-0' type='button' value='Generate Graph' onClick={()=>{generate()}}></input>
    )
    const ScreenShot = (<input className='bg-primary text-light border-0' type='button' value='Download Image' onClick={()=>{downloadAsPDF()} }></input>)
    const up = (
        <div >
            <input type='file' onChange={handleFileChange}></input>
            <input type='submit' onClick={()=>{handleSubmit()}}></input>
        </div>
    )
    const uploadPic = (
        <div >
            <input type='file' onChange={handlePicChange}></input>
            <input type='submit' onClick={()=>{handleSubmitPic()}}></input>
        </div>
    )
    const condition = (
        location.pathname != '/home' && location.pathname != '/home/heatmap' && location.pathname != '/home/messageme' && location.pathname != '/home/admin/login'
    )

    if(screenWidth && screenWidth < 972) return <div><NotYet/></div>
    return (
        
        <main className="vh-100 home w-100">
            <aside className='col-md-1 vh-100 align-top'  id='sidebar'>
                <SideBar />
            </aside>
            <section className='col-md-11 d-inline-block display-container align-top'>
                <Link to={'/home/messageme'} id='info'>i</Link>
                {location.pathname == '/home/messageme' && <Contact />}
                {location.pathname == '/home/admin/login' && <AdminLogin />}
                {(location.pathname != '/home') ? <h1 ref={nameRef}></h1>:<img className='arrowPic' src={arrowImage} alt="Arrow" />}
                <div className="custom-container">
                    <div className='custom-dashboard  overflow-auto'>
                        <div className='col-md-11 d-inline-block align-top pdfParent'>
                            <div id={!render ? 'pdf':''}>
                                {location.pathname === '/home/verticalbargraph' && (render ? renderTable : renderGraph)}
                                {location.pathname === '/home/choroplethmap(ph-provinces)' && (render ? renderTable : renderPh)}
                                {location.pathname === '/home/choroplethmap(ph-region)' && (render ? renderTable : renderPhRegion)}
                                {location.pathname === '/home/heatmap' && <div id='pdf' className='w-auto'>{heat}</div>}
                            </div>
                        </div>
                        <div className='col-md-1 d-inline-block align-top position-sticky top-0'>
                            {location.pathname === '/home/verticalbargraph' && !render && <VerticalGraphTool upDateData={updateData} />}
                            {location.pathname === '/home/choroplethmap(ph-provinces)'&& !render && <PhTool updateData={phTool} />}
                            {location.pathname === '/home/choroplethmap(ph-region)' && !render && <RegionPhTool updateData={regionTool} />}
                            {location.pathname === '/home/heatmap' &&  <HeatMapTool updateData={heatTool} />}
                        </div>
                    </div>
                    <footer className='w-100 d-inline-block mt-3'>
                        <div className="w-100 downloadBars">
                            {condition &&  up}
                            {condition && (render ? generateGraphButton : generatePaginationhButton)}
                            {condition && (!render ? ScreenShot:downloadSampleData)}
                            {location.pathname == '/home/heatmap' && uploadPic}
                            {location.pathname == '/home/heatmap' && ScreenShot}
                        </div>
                    </footer>
                </div>
            </section>
        </main>
    )

}