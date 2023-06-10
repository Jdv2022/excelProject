import { useEffect } from 'react'

type GraphOneProps = {
    renderAsGraphData: (data: string) => void;
  };
  
  export default function GraphOne({ renderAsGraphData }: GraphOneProps) {
    useEffect(() => {
      renderAsGraphData('holaaa');
    }, []);
  
    return <h1></h1>;
  }
  