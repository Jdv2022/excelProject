import { Link } from 'react-router-dom'
import './sidebar.css'
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/logtraffic`

/* Parent home */
export default function SideBar(){

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

    return (
        <div id='sideBar' className='borderBox inlineBlock vat'>
            {
                bar.map((item) => (
                    <Link to={`/home/${item.replace(/\s/g, '').toLowerCase()}`} //.replace(/\s/g, '') remove spaces
                        id={(url[item] === location.pathname) ? 'selectedHighlight' : undefined}  
                        key={item} className='sidebarChoices borderBox' onClick={() => handleClick(item)}>{item}
                    </Link>
                ))
            }
            <div id='contactme'>
                <Link to={`/home/contactme`} //.replace(/\s/g, '') remove spaces
                    id={('/home/contactme' === location.pathname) ? 'selectedHighlight' : undefined}  
                    className='sidebarChoices borderBox' onClick={() => handleClick('Contact me')}>Contact me
                </Link>
            </div>
        </div>
    )  
}