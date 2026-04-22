export function setupGame(data)
{
    //give an ID on each skills
    data.skills.forEach((skill, i) => {
        skill.id = i;
    });

    //let's work on each battler of the game
    data.battlers.forEach((battler, i) => 
    {
        //we start setting up this variable because on the JSON we have only textual skills and we need the real skill objects instead
        //to put inside the battler
        let getSkillObjects = [];

        //let's set those new attributes especially if not set up before
        battler.stats.isTargetable ??= true;
        battler.stats.canHaveTurns ??= true;
        //let's give an ID even on each battler
        battler.id = i;
        
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