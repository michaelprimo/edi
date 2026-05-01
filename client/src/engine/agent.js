import * as math from 'mathjs';
//import { putAllTargetsOfAllSkillEffectsOnArray } from './skills.js';

export function chooseSkill(availableSkills, character, currentCharacters) 
{
    

    
    if(character.agent)
    {
        let sortAgentRules = [...character.agent].sort((a, b) => b.priority - a.priority);
        let skillChosenID;
        let confirmSkillExists;

        for(let i = 0; i< sortAgentRules.length; i++)
        {
            
            confirmSkillExists = checkIfSkillIsAvailable(sortAgentRules[i], availableSkills);

            if(confirmSkillExists)
            {
                skillChosenID = checkActionsfromPriority(sortAgentRules[i], character, currentCharacters, availableSkills);
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


function checkActionsfromPriority(rule, character, currentCharacters, availableSkills)
{
     
    
    let rolld100 = math.randomInt(100);
    let skillFromAction = availableSkills.find(skill => skill.name === rule.action);
    let actionChecked;
    if(rolld100 <= rule.chance)
    {
        
        actionChecked = checkActionsFromConditions(rule,character,currentCharacters);
        
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

function checkActionsFromConditions(rule, character, currentCharacters)
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
                return checkStatValue(operator, character.stats[stat], value);

            case "all":
                return currentCharacters.every(b => 
                    checkStatValue(operator, b.stats[stat], value)
                );

            case "allEnemies":
                return currentCharacters
                    .filter(b => b.characterType === character.targetType)
                    .every(b => checkStatValue(operator, b.stats[stat], value));

            case "enemy":
                return currentCharacters
                    .filter(b => b.characterType === character.targetType)
                    .some(b => checkStatValue(operator, b.stats[stat], value));

            case "allAllies":
                return currentCharacters
                    .filter(b => b.characterType === character.characterType && b !== character)
                    .every(b => checkStatValue(operator, b.stats[stat], value));

            case "ally":
                return currentCharacters
                    .filter(b => b.characterType === character.characterType && b !== character)
                    .some(b => checkStatValue(operator, b.stats[stat], value));

            case "target":
            case "allTargets":
                return currentCharacters
                    .filter(b => b.characterType === character.targetType)
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
