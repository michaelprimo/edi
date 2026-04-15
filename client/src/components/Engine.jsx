//the core of Edi: we receive the data from the JSON, we run multiple times the fights and we get the results

import { useState, useEffect } from "react";
import { runEngine } from '.././engine/engine.js';
import { validateData } from '.././engine/validateData.js';

export default function Engine({ JSONData }) 
{

    //useful both for putting the number of the current simulation on the logs without passing everytime a 
    //variable for that and being a state we can insert everything in the document/webpage.
    const [logs, setLogs] = useState([]);

    useEffect(() => {

    //this variable is to substitute to "let checkValidation = validateData(JSONData)", so we know if the data is correct before running
    //simulations and getting errors
    let checkValidation = true;
    if(checkValidation === true)
    {
        //we can put the amount of simulations we want.
        console.warn("put in Engine.jsx a winrate calculator, getting winners and losers from each simulations");
        for(let i = 0; i < 1; i++)
        {
            //get the data and run Edi
            let result = runEngine(JSONData);
            //set the logs
            let allLogs = [`Simulation ${i+1}`, ...result.logs];
            setLogs(prev => [...prev, ...allLogs]);
        }
    }
}, []);

    return (
        <>
            <div>{logs.map((log, i) => <p key={i}>{log}</p>)}</div>
        </>
    )

    
}

