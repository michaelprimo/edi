import { chooseSkill } from './agent.js';

function getUsableSkills(battler)
{
    return battler.skills.filter(skill => {
        if (!skill.cost) return true;

        return Object.keys(skill.cost).every(resource => {
            const stat = battler.stats[resource];
            const costData = skill.cost[resource];
            const cost = costData.value;

            if (costData.allowLethal === false) {
                return (stat - cost) > 0;
            }

            // default: allow lethal
            return (stat - cost) >= 0;
        });
    });
}

export function getSkilltoUse(battler, currentBattlers) 
    {
        let idSkill;
        let availableSkills = getUsableSkills(battler);
        idSkill = chooseSkill(availableSkills, battler, currentBattlers);
        let skillSelected = availableSkills.find(id => id.id === idSkill);

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

        return undefined; 
    }

export function putAllSkillEffectsOnArray(selectedSkill)
{
    let getAllSkillEffects = [];
    selectedSkill.effects.forEach(effect => 
    {
        getAllSkillEffects.push(effect.targetSkill);
    })
    return [...new Set(getAllSkillEffects)];
}