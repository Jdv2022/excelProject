import { useEffect, useState } from 'react'
import './contactme.css'
import { Link } from 'react-router-dom'
import Messages from './mes'
import { useNavigate } from 'react-router-dom'
const navi = import.meta.env.VITE_react_BASE_URL
const to = `${navi}/admin/login`

const QUERY = {
    'message': Messages,
    'bug': Messages,
}

export default function ContactMe(){

    const [display, setDisplay] = useState('none')
    const [render, setRender] = useState(null)
    const [data, setData] = useState(null)
    const [border, setborder] = useState(null)
    const navigate = useNavigate()

    /* if(accessToken){
        navigate('/admin')
    } */

    useEffect(() => {
        if(!render) return
        if(data?.success == 'Sent!'){
            setborder('succ')
        }
        else if(data != null){
            setborder('fail')
        }
        const form = document.querySelector(`#${render}`) 
        async function handleSubmit(event){
            event.preventDefault()
            const res = await QUERY[render](form)
            if(res == true){
                navigate('/admin')
            }
            if(res?.success == 'Sent!'){
                setRender(null)
                alert('Message Sent.')
                setData(res.success)
            }
            else{
                setData(res)
            }
        }
        form.addEventListener('submit', handleSubmit)
        // Cleanup function to remove the event listener
        return () => {
            form.removeEventListener('submit', handleSubmit)
        }
    },[display, render, data, border])

    function handleClose(){
        setRender(null)
        setborder(null)
        setData(null)
    }

    function handleSelected(params){
        setRender(params)
        setborder(null)
        setData(null)
    }

    const message = (
        <span id='mesform' className={data && data.Success !== 'Sent!' ? 'error' : ''}>
            <span className='close' onClick={handleClose}>X</span>
            <form id='message'>
                <label htmlFor="mesname">Your name</label>
                <input type="text" id="mesname" className='block' name='name' placeholder={data && data.name?data.name:''}/>
                <label htmlFor="mestitle">Title</label>
                <input type="text" id="mestitle" className='block' name='title'placeholder={data && data.title?data.title:''} />
                <label htmlFor="mestext" >Message</label>
                <textarea id="mestext" name='message' placeholder={data && data.message?data.message:''}/>
                <input type='submit' className='submit block'/>
            </form>
        </span>
    )

    const bug = (
        <span id='mesform' className={data && data.Success !== 'Sent!' ? 'error' : ''}>
            <span className='close' onClick={handleClose}>X</span>
            <form id='bug'>
                <label htmlFor="mesname">Your name</label>
                <input type="text" id="mesname" className='block' name='name' placeholder={data && data.name?data.name:''}/>
                <label htmlFor="mestitle">Bug</label>
                <input type="text" id="mestitle" className='block' name='title' placeholder={data && data.title?data.title:''}/>
                <label htmlFor="mestext">Description</label>
                <textarea id="mestext" name='message' placeholder={data && data.message?data.message:''}/>
                <input type='submit' className='submit block'/>
            </form>
        </span>
    )

    const selection = {
        'message': message,
        'bug': bug,
    }

    const dev = (
        <section id='contactme'>
            {render && selection[render]}
            <div className='blue' onClick={() => handleSelected('message')}>
                <h2 className='blue-5'>Message Me</h2>
                <article className='blue-5'>
                    <p>Can't find what you're looking for? Send me a message, and I'll be happy to customize and create it for you! Click here.</p>
                </article>
            </div>
            <div className='red' onClick={() => handleSelected('bug')}>
                <h2 className='red-5'>Report a bug</h2>
                <article className='red-5'>
                    <p>If you've encountered a bug or issue with our application, please let us know. Your feedback is valuable in helping us improve your experience. Click here.</p>
                </article>
            </div>
            <div className='green'>
                <Link to={to} className='link'>
                    <h2 className='green-5'>Are you an Admin?</h2>
                    <article className='green-5'>
                        <p>Admin privileges include:</p>
                        <ul id='adminul'>
                            <li>Viewing and analyzing data</li>
                            <li>Performing administrative tasks</li>
                        </ul>
                    </article>
                </Link>
            </div>
        </section>
    )

    return dev

}