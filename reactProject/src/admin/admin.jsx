import { useNavigate , Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Messages from "./messages"
import AdminDashboard from './adminDashboard'
const accessToken = localStorage.getItem('access_token')
import './admin.css'

const apiBaseUrl = import.meta.env.VITE_NODE_BASE_URL
const endpointUrlLogout = `${apiBaseUrl}/admin/logout`

export default function Admin(){
    
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(()=>{

        if(!accessToken){
            navigate('/home/admin/login')
        }
        else{
            const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
            const tokenExpiration = tokenPayload.exp * 1000; // Convert to milliseconds
        
            if (Date.now() > tokenExpiration) {
                // Token is expired, remove it from storage
                localStorage.removeItem('access_token');
                console.log('Token expired, please re-login');
            } 
            else {
                // Token is still valid, proceed with sending requests
                // ...
            }
        }   
    },[])

    async function logOutAdmin(){
        try{
            const response = await fetch(endpointUrlLogout,{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            })
            if(response.ok){
                localStorage.removeItem('access_token')
                navigate('/home')
            }
            else{
                throw new Error('Request failed')
            }
        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <div className="mainAdmin">
            <header>
                <Link to={'#'} id="logoutAdmin" onClick={logOutAdmin}>Log out</Link>
            </header>
            {(location.pathname == '/admin') && <AdminDashboard />}
        </div>
    )

}
