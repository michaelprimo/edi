export function checkRuleCondition(data, battlerData, ruleTrigger) {
    
    let ruleResults = [];
    let checkStatusResults = [];
    let setSimulationResults = [];
    let mainRules = data.rules.filter(rule => rule.trigger === ruleTrigger);

    mainRules.forEach(rule => {
        
        // Tipo 1: condizione su stat
        if(rule.condition.stat) {
            const { stat, operator, value } = rule.condition;
            switch(operator) {
                case "=":  ruleResults = battlerData.filter(b => b.stats[stat] == value); break;
                case "<":  ruleResults = battlerData.filter(b => b.stats[stat] < value); break;
                case ">":  ruleResults = battlerData.filter(b => b.stats[stat] > value); break;
                case ">=": ruleResults = battlerData.filter(b => b.stats[stat] >= value); break;
                case "<=": ruleResults = battlerData.filter(b => b.stats[stat] <= value); break;
                default: ruleResults = [];
            }
        }

        // Tipo 2: condizione su status
        if(rule.condition.haveStatus) {
            ruleResults = battlerData.filter(b => 
                b.status.some(s => s.name === rule.condition.haveStatus)
            );
            
            
            checkStatusResults = ruleResults.filter(s => s.battlerType === rule.condition.checkBattlerGroup);
            if (JSON.stringify(checkStatusResults) === JSON.stringify(battlerData.filter(s => s.battlerType == rule.condition.checkBattlerGroup)))   
            {
                if(rule.effects.declareWinnerGroup)
                {
                    setSimulationResults.push({"winners": battlerData.filter(s => s.battlerType === rule.effects.declareWinnerGroup)});
                }
                if(rule.effects.declareLoserGroup)
                {
                    setSimulationResults.push({"losers": battlerData.filter(s => s.battlerType === rule.effects.declareLoserGroup)});
                }
                
            }
            //console.log("Simulation Results: ", setSimulationResults);
        }
        //console.log(rule.effects.applyStatus);
        // Applica status se previsto
        if(rule.effects.applyStatus) {
            ruleResults.forEach(battler => 
                {
                const hasStatus = battler.status.some(s => s.name === rule.effects.applyStatus);
                
                if(!hasStatus) 
                {
                    const getStatus = data.status.find(s => s.name === rule.effects.applyStatus);
                    const clonedStatus = structuredClone(getStatus);
                    battler.status.push(clonedStatus);
                    console.log(battler.name, " ha ricevuto da una regola lo status: ", getStatus.name);
                }
            });
        }

        if(rule.effects.removeStatus) {
            ruleResults.forEach(battler => 
                {
                const hasStatus = battler.status.some(s => s.name === rule.effects.removeStatus);
                console.log("verificare se ", battler.name, " ha lo stato da rimuovere:", hasStatus);
                if(hasStatus) 
                {
                    const getStatus = data.status.find(s => s.name === rule.effects.removeStatus);
                    battler.status = battler.status.filter(s => s.name !== rule.effects.removeStatus);
                    console.log(battler.name, " ha perso a causa di una regola lo status: ", getStatus.name, " status in possesso: ", battler.status);
                }
            });
        }
    });
    
    if(setSimulationResults.length > 0)
    {
        return setSimulationResults;
    }
    else 
    {
        return null;
    }
}