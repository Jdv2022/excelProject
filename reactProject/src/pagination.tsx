import { useState, useEffect } from 'react'
import './pagination.css'
/* Docu: This Function renders the data from fileUploadApi.tsx into a table
*/
export default function Pagination(data?: any) {
    const [renderedData, setRenderedData] = useState<JSX.Element | null>(null)
    useEffect(() => {
        function logic(){
            //execute only if data is recieved
            if (data) {
                const header = data.data.data[0]
                const body = data.data.data
                const cellHeader = Object.values(body[0])
                let rowHeader = []
                let rowData = []
                const headerLength = Object.keys(header)
                //this is for header text display, color and alignment. Note: Displays text in right alignment if integer otherwise left alignment
                for(let i =0; i<headerLength.length; i++){
                    const isNumeric = /^\d+$/.test(cellHeader[i] as any) //validate if string is a numerber
                    rowHeader.push(<th className={`th p-3 border-1 ${isNumeric ? 'right' : 'text-left'}`} key={i} onClick={() => console.log('x')}>{headerLength[i]}</th>)
                }
                //this is for td display, color and alignment. Note: Displays text in right alignment if integer otherwise left alignment
                for(let i=0; i<2; i++){
                    const columns = []
                    const cell = Object.values(body[i])
                    for(let j=0; j<cell.length; j++){
                        let fields = cell[j]
                        const isNumeric = /^\d+$/.test(fields as any) //validate if string is a number 
                        columns.push(
                            <td className={`px-3 text-nowrap border-1 ${ i%2 == 0 ? 'td1' : 'td2' } ${ isNumeric ? 'right' : 'text-left' }`} key={j} onClick={() => console.log('x')}>{fields as any}</td>
                        )
                    }
                    rowData.push(<tr key={i}>{columns}</tr>)
                }
                setRenderedData(
                    <table>
                        <thead className="position-sticky top-0">
                        <tr>{rowHeader}</tr>
                        </thead>
                        <tbody>{rowData}</tbody>
                    </table>
                );
            }
        }
        logic() //call
    }, [data])
    //return
    if (!renderedData) {
        return <h1>Loading...</h1>
    } else {
        return <div>{renderedData}</div>
    }

}

