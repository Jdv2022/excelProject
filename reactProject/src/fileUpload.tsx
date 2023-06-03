import { useState } from 'react';
import Csrf from './csrf';

export default function FileUpload() {
    const [textInput, setTextInput] = useState('');
    const security = Csrf();

    function handleTextChange(event: any) {
        setTextInput(event.target.value);
    }

    async function handleUpload() {
        console.log(security);
        const formData = new FormData();
        formData.append('text', textInput);

        try {
            const response = await fetch('http://localhost:8000/uploadfile/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': security, // Replace `csrfToken` with the actual CSRF token value
                },
                body: formData,
            });
            if (response.ok) {
                console.log(response);
            } else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return (
        <div>
            <input type="text" value={textInput} onChange={handleTextChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}
