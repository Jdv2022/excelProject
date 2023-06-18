import React, { ReactNode } from 'react';

const defaultValue = ''

interface MyContextProviderProps {
    children: ReactNode;
}

const MyContext = React.createContext(defaultValue);

export function MyContextProvider({ children }: MyContextProviderProps) {
    // Define the state or data you want to share
    const sharedData = 'Hello, Context!';
  
    // Return the context provider with the value
    return (
        <MyContext.Provider value={sharedData}>
            {children}
        </MyContext.Provider>
    )
}

export default MyContext