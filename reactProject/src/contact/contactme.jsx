import { useEffect, useState } from 'react'
import './contactme.css'
import Messages from './mes'
import Bugs from './bug'
import Admins from './admin'
import { useNavigate } from 'react-router-dom'

const QUERY = {
    'message': Messages,
    'bug': Bugs,
    'admin': Admins,
}

export default function ContactMe(){

    const [display, setDisplay] = useState('none')
    const [render, setRender] = useState(null)
    const [data, setData] = useState(null)
    const [border, setborder] = useState(null)
    const navigate = useNavigate()

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
            setData(res)
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
        <div id='mesform' className={`bluetheme ${border}`} >
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
        </div>
    )

    const bug = (
        <div id='mesform' className={`redtheme ${border}`} >
            <span className='close' onClick={handleClose}>X</span>
            <form id='bug'>
                <label htmlFor="mesname">Your name</label>
                <input type="text" id="mesname" className='block' name='name' placeholder={data && data.name?data.name:''}/>
                <label htmlFor="mestitle">Bug</label>
                <input type="text" id="mestitle" className='block' name='bug' placeholder={data && data.bug?data.bug:''}/>
                <label htmlFor="mestext">Description</label>
                <textarea id="mestext" name='message' placeholder={data && data.message?data.message:''}/>
                <input type='submit' className='submit block'/>
            </form>
        </div>
    )

    const ad = (
        <div id='mesform' className={`greentheme ${border}`} >
            <span className='close' onClick={handleClose}>X</span>
            <form id='admin'>
                <label htmlFor="mesname">Username</label>
                <input type="text" id="mesname" className='block' name='username' />
                <label htmlFor="mestitle">Password</label>
                <input type="password" id="mestitle" className='block' name='password' />
                <input type='submit' className='submit'/>
            </form>
            {data?data:''}
        </div>
    )

    const selection = {
        'message': message,
        'bug': bug,
        'admin': ad
    }

    const dev = (
        <div id='contactme'>
            {render && selection[render]}
            <div id='mesC' onClick={() => handleSelected('message')}>
                <h2 className='contactblue'>Message Me</h2>
                <div className='contactmetext'>
                    <p>Can't find what you're looking for? Send me a message, and I'll be happy to customize and create it for you! Click here.</p>
                </div>
            </div>
            <div id='bugC' onClick={() => handleSelected('bug')}>
                <h2 className='contactred'>Report a bug</h2>
                <div className='contactmetext' >
                    <p>If you've encountered a bug or issue with our application, please let us know. Your feedback is valuable in helping us improve your experience. Click here.</p>
                </div>
            </div>
            <div id='adC' onClick={() => handleSelected('admin')}>
                <h2 className='contactgreen'>Are you an Admin?</h2>
                <div className='contactmetext'>
                    <p>Admin privileges include:</p>
                    <ul id='adminul'>
                        <li>Viewing and analyzing data</li>
                        <li>Performing administrative tasks</li>
                    </ul>
                </div>
            </div>
        </div>
    )

    return dev

}