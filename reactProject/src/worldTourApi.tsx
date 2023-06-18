export default async function Api(){

    try {
        const response = await fetch('http://localhost:8000/api/worldtour/', {
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