//da sistemare perchè non funziona
function getUsableSkills(battler)
{
    let availableSkills = battler.skills;

    availableSkills = availableSkills.filter(skill => 
    {
    if(!skill.cost) return true;
        return skill.cost.every(cost =>
            Object.keys(cost).every(stat => battler.stats[stat] >= cost[stat])
        );
    });
    return availableSkills;
}

function chooseSkill(availableSkills, battler, currentBattlers)
{
    if(!battler.agent || battler.agent.length === 0)
    {
        return Math.floor(Math.random() * availableSkills.length);
    }

    const sortedRules = [...battler.agent].sort((a, b) => b.priority - a.priority);

    for(let rule of sortedRules)
    {
        if(!rule.conditions || rule.conditions.length === 0)
        {
            const skillIndex = availableSkills.findIndex(s => s.name === rule.action);
            if(skillIndex !== -1) return skillIndex;
        }
        else
        {
            const conditionsMet = rule.conditions.every(condition => {
                const { stat, operator, value } = condition;
                let target = condition.target === "self" 
                    ? battler 
                    : currentBattlers.find(b => b.battlerType !== battler.battlerType && b.stats.isTargetable === true);
                
                if(!target) return false;

                let threshold = condition.valueType === "percent"
                    ? (target.stats[stat] / target.stats[`max${stat.charAt(0).toUpperCase() + stat.slice(1)}`]) * 100
                    : value;

                switch(operator)
                {
                    case "<":  return target.stats[stat] < threshold;
                    case ">":  return target.stats[stat] > threshold;
                    case "=":  return target.stats[stat] === threshold;
                    case "<=": return target.stats[stat] <= threshold;
                    case ">=": return target.stats[stat] >= threshold;
                    default: return false;
                }
            });

            if(conditionsMet)
            {
                if(rule.chance < 100 && Math.random() * 100 > rule.chance) continue;
                const skillIndex = availableSkills.findIndex(s => s.name === rule.action);
                if(skillIndex !== -1) return skillIndex;
            }
        }
    }

    return Math.floor(Math.random() * availableSkills.length);
}

export function getSkilltoUse(battler, currentBattlers) 
    {
        let availableSkills = getUsableSkills(battler);
        let skillSelected = availableSkills[chooseSkill(availableSkills, battler, currentBattlers)];

        if (skillSelected && skillSelected.effects && skillSelected.effects.length > 0) {
            if(skillSelected.cost !== undefined)
            {
                skillSelected.cost.forEach(cost => {
                    Object.keys(cost).forEach(stat => {
                        battler.stats[stat] -= cost[stat];
                    });
                });
            }
            
        return skillSelected;
}

        console.warn("Skill non trovata o senza effetti!");
        return undefined; 
    }