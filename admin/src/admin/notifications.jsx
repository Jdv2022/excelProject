import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/messages`
const update = `${apiBaseUrl}/update`
const endpointUrlDelete = `${apiBaseUrl}/delete`

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const def = (
    <div id="msg" className="hide-scrollbar">
        <h5>Title:</h5>
        <h5>Name:</h5>
        <h5>Date:</h5>
        <h5>Time:</h5>
        <p>Content:</p>
    </div>
)


export default function Notification(){

    const [data, setData] = useState(null)
    const [color, setColor] = useState(null)
    const [mainMsg, setMainMsg] = useState(def)
    const [id, setId] = useState(null)

    useEffect(()=>{
        if( !data ){
            api()
        }
    },[])
    //render when delete
    useEffect(()=>{

    },[data, id])

    async function deleteAdmin(params){
        try{
            const response = await fetch(endpointUrlDelete,{
                method: 'DELETE',
                body: params.toString(),
            })
            if(response.ok){
                const text = await response.text()
                const viewData = text ? JSON.parse(text) : {}
                setData(viewData.response)
                setMainMsg(def)
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

    async function put(params){
        try {
            const response = await fetch(update, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
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
    
    async function selectMessage(params, params2){
        if(params2.read == 0){
            await put(params2.id)
        }
        const msg = (
            <div id="msg" className="hide-scrollbar">
                <h5>Title: {data ? data[params].title:'Nothing selected'}</h5>
                <h5>Name: {data ? (data[params].name):'Nothing selected'}</h5>
                <h5>Date: {data ? date(data[params]['created@']):'Nothing selected'}</h5>
                <h5>Time: {data ? time(data[params]['created@']):'Nothing selected'}</h5>
                <p>Content: {data ? (data[params].message):'Nothing selected'}</p>
                <span id="deleteADmin" onClick={()=>{deleteAdmin(params2.id)}}>Delete</span>
            </div>
        )
        setColor(params)
        setMainMsg(msg)
        setId(params2.id)
    }

    function date(params){
        const d = new Date(params)
        const m = d.getMonth() + 1
        const da = d.getDate()
        const ye = d.getFullYear()
        const dis = m + '/' + da + '/' + ye
        return dis
    }

    const aside = (
        <div className="hide-scrollbar" >
            <h3>Messages</h3>
            <aside className="hide-scrollbar">
                {
                    data?data.map((item, index)=>(
                        <div key={index} className={index == color?'color':''} onClick={() => {selectMessage(index, item)}}>
                            <p className={`asidetextAdmin ${item.read == 0 ? 'unread' : ''}${index == color?'color':''}`}>
                                <span>{item.read == 0 ? 'Unread':'Seen'}</span>
                                <span>{item ? date(item['created@']):''}</span>
                            </p>
                        </div>
                    )):<></>
                }
            </aside>
        </div>
    )

    return (
        <div id="messagesTextAdminContainer">
            {mainMsg}
            {aside}
        </div>
    )
}