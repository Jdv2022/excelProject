import { useNavigate , Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react';
import Messages from "./messages";
import AdminDashboard from './adminDashboard';
import './admin.css'

const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrlLogout = `${apiBaseUrl}/admin/logout`
const endpointUrlSession = `${apiBaseUrl}/session`

export default function Admin(){

    const location = useLocation()
    const navigate = useNavigate()
    useEffect(()=>{
        apiSession()
        async function apiSession(){
            try {
                const response = await fetch(endpointUrlSession, {
                    method: 'POST'
                });
                if (response.ok) {
                    const text = await response.text()
                    const viewData = text ? JSON.parse(text) : {}
                    if(!viewData.response){
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
    },[])
    async function logOutAdmin(){
        try{
            const response = await fetch(endpointUrlLogout,{
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

    return (
        <div className="mainAdmin">
                <header>
                    <Link to={'/admin'} id="homeAdmin">Home</Link>
                    <Link to={'/admin/messages'} id="homeMessages">Messages</Link>
                    <Link to={'#'} id="logoutAdmin" onClick={logOutAdmin}>Log out</Link>
                </header>
                {(location.pathname == '/admin') && <AdminDashboard />}
                {(location.pathname == '/admin/messages') && <Messages />}
        </div>
    )

}
