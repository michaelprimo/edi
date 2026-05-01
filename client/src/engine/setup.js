export function setupGame(data)
{
    //give an ID on each skills
    data.skills.forEach((skill, i) => {
        skill.id = i;
    });

    //let's work on each character of the game
    data.characters.forEach((character, i) => 
    {
        //we start setting up this variable because on the JSON we have only textual skills and we need the real skill objects instead
        //to put inside the character
        let getSkillObjects = [];
        let getStatusObjects = [];

        //let's set those new attributes especially if not set up before
        character.stats.isTargetable ??= true;
        character.stats.canHaveTurns ??= true;
        //let's give an ID even on each character
        character.id = i;
        character.checkStatusParams = [];
        
        if(character.skills !== undefined && character.skills.length > 0)
        {
            for(let j = 0; j < character.skills.length; j++)
            {
                let skillNameToObject = data.skills.find(s => s.name === character.skills[j]);
                if(skillNameToObject !== undefined)
                {
                    getSkillObjects.push(skillNameToObject);
                }
            }
        }

        character.skills = structuredClone(getSkillObjects);

        if(character.status && character.status.length > 0) 
        {
        character.status = character.status.map(s => 
            {
            const template = data.status.find(ds => ds.name === s.nameStatus);
            if(template === undefined) return undefined;
            let instance = structuredClone(template);
            if(instance.stacks === undefined) instance.stacks = 1;
            if(s.stacks !== undefined) instance.stacks = s.stacks;
            if(s.turns !== undefined) instance.turns = s.turns;
            return instance;
            }).filter(s => s !== undefined);
        }
        
    });

    
}