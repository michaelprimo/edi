import { chooseSkill } from './agent.js';

function getUsableSkills(character)
{
    return character.skills.filter(skill => {
        if (!skill.cost) return true;

        return Object.keys(skill.cost).every(resource => {
            const stat = character.stats[resource];
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

export function getSkilltoUse(character, currentCharacters) 
    {
        let idSkill;
        let availableSkills = getUsableSkills(character);
        idSkill = chooseSkill(availableSkills, character, currentCharacters);
        let skillSelected = availableSkills.find(id => id.id === idSkill);

        if (skillSelected && skillSelected.effects && skillSelected.effects.length > 0) 
        {
            if(skillSelected.cost !== undefined)
            {
                let getallNameofCostResources = Object.keys(skillSelected.cost);
                for(let i = 0; i<getallNameofCostResources.length;i++)
                {
                    character.stats[getallNameofCostResources[i]] -= skillSelected.cost[getallNameofCostResources[i]].value;
                }
            }
            
        return skillSelected;
        }

        return undefined; 
    }

export function putAllTargetsOfAllSkillEffectsOnArray(selectedSkill)
{
    return [...new Set(selectedSkill.effects.map(e => e.targetSkill))];
}