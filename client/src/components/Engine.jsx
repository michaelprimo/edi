import { useEffect } from "react";
import { runEngine } from '.././engine/engine.js';
import { validateData } from '.././engine/validateData.js';

export default function Engine({ JSONData }) 
{

useEffect(() => {

    let executeTurn;
    //let checkValidation = validateData(JSONData);

    let checkValidation = true;
    if(checkValidation === true)
    {
        for(let i = 0; i<1; i++)
        {
            //fare che una variabile prende i turni trascorsi e l'altra i risultati della partita
            executeTurn = runEngine(JSONData);
            console.log(executeTurn[0]);
            console.log(`Il gruppo ${executeTurn[0][0].winners[0].battlerType} ha vinto in ${executeTurn[1]} turni`);
        }
    }
    else
    {
        console.warn(checkValidation);
    }
    
}, []);

    return (
        <>
            
        </>
    )

    
}

