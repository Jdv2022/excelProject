import './verticalbar.css'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { VERTICALBAR } from '../home/home'
/* Renders the table */
export default function DashBoard(){

    const valueFromHome = useContext(VERTICALBAR)
    const [header, setHeader] = useState([])
    const [body, setBody] = useState([])

    useEffect(()=>{
        function dataConvert(){
            let newBody = []
            const headers = valueFromHome.data0[0]
            const dataLength = valueFromHome.data0.length
            const newHead = Object.keys(headers)
            setHeader(newHead)
            for(let i=0; i<dataLength; i++){
                const obj = Object.values(valueFromHome.data0[i])
                newBody.push(obj)
            }
            setBody(newBody)
        }
        if(!valueFromHome) return
        dataConvert()
    },[valueFromHome])
    const renderTable = (
        <table>
            <thead className="position-sticky top-0">
                <tr>
                    {header.map((item,index) => (
                        typeof valueFromHome.data0[index][item] != 'object' ? (<th key={item} className='greydark borderCustom' >{item}</th>) : null
                    ))}
                </tr>
            </thead>
            <tbody>
                {body.map((bodyData, index) => (
                    <tr key={index} className={(index%2==0)?'greylight':'grey'} >
                        {bodyData.map((item, index) => (
                            typeof item != 'object' ? (<td key={index} className='borderCustom'>{item}</td>) : null
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
    return (
        <div>
            {renderTable}
        </div>
    )

}