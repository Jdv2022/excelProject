import Papa from 'papaparse'
import FileUpload from '../graphs/process/fileuploadAapi'
export default async function convertToJson(file){
    let data 
    let extention = ''
    const file_name = file.name

    //reads the file
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const csvData = reader.result
                Papa.parse(csvData, {
                    complete: (result) => {
                        resolve(result.data)
                    },
                    header: true, // Set to true if the first row contains headers
                })
            }
            reader.onerror = (event) => {
                reject(event.target.error)
            }
            reader.readAsText(file)
        })
    }
    async function handleFileChange(file) {
        try {
            const data = await readFileAsText(file)
            return data
        } catch (error) {
            console.error('Error reading file:', error)
        }
    }

    for (let i = file_name.length-1 ; i >= 0; i--) {
        extention = file_name[i] + extention
        if(file_name[i] == '.'){
            break
        }
    }

    if(extention == '.csv'){
        data = await handleFileChange(file)
    }
    else if(extention == '.xlsx'){
        data = await FileUpload(file)
    }

    return data
    
}