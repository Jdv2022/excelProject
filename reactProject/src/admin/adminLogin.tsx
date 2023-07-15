import { useNavigate , Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function AdminLogin(){

    const [data, setData] = useState<any>(null)
    const navigate = useNavigate()
    useEffect(() => {
        const form = document.querySelector('#contact') as HTMLFormElement
        
        const handleSubmit = async (event: Event) => {
          event.preventDefault()
            try {
                const formData = new FormData(form)
                const response = await fetch('http://localhost:8081/admin/admin', {
                    method: 'POST',
                    body: formData,
                })       
                if (response.ok) {
                    const text = await response.text()
                    const viewData = text ? JSON.parse(text) : {}
                    if(viewData.response == true){
                        navigate('/admin')
                    }
                    setData(viewData.response)
                } 
                else {
                    throw new Error('Request failed')
                }
            } catch (error) {
                console.error(error);
            }
        };
        
        form.addEventListener('submit', handleSubmit)
        
        // Cleanup function to remove the event listener
        return () => {
            form.removeEventListener('submit', handleSubmit)
        };
      }, [])
    
    return (
        <div id='contactContainer'>
            <h1 className='mb-5'>Admin Login</h1>
            <Link to={'/home'} id='closeForm'>X</Link>
            <form id="contact">
                <label className="d-block" htmlFor="1">Username</label>
                <input className="mb-2" name='username' type="text" id="1" defaultValue='admin' />
                <label className="d-block" htmlFor="2" >Password</label>
                <input className="mb-2" name='password' type="password" id="2" defaultValue='admin' />
                <input className='mb-3 d-block' type='submit' value={'Login'}/>
            </form>
            <p className='errorAdminLogin'>{data == 'Incorrect password or email.' ? data:<></>}</p>
        </div>
    )
}
