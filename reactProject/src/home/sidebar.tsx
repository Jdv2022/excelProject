import './sidebar.css'
import { Link } from 'react-router-dom'

export default function SideBar(){

    const bar = ['Vertical Bar Graph']
    
    const sideChoice = (

        <div>
            {
                bar.map((item) => (
                <Link to={`/home/verticalbar/${item.replace(/\s/g, '').toLowerCase()}`} key={item} className='link'>{item}</Link>//.replace(/\s/g, '') remove spaces
                ))
            }
        </div>

    )  

    return sideChoice

}