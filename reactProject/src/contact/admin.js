const apiBaseUrl = import.meta.env.VITE_NODE_BASE_URL
const endpointUrl = `${apiBaseUrl}/admin/login`
const accessToken = localStorage.getItem('access_token')

export default async function Admins(form){

    try {
        const formData = new FormData(form)
        const formDataString = new URLSearchParams(formData).toString()
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formDataString,
        })       
        if (response.ok) {
            const text = await response.text()
            if (text == 'Incorrect Email or Password') {
                return text
            } 
            else {
                localStorage.setItem('access_token', text)
                localStorage.getItem('access_token') //get it as soon as you set it, because of asynchronous
                return true
            }
        } 
        else {
            throw new Error('Request failed')
        }
    } catch (error) {
        console.error(error)
    }

}



