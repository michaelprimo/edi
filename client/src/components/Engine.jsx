import { useEffect } from "react";
import { checkRuleCondition, getValuefromSkill, getTargetForSkill, shuffleObjects, validateData, runEngine } from '.././engine/engine.js';

export default function Engine({ JSONData }) 
{

useEffect(() => {

    let executeTurn;
    let checkValidation = validateData(JSONData);

    if(checkValidation === true)
    {
        for(let i = 0; i<5; i++)
        {
            executeTurn = runEngine(JSONData);
            console.log(`${executeTurn[0]} ha perso in ${executeTurn[1]} turni`);
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

