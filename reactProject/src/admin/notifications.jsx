import { useEffect, useState } from "react"
import { useNavigate , Link } from 'react-router-dom'
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/messages`
const endpointUrlDelete = `${apiBaseUrl}/delete`

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function Notification(){

    const [data, setData] = useState(null)
    const [color, setColor] = useState(null)
    const [mainMsg, setMainMsg] = useState(null)
    const [bool, setBool] = useState(false)
    const [id, setId] = useState(null)

    useEffect(()=>{
        if( !data ){
            api()
        }
    },[data])

    //render when delete
    useEffect(()=>{
        const deleteButton = document.getElementById('deleteADmin') 
        if(!id)return
        deleteButton.addEventListener('click', deleteAdmin)
        return () => {
            deleteButton.removeEventListener('click', deleteAdmin)
        }
    },[id])

    async function deleteAdmin(){
        setBool(false)
        try{
            const response = await fetch(endpointUrlDelete,{
                method: 'POST',
                body: id.toString(),
            })
            if(response.ok){
                const text = await response.text()
                const viewData = text ? JSON.parse(text) : {}
                setData(viewData.response)
            }
            else{
                throw new Error('Request failed')
            }
        }
        catch(error){
            console.log(error);
        }
    }

    async function api(){
        try {
            const response = await fetch(endpointUrl, {
                method: 'POST'
            })
            if (response.ok) {
                const text = await response.text()
                const viewData = text ? JSON.parse(text) : {}
                setData(viewData.response)
            } 
            else {
                throw new Error('Request failed')
            }
        } 
        catch (error) {
            console.error(error);
        }    
    }

    function date(params){
        const d = new Date(params)
        const month = MONTHS[d.getMonth()]
        const day = d.getDate()
        const yr = d.getFullYear()
        
        const displayD ='Date:  ' + month + ' ' + day + ', ' + yr  
        return displayD
    }
    function time(params){
        const d = new Date(params)
        let hr = d.getHours()
        const min = d.getMinutes();
        let str = ''
        if(hr > 12){
            hr = hr - 12
            str = ' pm'
        }
        else{
            str = ' am'
        }
        return 'Time: ' + hr + ':' + min + str
    }
    
    function selectMessage(params){
        console.log(params)
        const msg = (
            <>
                <p className="asidetextAdmin mt-1">Title: {data[params].title}</p>
                <p className="asidetextAdmin mt-1">Name: {(data[params].name)}</p>
                <p className="asidetextAdmin mt-1">{date(data[params]['created@'])}</p>
                <p className="asidetextAdmin mt-1">{time(data[params]['created@'])}</p>
                <p className="asidetextAdmin mt-5">Content: {(data[params].message)}</p>
                <Link to={'#'} id="deleteADmin">Delete</Link>
            </>
        )
        if(params == color){
            setColor(-1)
            setBool(false)
        }
        else{
            setColor(params)
            setMainMsg(msg)
            setId(data[params].id)
            setBool(true)
        }
    }

    const aside = (
        <>
            <h3>Messages</h3>
            <aside id="asideAdmin" className="custom-scroll-container">
                {data?data.map((item, index)=>(
                    <div key={index} className={index == color?"asideperMessageAdmin color":"asideperMessageAdmin"} onClick={() => {selectMessage(index)}}>
                        <p className="asidetextAdmin">Title: {item.title}</p>
                    </div>
                )):<></>}
            </aside>
        </>
    )

    return (
        <div id="messagesTextAdminContainer">
            <div>
                {bool && mainMsg}
            </div>
            <div id="messagesTextAdmin">
                {aside}
            </div>
        </div>
    )
}