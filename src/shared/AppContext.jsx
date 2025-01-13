import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [fs, setFs] = useState(null); // The full file system
    const [currentDirectory, setCurrentDirectory] = useState(null); // The current directory object
    const [currentPath, setCurrentPath] = useState("/"); // String to hold the current path
    const [output, setOutput] = useState([]); // Output state to hold terminal messages
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    
    return (
        <AppContext.Provider value={{
            fs,
            setFs,
            currentDirectory,
            setCurrentDirectory,
            currentPath,
            setCurrentPath,
            output,
            setOutput,
            currentProblemIndex,
            setCurrentProblemIndex
        }}>
            {children}
        </AppContext.Provider>
    )
}


export const useAppContext = () => {
    return useContext(AppContext);
}