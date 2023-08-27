import './contactme.css'
import Admins from './admin'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ContactMe(){

    const [data, setData] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const form = document.querySelector(`#admin`) 
        form.addEventListener('submit', handleSubmit)
        async function handleSubmit(event){
            event.preventDefault()
            const res = await Admins(form)
            if(res == true){
                navigate('/admin/dashboard')
            }
            else{
                setData(res)
            }
        }
        // Cleanup function to remove the event listener
        return () => {
            form.removeEventListener('submit', handleSubmit)
        }
    },[])

    async function handleKeyDown(event){
        if (event.key === 'Enter') {
            const form = document.querySelector(`#admin`) 
            const res = await Admins(form)
            if(res == true){
                navigate('/admin/dashboard')
            }
            else{
                setData(res)
            }
        }
    }

    const ad = (
        <div id='admincontainer' onKeyDown={()=> {handleKeyDown}} >
            <form id='admin'>
                <h1>Admin Login</h1>
                <label>
                    Username
                    <input type="text" id="mesname" className='block' name='username' defaultValue={'admin'}/>
                </label>
                <label>
                    Password
                    <input type="password" id="mestitle" className='block' name='password' defaultValue={'administration'}/>
                </label>
                <input type='submit' className='submit'/>
            </form>
            {data?<p>{data}</p>:''}
        </div>
    )

    return ad

}