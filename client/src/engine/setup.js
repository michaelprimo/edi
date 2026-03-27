export function setupGame(data)
{

    data.skills.forEach((skill, i) => {
        skill.id = i;
    });

    data.battlers.forEach((battler, i) => 
    {
        let getSkillObjects = [];
        battler.stats.isTargetable ??= true;
        battler.stats.canHaveTurns ??= true;
        battler.baseStats ??= structuredClone(battler.stats);
        battler.id = i;
        battler.checkStatusParams = [];
        
        if(battler.skills !== undefined && battler.skills.length > 0)
        {
            for(let j = 0; j < battler.skills.length; j++)
            {
                let skillNameToObject = data.skills.find(s => s.name === battler.skills[j]);
                if(skillNameToObject !== undefined)
                {
                    getSkillObjects.push(skillNameToObject);
                }
            }
        }

        battler.skills = structuredClone(getSkillObjects);
    });

    
}