import './sidebar.css'
import { Link } from 'react-router-dom'
import './sidebar.css'
import { useLocation } from 'react-router-dom'
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/logtraffic`
/* Home page side bar */
export default function SideBar(){
    const location = useLocation()
    const bar = ['Vertical Bar Graph', 'Choropleth Map (PH-Provinces)', 'Choropleth Map (PH-Region)','Heat Map']
    const url = {
        'Vertical Bar Graph':'/home/verticalbargraph',
        'Choropleth Map (PH-Provinces)':'/home/choroplethmap(ph-provinces)',
        'Choropleth Map (PH-Region)':'/home/choroplethmap(ph-region)',
        'Heat Map':'/home/heatmap'
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
        <div>
            {
                bar.map((item) => (
                <Link to={`/home/${item.replace(/\s/g, '').toLowerCase()}`} id={(url[item] === location.pathname) ? 'green' : undefined}  key={item} className='link' onClick={() => handleClick(item)}>{item}</Link>//.replace(/\s/g, '') remove spaces
                ))
            }
        </div>
    )  
}