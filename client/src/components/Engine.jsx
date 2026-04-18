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

    let checkValidation = true;

    if (checkValidation === true)
    {
        let winCount = {};
        let loseCount = {};
        let simulations = 100; 

        let allLogs = [];

        for(let i = 0; i < simulations; i++)
        {
            let result = runEngine(JSONData);

            const winnersEntry = result.checkRules?.find(r => r.winners);
            const losersEntry = result.checkRules?.find(r => r.losers);

            if (winnersEntry)
            {
                const winner = winnersEntry.winners[0].battlerType;
                winCount[winner] = (winCount[winner] || 0) + 1;
            }

            if (losersEntry)
            {
                const loser = losersEntry.losers[0].battlerType;
                loseCount[loser] = (loseCount[loser] || 0) + 1;
            }

            allLogs.push(`Simulation ${i+1}`, ...result.logs);
        }

        // winrate calculation
        let winRates = {};

        Object.keys(winCount).forEach(type => {
            winRates[type] = ((winCount[type] / simulations) * 100).toFixed(2);
        });

        // add to log
        allLogs.push("---- WIN RATES ----");

        Object.entries(winRates).forEach(([type, rate]) => {
            allLogs.push(`${type}: ${rate}%`);
        });

        setLogs(allLogs);
    }

}, []);

    return (
        <>
            <div>{logs.map((log, i) => <p key={i}>{log}</p>)}</div>
        </>
    )

    
}

