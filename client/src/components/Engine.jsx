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

