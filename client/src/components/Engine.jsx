import { useState, useEffect } from "react";
import { runEngine } from '.././engine/engine.js';
import { validateData } from '.././engine/validateData.js';

export default function Engine({ JSONData }) 
{

    const [logs, setLogs] = useState([]);

    useEffect(() => {

    let executeTurn;
    //let checkValidation = validateData(JSONData);
    let gameLogs = 
    {
        "textLogs": [],
        "winners": []
    };
    
    let checkValidation = true;
    if(checkValidation === true)
    {
        for(let i = 0; i<1; i++)
        {
            //fare che una variabile prende i turni trascorsi e l'altra i risultati della partita
            gameLogs.textLogs.push(`Simulazione ${i+1}`);
            executeTurn = runEngine(JSONData, gameLogs);
            //console.log(executeTurn);
            if(executeTurn !== null)
            {
                console.log("il gruppo ", executeTurn[0].winners[0].battlerType , " vince");
            }
            else
            {
                console.log("lol");
            }
            //console.log(`Il gruppo ${executeTurn.winners[0]} ha vinto`);
        }
        setLogs(gameLogs.textLogs);
    }
    else
    {
        console.warn(checkValidation);
    }
    
}, []);

    return (
        <>
            <div>{logs.map((log, i) => <p key={i}>{log}</p>)}</div>
        </>
    )

    
}

