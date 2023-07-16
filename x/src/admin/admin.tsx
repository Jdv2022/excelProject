import { useEffect, useState } from "react";
import './admin.css'
import { useNavigate , Link } from 'react-router-dom'

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function Admin(){

    const [data, setData] = useState<any>(null)
    const [mainMsg, setMainMsg] = useState<any>(null)
    const [color, setColor] = useState<any>(null)
    const [id, setId] = useState<any>(null)
    const [bool, setBool] = useState<boolean>(false)
    const navigate = useNavigate()
    //initial render
    useEffect(()=>{
        async function api(){
            try {
                const response = await fetch('http://localhost:8081/messages', {
                    method: 'POST'
                });
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
        async function apiSession(){
            try {
                const response = await fetch('http://localhost:8081/session', {
                    method: 'POST'
                });
                if (response.ok) {
                    const text = await response.text()
                    const viewData = text ? JSON.parse(text) : {}
                    if(viewData.response){
                        await api()
                    }
                    else{
                        navigate('/home/admin/login')
                    }
                } 
                else {
                    throw new Error('Request failed')
                }
            } 
            catch (error) {
                console.error(error);
            }    
        }
        apiSession()
    },[id])
    //render when delete
    useEffect(()=>{
        const deleteButton = document.getElementById('deleteADmin') as HTMLFormElement
        const deleteAdmin = async ()=>{
            setBool(false)
            try{
                const response = await fetch(`http://localhost:8081/delete`,{
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
        if(!id)return
        deleteButton.addEventListener('click', deleteAdmin)
        return () => {
            deleteButton.removeEventListener('click', deleteAdmin)
        }
    },[id])
    async function logOutAdmin(){
        try{
            const response = await fetch(`http://localhost:8081/admin/logout`,{
                method: 'POST',
            })
            if(response.ok){
                navigate('/home')
            }
            else{
                throw new Error('Request failed')
            }
        }
        catch(error){
            console.log(error);
        }
    }
    function date(params: any){
        const d = new Date(params)
        const month = MONTHS[d.getMonth()]
        const day = d.getDate()
        const yr = d.getFullYear()
        
        const displayD ='Date:  ' + month + ' ' + day + ', ' + yr  
        return displayD
    }
    function time(params: any){
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
    function selectMessage(params:any){
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
        <aside id="asideAdmin">
            <h3>Messages List</h3>
            {data?data.map((item: any, index: number)=>(
                <div key={index} className={index == color?"asideperMessageAdmin color":"asideperMessageAdmin"} onClick={() => {selectMessage(index)}}>
                    <p className="asidetextAdmin">Title: {item.title}</p>
                    <p className="asidetextAdmin">{date(item['created@'])}</p>
                    <p className="asidetextAdmin">{time(item['created@'])}</p>
                </div>
            )):<></>}
        </aside>
    )
    if(data){
        return (
            <div className="mainAdmin">
                <header>
                    <Link to={'/home'} id="homeAdmin">Home</Link>
                    <Link to={'#'} id="logoutAdmin" onClick={logOutAdmin}>Log out</Link>
                </header>
                <section>
                    <main id="mainAdmin">
                        {bool && mainMsg}
                    </main>
                    {aside}
                </section>
            </div>
        )
    }
    else{
        return <></>
    }

}