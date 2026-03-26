function chooseSkill()
{
    
}

export function getValuefromSkill(dataSkill, currentBattlers, battlerIndex, skillToUse) 
    {
        let skillSelected = currentBattlers[battlerIndex].skills[skillToUse];

        
        let skillFound = dataSkill.find(s => s.name === skillSelected);

        if (skillFound && skillFound.effects && skillFound.effects.length > 0) {
            if(skillFound.cost !== undefined)
            {
                skillFound.cost.forEach(cost => {
                    Object.keys(cost).forEach(stat => {
                        currentBattlers[battlerIndex].stats[stat] -= cost[stat];
                    });
                });
            }
            
        return skillFound;
}

        console.warn("Skill non trovata o senza effetti!");
        return 0; 
    }