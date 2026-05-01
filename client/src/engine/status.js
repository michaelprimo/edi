import { resolveStatusTargets } from "./target";

//vedere se creare una variabile temporanea come originalCharacterstats può aiutare
export function checkStatus(data, character, statusTrigger) 
{
    for(let i=0; i<character.length;i++)
    {
        
        if(character[i].status === undefined || character[i].status.length <= 0)
        {
            continue;
        }
        else
        {
            
            character[i].status.sort(
            (a,b)=>(b.priority ?? 100) - (a.priority ?? 100)
            );
           
            character[i].status.forEach(status => 
            {
                if(status.effects === undefined) return;
                for(let j = 0; j<status.effects.length; j++)
                {
                    if(status.trigger === statusTrigger)
                    {   
                        
                        if(status.effects[j].stat !== undefined)
                        {
                            if(status.applyOnce === true) {
                                
                               
                                const originalCharacter = data.characters.find(b => b.id === character[i].id);

                                if (originalCharacter) 
                                {
                                    
                                    let baseValue = originalCharacter.stats[status.effects[j].stat];
                                  
                                    character[i].stats[status.effects[j].stat] = baseValue;
                                } 
                                else 
                                {
                                    console.error("Non ho trovato il character con ID:", character[i].id, "dentro data.characters");
                                }
                        }

                        for(let y = 0; y < status.stacks; y++)
                        {
                            
                            switch(status.effects[j].operator)
                            {
                                case "+":
                                {
                                    character[i].stats[status.effects[j].stat] += status.effects[j].value;
                                    
                                    break;
                                }
                                case "-":
                                {
                                    character[i].stats[status.effects[j].stat] -= status.effects[j].value;
                                    
                                    break;
                                }
                                case "*":
                                {
                                    character[i].stats[status.effects[j].stat] *= status.effects[j].value;
                                    
                                    break;
                                }
                                case "/":
                                {
                                    character[i].stats[status.effects[j].stat] /= Math.floor(status.effects[j].value);
                                    
                                    break;
                                }
                                case "=":
                                {
                                    character[i].stats[status.effects[j].stat] = status.effects[j].value;
                                    break;
                                }
                            }  
                        }
                            
                        }
                    }

                    if(status.repelStatus !== undefined)
                    {
                        character[i].status = character[i].status.filter(s => !status.repelStatus.includes(s.name));
                    }
                    
                    if(status.turns > 0 && statusTrigger == "onTurnEnd")
                    {
                        if(status.applyOnce === true)
                        {
                            character[i].checkStatusParams.push(status.effects[j].stat);
                        }
                        status.turns--;
                    }
                }
            });
            character[i].status = character[i].status.filter(s => s.turns !== 0 && s.stacks !== 0);
                 
        }
    } 
}

export function applyTargetStatusFromSkillEffect(dataStatus, selectedSkill, character, chooseTarget, currentCharacters, logger)
{
    //here we store the statuses of the skill to apply or remove to the target.
    let statusAddedFromSkill;
    //-------------------------------copy of statusAddedFromSkill, we check if this is worth it to maintain or remove it
    let statusInstance;
    //we work here with statuses to apply or remove from the skill
    const applyStatusSource = selectedSkill.applyStatus;
    //we make sure the final result is always an array
    const applyStatusEntries = applyStatusSource
        ? (Array.isArray(applyStatusSource) ? applyStatusSource : [applyStatusSource])
        : [];
    
    if(applyStatusEntries.length > 0)
    {
        for(const applyStatusEntryRaw of applyStatusEntries)
        {
            
            const applyStatusEntry = typeof applyStatusEntryRaw === "string"
                ? { nameStatus: applyStatusEntryRaw }
                : applyStatusEntryRaw;
            if(!applyStatusEntry?.nameStatus) continue;

            //let's store the status applied by the skill
            statusAddedFromSkill = dataStatus.find(chosenStatus => chosenStatus.name === applyStatusEntry.nameStatus);
            if(!statusAddedFromSkill) continue;

            //let's find the targets of this status...
            const statusTargets = resolveStatusTargets(applyStatusEntry.target, character, chooseTarget, currentCharacters);
            //...and let's add the status
            for(const statusTarget of statusTargets)
            {
                if(!statusTarget.status) statusTarget.status = [];

                //let's check if the target have the status so we see how to add stacks and the status as well
                const checkIfStatusExists = statusTarget.status.find(findStatus => findStatus.name === applyStatusEntry.nameStatus);
                let stacksToAdd;
                
                //no status? let's add it
                if(checkIfStatusExists === undefined)
                {
                    stacksToAdd = applyStatusEntry.stacks ?? 1;
                    statusInstance = structuredClone(statusAddedFromSkill);
                    if(!statusInstance.stacks) statusInstance.stacks = 0;
                    statusInstance.stacks += stacksToAdd;

                    if(statusInstance.maxStacks !== undefined && statusInstance.stacks > statusInstance.maxStacks)
                    {
                        statusInstance.stacks = statusInstance.maxStacks;
                    }
                    statusTarget.status.push(statusInstance);
                }
                //just update the status
                else
                {
                    stacksToAdd = applyStatusEntry.stacks ?? 0;

                    if(!checkIfStatusExists.stacks) checkIfStatusExists.stacks = 0;

                    checkIfStatusExists.stacks += stacksToAdd;
                    if(checkIfStatusExists.maxStacks !== undefined && checkIfStatusExists.stacks > checkIfStatusExists.maxStacks)
                    {
                        checkIfStatusExists.stacks = checkIfStatusExists.maxStacks;
                    }

                    if(statusAddedFromSkill.turns !== undefined && statusAddedFromSkill.turns >= 0)
                    {
                        checkIfStatusExists.turns = statusAddedFromSkill.turns;
                    }
                }
            }
        }
    }

    
}

export function removeTargetStatusFromSkillEffect(selectedSkill, character, chooseTarget, currentCharacters, logger)
{
    const removeStatusEntries = selectedSkill.removeStatus
        ? (Array.isArray(selectedSkill.removeStatus) ? selectedSkill.removeStatus : [selectedSkill.removeStatus])
        : [];
    if(removeStatusEntries.length > 0)
    {
        for(const removeStatusEntryRaw of removeStatusEntries)
        {
            let removeStatusName;
            let stacksToRemove;

            if(typeof removeStatusEntryRaw === "string")
            {
                removeStatusName = removeStatusEntryRaw;
            }
            else
            {
                removeStatusName = removeStatusEntryRaw?.nameStatus;
                stacksToRemove = removeStatusEntryRaw?.stacks;
            }

            if(!removeStatusName) continue;

            const removeTargetMode = typeof removeStatusEntryRaw === "object" ? removeStatusEntryRaw?.target : undefined;
            const statusTargets = resolveStatusTargets(removeTargetMode, character, chooseTarget, currentCharacters);
            for(const statusTarget of statusTargets)
            {
                if(!statusTarget.status || statusTarget.status.length === 0) continue;

                const statusToRemove = statusTarget.status.find(findStatus => findStatus.name === removeStatusName);
                if(!statusToRemove) continue;

                if(stacksToRemove === undefined || stacksToRemove === null)
                {
                    statusTarget.status = statusTarget.status.filter(s => s.name !== removeStatusName);
                }
                else
                {
                    if(!statusToRemove.stacks) statusToRemove.stacks = 0;
                    statusToRemove.stacks -= stacksToRemove;

                    if(statusToRemove.stacks <= 0)
                    {
                        statusTarget.status = statusTarget.status.filter(s => s.name !== removeStatusName);
                    }
                }
            }
        }
    }
}

