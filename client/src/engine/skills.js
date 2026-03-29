//da sistemare perchè non funziona
function getUsableSkills(battler)
{
    console.warn("sistemare le formule dei danni che rendono gli HP uguali al risultato della formula senza contare l'operatore");

    let availableSkills = battler.skills;

    console.log("availableSkills:", availableSkills);
    console.log("availableSkillCost:", availableSkills[0].cost);
    console.log("availableStats:", battler.stats);

    availableSkills = availableSkills.filter(skill => 
    {
    if(!skill.cost) return true;
        return skill.cost.every(cost =>
            Object.keys(cost).every(stat => battler.stats[stat] >= cost[stat])
        );
    });
    return availableSkills;
}

function chooseSkill(availableSkills)
{
    return Math.floor(Math.random() * availableSkills.length);
}

export function getValuefromSkill(battler) 
    {
        let availableSkills = getUsableSkills(battler);
        let skillSelected = availableSkills[chooseSkill(availableSkills)];

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