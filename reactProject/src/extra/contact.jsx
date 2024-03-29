import './extra.css'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/admin`

export default function Contact(){

    const [data, setData] = useState(null)
    
    useEffect(() => {
        const form = document.querySelector('#contact') 
        const handleSubmit = async (event) => {
          event.preventDefault()
            try {
                const formData = new FormData(form);
                const response = await fetch(endpointUrl, {
                    method: 'POST',
                    body: formData,
                })       
                if (response.ok) {
                    const text = await response.text()
                    const viewData = text ? JSON.parse(text) : {}
                    console.log(viewData)
                    setData(viewData.response)
                } 
                else {
                    throw new Error('Request failed')
                }
            } catch (error) {
                console.error(error);
            }
        };
        
        form.addEventListener('submit', handleSubmit);
        
        // Cleanup function to remove the event listener
        return () => {
            form.removeEventListener('submit', handleSubmit);
        };
    }, [data])
      
    return (
        <div id='contactContainer'>
            <Link to={'/home'} id='closeForm'>X</Link>
            <p id='headerForm'>Can't find the chart you need? I can create it for you! Please fill out the form below.</p>
            <form id="contact">
                <label className="d-block" htmlFor="name">Your name</label>
                <input className="mb-2" name='name' type="text" placeholder={data && data.name?data.name:''} id="name" />
                <label className="d-block" htmlFor="title">Chart/bug title</label>
                <input className="mb-2" name='title' type="text" placeholder={data && data.title?data.title:''} id="title" />
                <label className="d-block" htmlFor="message">Chart/bug details</label>
                <textarea className="messageMeTextArea mb-2" name='message' placeholder={data && data.message?data.message:''} id="message" />
                <input className='mb-3' type='submit'/>
            </form>
            <div className='successContact'>{data && data.success?data.success:''}</div> 
            <p className='footer'>Alternatively, you can reach me at <span className='footerSpan'>ppp.jdv.projects@excel2charts.online</span></p>
            <Link id='link' to={'/home/admin/login'}>Admin login</Link>
        </div>
    )
}
