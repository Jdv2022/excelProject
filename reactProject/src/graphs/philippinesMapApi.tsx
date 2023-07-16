const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const endpointUrl = `${apiBaseUrl}/api/ph/`

/* PH map data used for render */
export default async function PhilippinesMapApi(){

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
    catch (error: any) {
        if( error.response ){
            console.log(error.response.data); // => the response payload 
        }
    }
    return null // Return your desired JSX or component here if needed

}