import Csrf from './csrf'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const endpointUrl = `${apiBaseUrl}/api/uploadfile/`

export default async function FileUpload(file: any) {
    const security = await Csrf()
    try {
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'X-CSRFToken': security, 
            },
            body: formData,
        });
        if (response.ok) {
            const viewData = await response.json();
            return viewData.data
        } 
        else {
            throw new Error('Request failed');
        }
    } 
    catch (error) {
        console.error('Error uploading file:', error)
    }
    return null // Return your desired JSX or component here if needed
}