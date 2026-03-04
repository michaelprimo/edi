import { useEffect } from "react";
import { checkRuleCondition, getValuefromSkill, getTargetForSkill, shuffleObjects, runEngine } from '.././engine/engine.js';

export default function Engine({ JSONData }) 
{

useEffect(() => {

    let executeTurn;

    for(let i = 0; i<5; i++)
    {
        executeTurn = runEngine(JSONData);
        console.log(`${executeTurn[0]} ha perso in ${executeTurn[1]} turni`);
    }
}, []);

    return (
        <>
            
        </>
    )

    
}

