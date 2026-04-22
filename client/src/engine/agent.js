import * as math from 'mathjs';
//import { putAllSkillEffectsOnArray } from './skills.js';

export function chooseSkill(availableSkills, battler, currentBattlers) 
{
    

    
    if(battler.agent)
    {
        let sortAgentRules = [...battler.agent].sort((a, b) => b.priority - a.priority);
        let skillChosenID;
        let confirmSkillExists;

        for(let i = 0; i< sortAgentRules.length; i++)
        {
            
            confirmSkillExists = checkIfSkillIsAvailable(sortAgentRules[i], availableSkills);

            if(confirmSkillExists)
            {
                skillChosenID = checkActionsfromPriority(sortAgentRules[i], battler, currentBattlers, availableSkills);
                if(skillChosenID >= 0)
                {
                    i = sortAgentRules.length;
                    return skillChosenID;
                }
            }
            else
            {
            }
            
        }
        return callRandomSkill(availableSkills);
    }
    else
    {
        return callRandomSkill(availableSkills);
        
    }

       
}

function callRandomSkill(availableSkills)
{
    if(availableSkills.length > 0)
    {
        let randomIdSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)].id;
        return randomIdSkill; 
    }
}


function checkActionsfromPriority(rule, battler, currentBattlers, availableSkills)
{
     
    
    let rolld100 = math.randomInt(100);
    let skillFromAction = availableSkills.find(skill => skill.name === rule.action);
    let actionChecked;
    if(rolld100 <= rule.chance)
    {
        
        actionChecked = checkActionsFromConditions(rule,battler,currentBattlers);
        
        if(actionChecked === true || actionChecked === undefined)
        {
            return skillFromAction.id;
        }
        else
        {
        }
    }
    else
    {
    }
}

function checkActionsFromConditions(rule, battler, currentBattlers)
{
    if (!rule.conditions || rule.conditions.length === 0) {
        return true;
    }
    //self works, the rest will be fixed in 0.2
    return rule.conditions.every(condition => {
        const { target, stat, operator, value } = condition;

        switch (target)
        {
            case "self":
                return checkStatValue(operator, battler.stats[stat], value);

            case "all":
                return currentBattlers.every(b => 
                    checkStatValue(operator, b.stats[stat], value)
                );

            case "allEnemies":
                return currentBattlers
                    .filter(b => b.battlerType === battler.targetType)
                    .every(b => checkStatValue(operator, b.stats[stat], value));

            case "enemy":
                return currentBattlers
                    .filter(b => b.battlerType === battler.targetType)
                    .some(b => checkStatValue(operator, b.stats[stat], value));

            case "allAllies":
                return currentBattlers
                    .filter(b => b.battlerType === battler.battlerType && b !== battler)
                    .every(b => checkStatValue(operator, b.stats[stat], value));

            case "ally":
                return currentBattlers
                    .filter(b => b.battlerType === battler.battlerType && b !== battler)
                    .some(b => checkStatValue(operator, b.stats[stat], value));

            case "target":
            case "allTargets":
                return currentBattlers
                    .filter(b => b.battlerType === battler.targetType)
                    .some(b => checkStatValue(operator, b.stats[stat], value));

            default:
                return false;
        }
    });
}


function checkIfSkillIsAvailable(rule, availableSkills)
{
    //check to substitute this with a Object.find later like "return x.find(all the function)".
    for(let i = 0; i<availableSkills.length;i++)
    {
        if(rule.action === availableSkills[i].name)
        {
            return true;
        }
    }
    return false;
}

function checkStatValue(operator, statValue, value)
{
    switch(operator)
    {
        case ">":  return statValue > value;
        case "<":  return statValue < value;
        case "=":  return statValue === value;
        case ">=": return statValue >= value;
        case "<=": return statValue <= value;
        default:   return false;
    }
}
