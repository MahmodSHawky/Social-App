import React from 'react'
import { createContext } from 'react'
import { useState } from 'react';


export const CounterContext = createContext();


export default function CounterContextProvider (props) {
    
    const [counter, setcounter] = useState(10)


    return <CounterContext.Provider value={{counter, setcounter}}>
        {props.children}
    </CounterContext.Provider>
}