import * as math from 'mathjs';

export function chooseSkill(availableSkills, battler, currentBattlers) 
{
    console.log("battler.agent:", battler.agent, " availableSkills:", availableSkills);

    if(battler.agent)
    {
        let sortAgentRules = battler.agent.sort((a,b) => a.priority <= b.priority);
        let skillChosenID;
        let confirmSkillExists;

        for(let i = 0; i< sortAgentRules.length; i++)
        {
            console.log("quarta fase: vedere se la skill esiste nello skillset. Se non c'è e si vede solo nell'agente allora in automatico si salta");
            confirmSkillExists = checkIfSkillIsAvailable(sortAgentRules[i], availableSkills);
            console.log("quarta fase: confirmSkillExists: ", confirmSkillExists);

            if(confirmSkillExists)
            {
                console.log("questa skill esiste, procedo con questa condizione");
                console.log("quinta fase: controllare in ordine di priorità la skill da scegliere");
                console.log("quinta fase: ci sono delle availableSkills? ", availableSkills);
                //stai passando l'index della regola, da stare attenti con l'index di availableSkills.
                skillChosenID = checkActionsfromPriority(sortAgentRules[i], battler, currentBattlers, availableSkills);
                console.log("quinta fase: skillChosenID: ", skillChosenID);
                if(skillChosenID >= 0)
                {
                    i = sortAgentRules.length;
                    return skillChosenID;
                }
            }
            else
            {
                console.log("questa skill non esiste, vado alla prossima condizione");
            }

        }
    }
    else
    {
        
        let randomIdSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)].id;
        console.log("nessun battler.agent! randomIdSkill è: ", randomIdSkill);
        return randomIdSkill; 
    }

       
}


function checkActionsfromPriority(rule, battler, currentBattlers, availableSkills)
{
    console.log("rule: ", rule);
    console.log("rule.chance:", rule.chance);
    console.log("checkActionsFromConditions availableSkills:", availableSkills);
    
    
    let rolld100 = math.randomInt(100);
    let skillFromAction = availableSkills.find(skill => skill.name === rule.action);
    let actionChecked;
    console.log("sesta fase: si fa un check di chance per vedere se passa la condizione o meno");
    if(rolld100 <= rule.chance)
    {
        console.log("É uscito ", rolld100, "! Puoi eseguire la condizione");
        
        actionChecked = checkActionsFromConditions(rule,battler,currentBattlers);
        console.log("sesta fase: actionChecked", actionChecked);
        
        if(actionChecked === true || actionChecked === undefined)
        {
            console.log("actionChecked: ", actionChecked, " . Puoi procedere.");
            return skillFromAction.id;
        }
        else
        {
            console.log("actionChecked: ", actionChecked, " . Condizione non esaudita.");
        }
    }
    else
    {
        console.log("É uscito ", rolld100, ". Non puoi eseguire la condizione");
    }
}

function checkActionsFromConditions(rule, battler, currentBattlers)
{
    console.log("settima fase: si fa un check di condizioni delle azioni. Se non ce ne sono, l'azione passa di default, altrimenti si continua");
    let verifyCondition;
    if(rule.conditions)
    {
        rule.conditions.forEach(condition => {
            const { target, stat, operator, value } = condition;
            switch(target)
            {
                case "self":
                {
                    verifyCondition = checkStatValue(operator, battler.stats[stat], value);
                }
            }
        });
        console.log("settima fase: verifyCondition", verifyCondition);
        return verifyCondition;
    }
    
}


function checkIfSkillIsAvailable(rule, availableSkills)
{
    //check to substitute this with a Object.find later
    for(let i = 0; i<availableSkills.length;i++)
    {
        if(rule.action === availableSkills[i].name)
        {
            return true;
        }
    }
    return false;
}

function checkStatValue(operator, battlerStat, value)
{
    switch(operator)
    {
        case "<":
        {
            if(battlerStat < value)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        case ">":
        {
            if(battlerStat > value)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        case "=":
        {
            if(battlerStat === value)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        case ">=":
        {
            if(battlerStat >= value)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        case "<=":
        {
            if(battlerStat <= value)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        default:
        {
            return false;
        }
    }
}
