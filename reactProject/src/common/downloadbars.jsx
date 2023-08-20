import { Move as provinceMove } from '../graphs/ph_province/philippinesMap'
import { Move as regionMove } from '../graphs/ph_region/phRegion'
import { Move as verticalMove } from '../graphs/bargraph_vertical/renderverticalBarGraph'
import { Move as lineMove } from '../graphs/linechart/linechart'
import { Move as horizontalMove } from '../graphs/horizontalbar/horizontalbar'
import { Move as pieMove } from '../graphs/piechart/piechart'
import { Move as donutMove } from '../graphs/piechart/donut'
import { Move as multiplelineMove } from '../graphs/multipleline/multipleline'
import { Move as improvedhorizontalMove } from '../graphs/horizontalbar/improvedhorizontal'
import { Move as iwashereMove } from '../graphs/iwashere/iwahere'
import { useState, useContext, useEffect } from "react"
import { useLocation } from 'react-router-dom'
import html2canvas from 'html2canvas'
import './downloadbars.css'

export default function DownloadBars(){
        
        const urlpagination = {
            '/home/choroplethmap(ph-provinces)':  useContext(provinceMove),
            '/home/choroplethmap(ph-region)':   useContext(regionMove),
            '/home/verticalbargraph': useContext(verticalMove),
            '/home/linechart': useContext(lineMove),
            '/home/horizontalbarchart': useContext(horizontalMove),
            '/home/piechart': useContext(pieMove),
            '/home/donutchart': useContext(donutMove),
            '/home/multiplelinechart': useContext(multiplelineMove),
            '/home/improvedhorizontalbarchart': useContext(improvedhorizontalMove),
            '/home/iwashere!': useContext(iwashereMove),
        }
        
        const location = useLocation()
        const handleMoveIt = urlpagination[location.pathname]
        const [render, setRender] = useState(false)

        //download image    
        const downloadImg = (
            <input id='downloadButtonImg' className='button inlineBlock vat' type='button' value='Download Image' onClick={()=>{downloadAsImg()} } />
        )
        //const move element svg 
        const move = (
            <div id='moveIt' className='inlineBlock vat'>
                <div className='arrowLeft inlineBlock vat' onClick={addLeft}>Move Left</div>
                <div className='arrowRight inlineBlock vat' onClick={addRight}>Move Right</div>
            </div>
        )
        //generate graph
        const pagination = (
            <input id='chartButton' className='button' type='button' value='Upload Excel Data' onClick={paginationGenerator}/>
        )
        const chart = (
            <input id='chartButton' className='button' type='button' value='Generate Chart' onClick={chartGenerator}/>
        )
        function paginationGenerator(){
            handleMoveIt('pagination')
            setRender(true)
        }
        function chartGenerator(){
            handleMoveIt('chart')
            setRender(false)
        }
        function addRight(){
            handleMoveIt(10)
        }
        function addLeft(){
            handleMoveIt(-10)
        }
        function downloadAsImg(){
            const element = document.getElementById('screenShoot')
            const options = {scale: 10};
            html2canvas(element, options).then((canvas) => {
                const imageDataURL = canvas.toDataURL('image/jpeg')
                const link = document.createElement('a')
                link.href = imageDataURL
                link.download = 'Graph.jpg'
                link.click()
            })
        }
        return (
            <div id="downloadBars" className='inlineBlock vat'>
                {downloadImg}
                {move}
                {(render)?chart:(location.pathname == '/home/iwashere!')?null:pagination}
            </div>
        )

}