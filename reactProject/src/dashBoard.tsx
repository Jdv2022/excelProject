import { useState } from 'react'
import UploadFile from './uploadFile'
import FileUpload from './fileUploadApi'
import Display from './display'
import './uploadFile.css'
import { Route, Routes } from 'react-router-dom'


interface ChildComponentProps {
    onData: (data: any) => void
}

export default function ApiData({ onData }: ChildComponentProps){

    const [api, setApi] = useState<any | null>(null)
    const [selectedData, setSelectedData] = useState<any | null>(null)

    async function uploadedFile(data: any){
        const apiData = await FileUpload(data)
        setApi(apiData)
    }

    function handleSelectedColumns(data: any){
        setSelectedData(data)
    }

    function displayToSidebar(){
        if(api && selectedData){
            const arr = []
            const apiData = api.data
            const rows = selectedData
            for(let i=0; i<apiData.length; i++){
                const obj: { [key: string]: any } = {}
                for(let j=0; j<rows.length; j++){   
                    obj[rows[j]] = apiData[i][rows[j]]
                }
                arr.push(obj)
            }  
            onData(arr)
        }
    }

    const newData = (
        <>  
            <div className='d-block w-100 h-100 maindashboard overflow-y-auto'>
                <Routes>
                    <Route path='' element={api ? (<Display data={api} handleSelectedColumns={handleSelectedColumns} />) : (<h1></h1>)} />
                </Routes>
            </div>
            <div className='mt-3 w-100 d-flex justify-content-between'>
                <button onClick={displayToSidebar}>Generate Table</button>
                <UploadFile fileData={uploadedFile}/>
            </div>
        </>
    )
    return newData
}
