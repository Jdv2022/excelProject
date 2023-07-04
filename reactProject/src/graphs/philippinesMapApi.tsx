/* PH map data used for render */
export default async function PhilippinesMapApi(){

    try {
        const response = await fetch('http://localhost:8000/api/ph/', {
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