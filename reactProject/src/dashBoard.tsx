import uploadFile from './uploadFile'

export default function ApiData(){
    const myUploadFile = uploadFile()
    const newData = (
        <>
            {myUploadFile}
        </>
    )
    return newData
}
