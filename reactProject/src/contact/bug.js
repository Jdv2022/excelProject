const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/create-bug`

export default async function Bugs(form){

    try {
        const formData = new FormData(form);
        const response = await fetch(endpointUrl, {
            method: 'POST',
            body: formData,
        })       
        if (response.ok) {
            const text = await response.text()
            const viewData = text ? JSON.parse(text) : {}
            return viewData.response
        } 
        else {
            throw new Error('Request failed')
        }
    } catch (error) {
        console.error(error);
    }

}


