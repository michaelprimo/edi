import { useEffect } from "react";
import { checkRuleCondition, getValuefromSkill, getTargetForSkill, shuffleObjects, validateData, runEngine } from '.././engine/engine.js';

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
            executeTurn = runEngine(JSONData);
            console.log(`Il gruppo ${executeTurn[0][0][0].battlerType} ha perso in ${executeTurn[1]} turni`);
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

