const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/api/worldtour`
export default async function Api(){
    try {
        const response = await fetch(endpointUrl, {
            method: 'GET'
        })
        if (response.ok) {
            const viewData = await response.json()
            return viewData
        } 
        else {
            throw new Error('Request failed')
        }
    } 
    catch (error) {
        if( error.response ){
            console.log(error.response.data); // => the response payload 
        }
    }
    return null // Return your desired JSX or component here if needed
}