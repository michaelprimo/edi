function getusableSkills(dataSkill, currentBattlers, battlerIndex)
{
    let availableSkills = currentBattlers[battlerIndex].skills.filter(skillName => {
        
        let skill = dataSkill.find(s => s.name === skillName);
        if(!skill || !skill.cost) return true;
        
        return skill.cost.every(cost =>
            Object.keys(cost).every(stat => currentBattlers[battlerIndex].stats[stat] >= cost[stat])
        );
    });

    return availableSkills;
}

function chooseSkill(availableSkills)
{
    return Math.floor(Math.random() * availableSkills.length);
}

export function getValuefromSkill(dataSkill, currentBattlers, battlerIndex) 
    {
        let availableSkills = getusableSkills(dataSkill, currentBattlers, battlerIndex);
        let skillSelected = currentBattlers[battlerIndex].skills[chooseSkill(availableSkills)];
        //let skillFound = dataSkill.find(s => s.name === skillSelected);

        if (skillSelected && skillSelected.effects && skillSelected.effects.length > 0) {
            if(skillSelected.cost !== undefined)
            {
                skillSelected.cost.forEach(cost => {
                    Object.keys(cost).forEach(stat => {
                        currentBattlers[battlerIndex].stats[stat] -= cost[stat];
                    });
                });
            }
            
        return skillSelected;
}

        console.warn("Skill non trovata o senza effetti!");
        return 0; 
    }