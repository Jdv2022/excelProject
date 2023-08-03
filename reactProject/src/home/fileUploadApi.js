const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const endpointUrl = `${apiBaseUrl}/api/uploadfile`

export default async function FileUpload(file) {
    try {
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch(endpointUrl, {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const text = await response.text()
            const viewData = text ? JSON.parse(text) : {}
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
