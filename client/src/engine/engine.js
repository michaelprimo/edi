export function checkRuleCondition(mainRules, battlerValue)
    {
        let ruleValue = mainRules[0].condition.value; 
        let ruleOperator = mainRules[0].condition.operator;

        switch(ruleOperator) 
        {
        case "=":  return (battlerValue == ruleValue);
        case "<":  return (battlerValue < ruleValue);
        case ">":  return (battlerValue > ruleValue);
        case ">=": return (battlerValue >= ruleValue);
        case "<=": return (battlerValue <= ruleValue);
        default:   return false;
        }
    }

export function getValuefromSkill(dataSkill, currentBattlers, battlerIndex, skillToUse) 
    {
        let skillSelected = currentBattlers[battlerIndex].skills[skillToUse];

        // .find() cerca l'oggetto che soddisfa la condizione e lo restituisce subito
        let skillData = dataSkill.find(s => s.name === skillSelected);

        if (skillData && skillData.effects && skillData.effects.length > 0) {
            return {"value": skillData.effects[0].value, "target": skillData.effects[0].target};
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

export function runEngine(JSONData)
    {

        const data = structuredClone(JSONData); 
 
        let originalBattlers = structuredClone(data.battlers);
        let currentBattlers;
        currentBattlers = structuredClone(originalBattlers);
        let damageSkill;
        let checkGameOver = false;
        let nameBattlerDefeated;
         
        
        while(checkGameOver == false && data.game.turns <= 30)
        {
            data.game.turns++;
            currentBattlers = shuffleObjects(currentBattlers);
            
            for(let i = 0; i<currentBattlers.length; i++)
            {
                let battlerKeys = Object.keys(currentBattlers[i].stats);
                damageSkill = getValuefromSkill(data.skills, currentBattlers, i, 0);
                
                let chooseTarget = getTargetForSkill(currentBattlers, i, damageSkill["target"]);

                chooseTarget[0].stats[battlerKeys[0]] -= damageSkill["value"];
                console.log("Turno " + data.game.turns + ": " + currentBattlers[i].name +" attacca infliggendo " + damageSkill["value"] + " HP di danno al suo nemico! Adesso "+ chooseTarget[0].name +" ha " + chooseTarget[0].stats[battlerKeys[0]] + " HP");
                checkGameOver = checkRuleCondition(data.rules, chooseTarget[0].stats[battlerKeys[0]]);
                if(checkGameOver === true)
                {
                    nameBattlerDefeated = chooseTarget[0].name;
                    break;
                }
            }
        }
        return [nameBattlerDefeated, data.game.turns];

        
    }