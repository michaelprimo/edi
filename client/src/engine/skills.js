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
        console.log("seconda fase: in getSkillToUse vedere a che punto sono le variabili");
        let availableSkills = getUsableSkills(battler);
        console.log("seconda fase - availableSkills (agent.js) adesso ha: ", availableSkills);
        idSkill = chooseSkill(availableSkills, battler, currentBattlers);
        console.log("idSkill: ", idSkill);
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

export function putAllSkillEffectsOnArray(selectedSkill)
{
    let getAllSkillEffects = [];
    selectedSkill.effects.forEach(effect => 
    {
        getAllSkillEffects.push(effect.targetSkill);
    })
    return getAllSkillEffects;
}