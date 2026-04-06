export function checkRuleCondition(data, battlerData, ruleTrigger) {
    
    
    let checkStatusResults = [];
    let setSimulationResults = [];
    let mainRules = data.rules.filter(rule => rule.trigger === ruleTrigger);

    mainRules.forEach(rule => {
        let ruleResults = [];
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
            const groupBattlers = battlerData.filter(s => s.battlerType === rule.condition.checkBattlerGroup);

            if(checkStatusResults.length === groupBattlers.length && checkStatusResults.every(b => groupBattlers.some(g => g.id === b.id)))
            {
                if(rule.effects.declareWinnerGroup)
                {
                    setSimulationResults.push({"winners": battlerData.filter(s => s.battlerType === rule.effects.declareWinnerGroup)});
                    console.log("setSimulation winner:", setSimulationResults);
                }
                if(rule.effects.declareLoserGroup)
                {
                    setSimulationResults.push({"losers": battlerData.filter(s => s.battlerType === rule.effects.declareLoserGroup)});
                    console.log("setSimulation loser:", setSimulationResults);
                }
            }
            
        }
        
        if(rule.effects.applyStatus) {
            ruleResults.forEach(battler => 
                {
                const hasStatus = battler.status.some(s => s.name === rule.effects.applyStatus);
                
                if(!hasStatus) 
                {
                    const getStatus = data.status.find(s => s.name === rule.effects.applyStatus);
                    const clonedStatus = structuredClone(getStatus);
                    battler.status.push(clonedStatus);
                    
                }
            });
        }

        if(rule.effects.removeStatus) {
            ruleResults.forEach(battler => 
                {
                const hasStatus = battler.status.some(s => s.name === rule.effects.removeStatus);
                
                if(hasStatus) 
                {
                    const getStatus = data.status.find(s => s.name === rule.effects.removeStatus);
                    battler.status = battler.status.filter(s => s.name !== rule.effects.removeStatus);
                }
            });
        }

        if(rule.effects.setStat)
        {
            let battlerStatData = battlerData.filter(b => b.battlerType === rule.condition.checkBattlerGroup);
            const { setStat, operator, value } = rule.effects;
            
            battlerStatData.forEach(battler => {
                switch(operator) 
                {
                    case "=":  battler.stats[setStat] = value; break;
                    case "+":  battler.stats[setStat] += value; break;
                    case "-":  battler.stats[setStat] -= value; break;
                    case "*": battler.stats[setStat] *= value; break;
                    case "/": battler.stats[setStat] /= value; break;
                    default: battler.stats[setStat] = value;
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