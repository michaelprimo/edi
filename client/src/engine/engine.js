export function checkRuleCondition(mainRules, battlerValue)
    {
        let ruleValue = mainRules[0].condition.value; 
        let ruleOperator = mainRules[0].condition.operator;
        let ruleStat = mainRules[0].condition.stat;

        switch(ruleOperator) 
        {
        case "=":  return (battlerValue.stats[ruleStat] == ruleValue);
        case "<":  return (battlerValue.stats[ruleStat] < ruleValue);
        case ">":  return (battlerValue.stats[ruleStat] > ruleValue);
        case ">=": return (battlerValue.stats[ruleStat] >= ruleValue);
        case "<=": return (battlerValue.stats[ruleStat] <= ruleValue);
        default:   return false;
        }
    }

export function getValuefromSkill(dataSkill, currentBattlers, battlerIndex, skillToUse) 
    {
        let skillSelected = currentBattlers[battlerIndex].skills[skillToUse];

        // .find() cerca l'oggetto che soddisfa la condizione e lo restituisce subito
        let skillFound = dataSkill.find(s => s.name === skillSelected);

        if (skillFound && skillFound.effects && skillFound.effects.length > 0) {
            return {"value": skillFound.effects[0].value, "targetSkill": skillFound.effects[0].targetSkill, "targetStat": skillFound.effects[0].targetStat};
        }

        console.warn("Skill non trovata o senza effetti!");
        return 0; // Un valore di default evita errori nei calcoli successivi
    }

export function getTargetForSkill(currentBattlers, battlerIndex, targetType) {
let target = targetType === "default" 
    ? currentBattlers[battlerIndex].targetType 
    : targetType;

let targetBattlers = currentBattlers.filter(b => b.battlerType === target);

// Prendi un target random tra quelli disponibili
return targetBattlers;
}

export function shuffleObjects(array) {
    const shuffled = [...array]; 
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1)); 
        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    return shuffled;
    }


export function validateData(data) {
    const rules = data.rules;
    const battlers = data.battlers;

    // controlla tutte le regole
    const areRulesOkay = rules.every(rule => {
        const statName = rule.condition.stat;

        // ogni battler deve avere questa stat
        return battlers.every(battler => battler.stats.hasOwnProperty(statName));
    });

    if (!areRulesOkay) {
        return "Not every battler has the stats required by the rules. Check your JSON!";
    }

    return true;
}

export function runEngine(JSONData)
    {

        const data = structuredClone(JSONData); 
 
        let currentBattlers = structuredClone(data.battlers);
        let selectedSkill;
        let checkGameOver = false;
        let nameBattlerDefeated;
         
        
        while(!checkGameOver && data.game.turns <= 30)
        {
            data.game.turns++;
            currentBattlers = shuffleObjects(currentBattlers);
            
            for(let i = 0; i<currentBattlers.length; i++)
            {
                
                selectedSkill = getValuefromSkill(data.skills, currentBattlers, i, 0);
                
                let chooseTarget = getTargetForSkill(currentBattlers, i, selectedSkill["targetSkill"]);

                chooseTarget[0].stats[selectedSkill["targetStat"]] -= selectedSkill["value"];
                console.log("Turno " + data.game.turns + ": " + currentBattlers[i].name +" attacca infliggendo " + selectedSkill["value"] + " HP di danno al suo nemico! Adesso "+ chooseTarget[0].name +" ha " + chooseTarget[0].stats[selectedSkill["targetStat"]] + " HP");
                checkGameOver = checkRuleCondition(data.rules, chooseTarget[0]);
                if(checkGameOver === true)
                {
                    nameBattlerDefeated = chooseTarget[0].name;
                    break;
                }
            }
        }
        return [nameBattlerDefeated, data.game.turns];

        
    }