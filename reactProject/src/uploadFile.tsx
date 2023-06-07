import { useState } from 'react'
import fileUploadApi from './fileUploadApi'
import Pagination from './pagination'
import './uploadFile.css'

export default function UploadFile() {
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [SelectedData, setSelectedData] = useState(null)
    const [title, setTitle] = useState(null)
    
    function handleFileChange(event: any) {
        setSelectedFile(event.target.files[0])
        setUploadSuccess(false)
        setTitle(event.target.files[0].name)
    }

    async function handleUpload() {   
        if (!selectedFile) {
            console.error('No file selected')
            return null
        }
        try {
            const data = await fileUploadApi(selectedFile)
            setSelectedData(data)
            setUploadSuccess(true) // Mark upload as successful
        } catch (error) {
            console.error('Upload failed:', error)
            setUploadSuccess(false) // Mark upload as failed
        }
    }

    return (
        <div className='position1 vh-100 d-flex align-items-end p-3 flex-column justify-content-between maindashboardContainer'>
            {<div id='title'>
                {uploadSuccess ? (
                    <h1>{title}</h1>
                ) : (
                    <h1></h1>
                )}
            </div>}
            {<div className='d-block w-100 h-100 maindashboard overflow-y-auto'>
                {uploadSuccess ? (
                    <Pagination data={SelectedData} />
                ) : (
                    <h1></h1>
                )}
            </div>}
            <div className='mt-3'>
                <span>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Upload</button>
                </span>
            </div>
        </div>
    );
}
