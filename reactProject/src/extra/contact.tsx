import './extra.css'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Contact(){

    const [data, setData] = useState<any>(null)
    
    useEffect(() => {
        const form = document.querySelector('#contact') as HTMLFormElement;
        const handleSubmit = async (event: Event) => {
          event.preventDefault()
            try {
                const formData = new FormData(form);
                const response = await fetch('http://localhost:8081/admin', {
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
                <label className="d-block" htmlFor="title">Title</label>
                <input className="mb-2" name='title' type="text" placeholder={data && data.title?data.title:''} id="title" />
                <label className="d-block" htmlFor="message">Chart details</label>
                <textarea className="messageMeTextArea mb-2" name='message' placeholder={data && data.message?data.message:''} id="message" />
                <input className='mb-3' type='submit'/>
            </form>
            <div className='successContact'>{data && data.success?data.success:''}</div> 
            <p className='footer'>Alternatively, you can reach me at ppp.projects@gmail.com</p>
            <Link id='link' to={'/home/admin/login'}>Admin login</Link>
        </div>
    )
}
