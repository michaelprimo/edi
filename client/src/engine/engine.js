export function checkRuleCondition(mainRules, battlerData, statusData)
    {
        let ruleValue = mainRules[0].condition.value; 
        let ruleOperator = mainRules[0].condition.operator;
        let ruleStat = mainRules[0].condition.stat;

        //console.log("battlerData: ", battlerData);
        //console.log("battlerData type:", Array.isArray(battlerData), battlerData);
        let ruleResults;
        let checkBattlerStatus;
        
        switch(ruleOperator) 
        {
            case "=":  ruleResults = battlerData.filter(b => b.stats[ruleStat] == ruleValue); break;
            case "<":  ruleResults = battlerData.filter(b => b.stats[ruleStat] < ruleValue); break;
            case ">":  ruleResults = battlerData.filter(b => b.stats[ruleStat] > ruleValue); break;
            case ">=": ruleResults = battlerData.filter(b => b.stats[ruleStat] >= ruleValue); break;
            case "<=": ruleResults = battlerData.filter(b => b.stats[ruleStat] <= ruleValue); break;
            default: ruleResults = [];
        }
        
        console.log("ruleResults: ", structuredClone(ruleResults));

        if(mainRules[0].applyStatus)
        {
            console.log("Status added prima: ", checkBattlerStatus);
               
            ruleResults.forEach(battler => {
                const hasStatus = battler.status.some(s => s.name === mainRules[0].applyStatus);
                if(!hasStatus) {
                    const getStatus = statusData.find(s => s.name === mainRules[0].applyStatus);
                    console.log("getStatus: ", getStatus);
                    battler.status.push(getStatus);
                }
            });  
        }
        console.log("battlerData: ", structuredClone(battlerData));

        //aggiungere la logica di vittoria e sconfitta con una altra regola e aggiungere che 
        //in declareWinner e declareLoser si può mettere un gruppo e il targetDefault di quel gruppo.

        return ruleResults;


    }

export function getValuefromSkill(dataSkill, currentBattlers, battlerIndex, skillToUse) 
    {
        let skillSelected = currentBattlers[battlerIndex].skills[skillToUse];

        // .find() cerca l'oggetto che soddisfa la condizione e lo restituisce subito
        let skillFound = dataSkill.find(s => s.name === skillSelected);

        if (skillFound && skillFound.effects && skillFound.effects.length > 0) {
            return skillFound;
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
        let checkRules = false;
        let nameBattlerDefeated;
        let statusAddedFromSkill;
        
        while(data.game.turns <= 10)
        {
            data.game.turns++;
            currentBattlers = shuffleObjects(currentBattlers);
            
            //checkRuleCondition onTurnStart

            for(let i = 0; i<currentBattlers.length; i++)
            {
                //console.log("currentBattlers: ", currentBattlers);
                selectedSkill = getValuefromSkill(data.skills, currentBattlers, i, 0);

                let chooseTarget = getTargetForSkill(currentBattlers, i, selectedSkill.effects[0].targetSkill);
                //console.log("chooseTarget: " + JSON.stringify(chooseTarget));
                console.log("Prima: " + currentBattlers[i].name + " Target " + chooseTarget[0].name + " HP: " + chooseTarget[0].stats["health"] + " Target MP: " + chooseTarget[0].stats["mana"]);
                
                //checkRuleCondition onActionStart

                for(let j = 0; j<selectedSkill.effects.length; j++)
                {
                    chooseTarget[0].stats[selectedSkill.effects[j].targetStat] -= selectedSkill.effects[j].value;
                    if(selectedSkill.effects[j].addStatus)
                    {
                        if (!chooseTarget[0].status) {
                            chooseTarget[0].status = [];
                        }
                        
                        statusAddedFromSkill = data.status.find(chosenStatus => chosenStatus.name === selectedSkill.effects[j].addStatus);
                        //console.log("status: " + chooseTarget[0].status);
                        
                        let checkIfStatusExists = chooseTarget[0].status.find(findStatus => findStatus.name === selectedSkill.effects[j].addStatus);

                        if(checkIfStatusExists === undefined)
                        {
                            //chooseTarget[0].status.push(statusAddedFromSkill);
                        }
                        
                        
                    } 
                }
                console.log("Dopo: " + currentBattlers[i].name + " Target " + chooseTarget[0].name + " HP: " + chooseTarget[0].stats["health"] + " Target MP: " + chooseTarget[0].stats["mana"]);
                //checkRuleCondition onActionEnd: da sistemare nel caso non trovi nulla

                console.log("chooseTarget: ", chooseTarget[0] , "currentBattlers: ", structuredClone(currentBattlers));
                checkRules = checkRuleCondition(data.rules.filter(rule => rule.trigger == "onActionEnd"), currentBattlers, data.status);
                //console.log(checkRules);
                /*
                if(checkRules === true)
                {
                    
                    //nameBattlerDefeated = chooseTarget[0].name;
                    //break;

                }
                */

                //checkRuleCondition onTurnEnd
            }
        }
        return [nameBattlerDefeated, data.game.turns];

        
    }