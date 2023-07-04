import './sidebar.css'
import { Link } from 'react-router-dom'
import './sidebar.css'
import { useLocation } from 'react-router-dom'
/* Home page side bar */
export default function SideBar(){
    const location = useLocation()
    const bar = ['Vertical Bar Graph', 'Choropleth Map (PH-Provinces)', 'Choropleth Map (PH-Region)']
    const url:any = {
        'Vertical Bar Graph':'/home/verticalbargraph',
        'Choropleth Map (PH-Provinces)':'/home/choroplethmap(ph-provinces)',
        'Choropleth Map (PH-Region)':'/home/choroplethmap(ph-region)'
    }
    return (
        <div>
            {
                bar.map((item) => (
                <Link to={`/home/${item.replace(/\s/g, '').toLowerCase()}`} id={(url[item] === location.pathname) ? 'green' : undefined}  key={item} className='link'>{item}</Link>//.replace(/\s/g, '') remove spaces
                ))
            }
        </div>
    )  
}