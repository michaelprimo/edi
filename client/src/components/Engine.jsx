import { useState, useEffect } from "react";
import { runEngine } from '.././engine/engine.js';
import { validateData } from '.././engine/validateData.js';

export default function Engine({ JSONData }) 
{

    const [logs, setLogs] = useState([]);

    useEffect(() => {
    let checkValidation = true;
    if(checkValidation === true)
    {
        for(let i = 0; i < 1; i++)
        {
            let result = runEngine(JSONData);
            let allLogs = [`Simulation ${i+1}`, ...result.logs];
            setLogs(prev => [...prev, ...allLogs]);
            
            if(result.checkRules !== null)
            {
                console.log("il gruppo ", result.checkRules[0].winners[0].battlerType, " vince");
            }
        }
    }
}, []);

    return (
        <>
            <div>{logs.map((log, i) => <p key={i}>{log}</p>)}</div>
        </>
    )

    
}

