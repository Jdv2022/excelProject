import { useState } from 'react'
import './uploadFile.css'

type GraphOneProps = {
    fileData: (data: string) => void;
};

export default function UploadFile({ fileData }: GraphOneProps) {
    const [selectedFile, setSelectedFile] = useState(null)
    
    function handleFileChange(event: any) {
        setSelectedFile(event.target.files[0])
    }

    function handleUpload() {   
        if (!selectedFile) {
            console.error('No file selected')
            return null
        }
        fileData(selectedFile)
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}
