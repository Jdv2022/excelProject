import Csrf from './csrf';

export default async function FileUpload(file: any) {
    const security = await Csrf()
    try {
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch('http://localhost:8000/uploadfile/', {
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
