import Api from './dashBoardApi';
import FileUpload from './fileUpload';

export default function apiData(){
    const Data = Api()
    const uploadFile = FileUpload()
    const newData = (
        <div>
            {Data}
            {uploadFile}
        </div>
    )
    return newData
}
