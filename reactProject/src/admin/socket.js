import io from 'socket.io-client'
const accessToken = localStorage.getItem('access_token')

export default function socket(onDataReceived) {

    const socket = io('http://localhost:8182', {
        transports: ['websocket'],
        query: { token: accessToken }
    })
    
    socket.on('to', async function (data) {
        onDataReceived(data)
    })

    return socket

}
