import { useState, useEffect } from 'react'
import './display.css'

type PaginationProps = {
    data: any;
    handleSelectedColumns: (columns: number[]) => void;
}

/* Docu: This Function renders the data from fileUploadApi.tsx into a table
*/
export default function Pagination({ data, handleSelectedColumns }: PaginationProps){
    const [renderedData, setRenderedData] = useState<JSX.Element | null>(null)
    const [selectedColumn, setSelectedColumns] = useState<number[]>([])
    const [index, setIndex] = useState<number[]>([])
    
    function handleSelect(index: string) {
        function arr(prevSelectedColumns: any){
            if (prevSelectedColumns.includes(index)) {
                // Remove the index from the array if it's already selected
                return prevSelectedColumns.filter((i:any) => i !== index)
            } 
            else {
                // Add the index to the array if it's not already selected
                return [...prevSelectedColumns, index]
            }
        };
        setSelectedColumns(arr)
    }

    function handleIndex(index: number) {
        function arr(prevSelectedColumns: any){
            if (prevSelectedColumns.includes(index)) {
                // Remove the index from the array if it's already selected
                return prevSelectedColumns.filter((i:any) => i !== index)
            } 
            else {
                // Add the index to the array if it's not already selected
                return [...prevSelectedColumns, index]
            }
        };
        setIndex(arr)
    }

    useEffect(() => {
        function logic(){
            //execute only if data is recieved
            if (data) {
                const header = data.data[0]
                const body = data.data
                const cellHeader = Object.values(body[0])
                let rowHeader = []
                let rowData = []
                const headerLength = Object.keys(header)
                //this is for header text display, color and alignment. Note: Displays text in right alignment if integer otherwise left alignment
                for(let i =0; i<headerLength.length; i++){
                    const isNumeric = /^(₱|\$)?\d+(\.\d+)?$/.test(cellHeader[i] as any) //validate if string is a numerber
                    rowHeader.push(
                        <th className={`th p-3 border-1                                 
                            ${ index.includes(i) ? 'blue' : 'white' }
                            ${isNumeric ? 'right' : 'text-left'}`} 
                            key={i} onClick={(e) => {
                                e.stopPropagation()
                                handleSelect(headerLength[i])
                                handleIndex(i)
                            }}>
                            {headerLength[i]}
                        </th>
                    )
                }
                //this is for td display, color and alignment. Note: Displays text in right alignment if integer otherwise left alignment
                for(let i=0; i<body.length; i++){
                    const columns = []
                    const cell = Object.values(body[i])
                    for(let j=0; j<cell.length; j++){
                        let fields = cell[j]
                        const isNumeric = /^(₱|\$)?\d+(\.\d+)?$/.test(fields as any) //validate if string is a number 
                        columns.push(
                            <td className={`px-3 text-nowrap border-1  
                            ${ index.includes(j) ? 'blue' : (i%2 == 0 ? 'td1' : 'td2') }
                            ${ isNumeric ? 'right' : 'text-left' }`
                        } key={j}>{fields as any}</td>
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
                )
            }
        }
        logic()
        handleSelectedColumns(selectedColumn)
    }, [selectedColumn, handleSelectedColumns])

    if (!renderedData) {
        return <h1>Loading...</h1>
    } else {
        return (
            <>
                <div>{renderedData}</div>
            </>
        )
    }

}

