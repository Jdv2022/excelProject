import { useState, useEffect } from 'react';
import fetch from 'isomorphic-fetch';

interface Data {
    name: string;
    age: number;
    occupation: string;
}

export default function Api() {
    const controller = new AbortController();
    const [data, setData] = useState<Data | null>(null);
    useEffect(() => {
        async function fetchData(){
            try {
                const response = await fetch('http://localhost:8000/index/');
                if (response.ok) {
                    const responseData: Data = await response.json();
                    setData(responseData);
                } else {
                    throw new Error('Request failed');
                }
            } 
            catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        return () => {
            // Cleanup function
            controller.abort();
        };
    }, [window.location.pathname]);

    if (data === null) {
            return <div>Loading...</div>;
    }

    return (
        <>
            <h1>{data.name}</h1>
            <p>Age: {data.age}</p>
            <p>Occupation: {data.occupation}</p>
        </>
    );
}


