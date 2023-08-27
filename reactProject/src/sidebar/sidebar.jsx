import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import './sidebar.css'
import messagePng from '../../public/message.png'
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/logtraffic`

/* 
    Docu: Component found at the left side. This contains and changes to the url
    when specific chart is selected 
*/
export default function SideBar(){

    useEffect(()=>{
        document.addEventListener('click', unToggleTap)
        return () =>{
            document.removeEventListener('click', unToggleTap)
        }
    },[])
    
    /* 
        Docu: Names of the sidebar choices 
        If new chart is added, include here.
    */
    const bar = [
        'Welcome',
        'Instructions',
        'I Was Here!',
        'Choropleth Map (PH-Provinces)', 
        'Choropleth Map (PH-Region)', 
        'Vertical Bar Graph', 'Line Chart', 
        'Horizontal Bar Chart',
        'Improved Horizontal Bar Chart',
        'Pie Chart',
        'Donut Chart',
        'Multiple Line Chart'
    ]
    
    /* 
        Docu: Names and urls, use for redirecting when rendering a new chart
        If new chart is added, include name and equevalent url here.
    */
    const url = {
        'Choropleth Map (PH-Provinces)':'/home/choroplethmap(ph-provinces)',
        'Choropleth Map (PH-Region)':'/home/choroplethmap(ph-region)',
        'Vertical Bar Graph':'/home/verticalbargraph',
        'Line Chart':'/home/linechart',
        'Horizontal Bar Chart':'/home/horizontalbarchart',
        'Pie Chart':'/home/piechart',
        'Donut Chart':'/home/donutchart',
        'Multiple Line Chart':'/home/multiplelinechart',
        'Improved Horizontal Bar Chart':'/home/improvedhorizontalbarchart',
        'I Was Here!':'/home/iwashere!',
        'Instructions':'/home/instructions',
        'Welcome':'/home/welcome',
        'Contact me':'/home/contactme'
    }

    /* 
        Docu: When called, will send a post request in PHP server and logs into db.
    */
    async function handleClick(params){
        try {
            const response = await fetch(endpointUrl, {
                method: 'POST',
                body: JSON.stringify(params),
            })
        } 
        catch (error) {
            console.error('Error uploading file:', error)
        }
        return null
    }

    function toggleTap() {
        const element = document.getElementById('unclicked')
        if(element) {
            element.id = 'clicked'
        }
    }

    function unToggleTap(event) {
        
        const clickedElement = event.target
        const elementId = clickedElement.id
        if(elementId == 'sideBar') return

        const element = document.getElementById('clicked')
        if(element) {
            element.id = 'unclicked'
        }
    }

    return (
        <div id='sideBar' onClick={toggleTap} >
            <div id='unclicked' >
                {
                    bar.map((item) => (
                        <Link to={`/home/${item.replace(/\s/g, '').toLowerCase()}`} //.replace(/\s/g, '') remove spaces
                            id={(url[item] === location.pathname) ? 'selectedHighlight' : undefined} //Change color for selected chart in side bar bar
                            key={item} className='sidebarChoices' 
                            onClick={() => handleClick(item)}>
                                {item}
                        </Link>
                    ))
                }
            </div> 
            <Link to={`/home/contactme`} //.replace(/\s/g, '') remove spaces
                id={('/home/contactme' === location.pathname) ? 'selectedHighlight' : undefined}  //Change color for selected chart in side bar bar
                onClick={() => handleClick('Contact me')}><img id='messagePic' src={messagePng} alt="My Image" />
            </Link>
        </div>
    )  
}