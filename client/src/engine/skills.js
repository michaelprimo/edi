import { chooseSkill } from './agent.js';

function getUsableSkills(battler)
{
    let battlerSkills = battler.skills;
    let availableSkills = [];
    let getSkillCostResourceNames;
    let checkIfSkillCostIsAffordable;

    for(let i = 0; i < battlerSkills.length; i++)
    {
        if(battlerSkills[i].cost === undefined)
        {
            availableSkills.push(battlerSkills[i]);
        }
        else
        {
            getSkillCostResourceNames = Object.keys(battlerSkills[i].cost);
            getSkillCostResourceNames.forEach(skillCost => 
            {
                checkIfSkillCostIsAffordable = true;
                if(battler.stats[skillCost] < battlerSkills[i].cost[skillCost].value)
                {
                    checkIfSkillCostIsAffordable = false;
                }
                
            });
            if(checkIfSkillCostIsAffordable === true)
            {
                availableSkills.push(battlerSkills[i]);
            }
        }
    }
    return availableSkills;
}

export function getSkilltoUse(battler, currentBattlers) 
    {
        let idSkill;
        console.log("seconda fase: in getSkillToUse vedere a che punto sono le variabili");
        let availableSkills = getUsableSkills(battler);
        console.log("seconda fase - availableSkills (agent.js) adesso ha: ", availableSkills);
        idSkill = chooseSkill(availableSkills, battler, currentBattlers);
        let skillSelected = availableSkills.find(id => id.id === idSkill);
        //let skillSelected = availableSkills[chooseSkill(availableSkills, battler, currentBattlers)];
        console.log("terza fase - skillSelected adesso ha: ", skillSelected);

        if (skillSelected && skillSelected.effects && skillSelected.effects.length > 0) 
        {
            if(skillSelected.cost !== undefined)
            {
                let getallNameofCostResources = Object.keys(skillSelected.cost);
                for(let i = 0; i<getallNameofCostResources.length;i++)
                {
                    battler.stats[getallNameofCostResources[i]] -= skillSelected.cost[getallNameofCostResources[i]].value;
                }
            }
            
        return skillSelected;
        }

        console.warn("Skill non trovata o senza effetti!");
        return undefined; 
    }