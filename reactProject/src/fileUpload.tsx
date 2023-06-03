import { useState } from 'react';
import Csrf from './csrf';

export default function FileUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const security = Csrf();

    function handleFileChange(event: any) {
        setSelectedFile(event.target.files[0]);
    }

    async function handleUpload() {
        if (!selectedFile) {
            console.error('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:8000/uploadfile/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': security, 
                },
                body: formData,
            });
            if (response.ok) {
                console.log('File uploaded successfully');
            } 
            else {
                throw new Error('Request failed');
            }
        } 
        catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}