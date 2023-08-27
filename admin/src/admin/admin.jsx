import { useNavigate , Link, useLocation } from 'react-router-dom'
import { useEffect, useState, createContext } from 'react'
import AdminDashboard from './adminDashboard'
import io from 'socket.io-client'
import './admin.css'

const apiBaseUrl = import.meta.env.VITE_NODE_BASE_URL
const endpointUrlLogout = `${apiBaseUrl}/admin/logout`
const trafficendpoint = `${apiBaseUrl}/admin/traffic`
export const socketData = createContext(null)

export default function Admin(){
    
    const location = useLocation()
    const navigate = useNavigate()
    const [accessToken, setaccessToken] = useState(localStorage.getItem('access_token'))
    const [data, setData] = useState(null)
    if(!accessToken){
        navigate('/admin/login')
    }
    useEffect(()=>{
        let mySocket
        if(!accessToken){
            navigate('/admin/login')
        }
        else if(!data){
            if(mySocket){
                mySocket.disconnect()
            }
            initialGet()
        }
        else{
            const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]))
            const tokenExpiration = tokenPayload.exp * 1000 // Convert to milliseconds
        
            if (Date.now() > tokenExpiration) {
                // Token is expired, remove it from storage
                localStorage.removeItem('access_token')
                setaccessToken(false)
                console.log('Token expired, please re-login')
                navigate('/admin/login')
            } 
            else {
                mySocket = io('http://localhost:8182', {
                    transports: ['websocket'],
                    query: { token: accessToken }
                })
                mySocket.on('to', async function (data) {
                    setData(data)
                })
            }
        }  

        if(!mySocket) return
        return () => {
            mySocket.disconnect()
        } 
    },[data])
    
    async function initialGet(){
        try{
            const response = await fetch(trafficendpoint,{
                method: 'GET',
            })
            if(response.ok){
                const result = await response.json()
                setData(result)
            }
            else{
                throw new Error('Request failed')
            }
        }
        catch(error){
            console.log(error)
        }
    }

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
                navigate('/admin/login')
            }
            else{
                throw new Error('Request failed')
            }
        }
        catch(error){
            console.log(error)
        }
    }

    const dashboard = (
        <socketData.Provider value={data}>
            <AdminDashboard />
        </socketData.Provider>
    )

    return (
        <div id="mainAdmin">
            <header>
                <Link to={'#'} id="logoutAdmin" onClick={logOutAdmin}>Log out</Link>
            </header>
            {(location.pathname == '/admin/dashboard') && dashboard }
        </div>
    )

}
