import { useEffect } from "react";



export default function Engine({ data }) 
{

    const check_rules_targeted_parameter = data.rules;
    const check_battlers_stats = data.battlers;
    const check_gameStats = data.game;
    const check_gameSkills = data.skills;

    let originalBattlers = JSON.parse(JSON.stringify(data.battlers));
    console.log(originalBattlers);
    let currentBattlers = shuffleObjects(originalBattlers); 
    
    function shuffleObjects(array, deepClone = false) {
    // Create a shallow copy by default; deep clone if requested
    const shuffled = deepClone 
        ? array.map(obj => JSON.parse(JSON.stringify(obj))) // Simple deep clone
        : [...array]; // Shallow copy (preserves references)
    
    for (let i = shuffled.length - 1; i > 0; i--) {
        // Critical: Use (i + 1) to include the current index in the swap
        const randomIndex = Math.floor(Math.random() * (i + 1)); 
        // Swap elements (reorders references)
        [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    return shuffled;
    }
    
    function runEngine()
    {
        check_gameStats.turns = 0;

        let damageSkill;

        let check_gameOver = false;
        let nameBattlerDefeated;
        
        while(check_gameOver == false && check_gameStats.turns <= 30)
        {
            check_gameStats.turns++;
            currentBattlers = shuffleObjects(originalBattlers);
            
            
            for(let i = 0; i<currentBattlers.length; i++)
            {
                let battlerKeys = Object.keys(currentBattlers[i].stats);
                damageSkill = getValuefromSkill(i, 0);
                
                let chooseTarget = getTargetForSkill(i, damageSkill["target"]);

                chooseTarget[0].stats[battlerKeys[0]] -= damageSkill["value"];
                console.log("Turno " + check_gameStats.turns + ": " + currentBattlers[i].name +" attacca infliggendo " + damageSkill["value"] + " HP di danno al suo nemico! Adesso "+ chooseTarget[0].name +" ha " + chooseTarget[0].stats[battlerKeys[0]] + " HP");
                check_gameOver = checkRuleCondition(chooseTarget[0].stats[battlerKeys[0]], chooseTarget[0].name);
                if(check_gameOver === true)
                {
                    nameBattlerDefeated = chooseTarget[0].name;
                    break;
                }
            }
        }
        return [nameBattlerDefeated, check_gameStats.turns];
    }
    
    function checkRuleCondition(battlerValue)
    {
        let ruleValue = check_rules_targeted_parameter[0].condition.value; 
        let ruleOperator = check_rules_targeted_parameter[0].condition.operator;

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

    function getValuefromSkill(battlerIndex, skillToUse) 
    {
        let skillSelected = currentBattlers[battlerIndex].skills[skillToUse];

        // .find() cerca l'oggetto che soddisfa la condizione e lo restituisce subito
        let skillData = check_gameSkills.find(s => s.name === skillSelected);

        if (skillData && skillData.effects && skillData.effects.length > 0) {
            return {"value": skillData.effects[0].value, "target": skillData.effects[0].target};
        }

        console.warn("Skill non trovata o senza effetti!");
        return 0; // Un valore di default evita errori nei calcoli successivi
    }

    function getTargetForSkill(battlerIndex, targetType) {
    let target = targetType === "default" 
        ? currentBattlers[battlerIndex].targetType 
        : targetType;
    
    let targetBattlers = currentBattlers.filter(b => b.battlerType === target);
    
    // Prendi un target random tra quelli disponibili
    return targetBattlers;
}

useEffect(() => {
    const executeTurn = runEngine();
    console.log(`${executeTurn[0]} ha perso in ${executeTurn[1]} turni`);
}, []);

    return (
        <>
            
            <strong>Rules:</strong>
            <p>{JSON.stringify(data.rules)}</p>
            <p>
                {check_rules_targeted_parameter.map((r, index) => (
                    <li key={index}>
                        <strong>Stato coinvolto {r.condition.stat}</strong> Operatore {r.condition.operator} Valore {r.condition.value} Effetto {r.effect}
                        {check_battlers_stats.map((b, i) => (
                            <span key={i}>
                                {b.name === "player" ? <strong>Player</strong> : null}  
                            </span>
                        ))}
                    </li>
                ))}

            </p>
        </>
    )

    
}

