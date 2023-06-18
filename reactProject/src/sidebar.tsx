import { Link } from 'react-router-dom'

export default function SideBar(params: any){

    return (
        <>
            <div id='sidebar' className='p-2'>
                <ul className="list-unstyled border border-black">
                    <Link to='/worldtour' className='text-decoration-none'>
                        <li className='w-100 p-3 text text-decoration-none'>World Tour</li>
                    </Link>
                </ul>
            </div>
        </>
    )

}