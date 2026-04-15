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
                }
                if(rule.effects.declareLoserGroup)
                {
                    setSimulationResults.push({"losers": battlerData.filter(s => s.battlerType === rule.effects.declareLoserGroup)});
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
            const effects = rule.effects;
            const condition = rule.condition;
            let isRuleConditionRespected = checkifRuleConditionIsRespected(battlerStatData, condition);

            if(isRuleConditionRespected === true)
            {
                battlerStatData.forEach(battler => 
                {
                switch(effects.operator) 
                {
                    case "=":  battler.stats[effects.setStat] = effects.value; break;
                    case "+":  battler.stats[effects.setStat] += effects.value; break;
                    case "-":  battler.stats[effects.setStat] -= effects.value; break;
                    case "*": battler.stats[effects.setStat] *= effects.value; break;
                    case "/": battler.stats[effects.setStat] /= effects.value; break;
                    default: battler.stats[effects.setStat] = effects.value;
                }
                });
            }
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

function checkifRuleConditionIsRespected(battlerStatData, condition)
{
    return battlerStatData.some(battler => {
        const statValue = battler.stats[condition.stat];

        switch(condition.operator)
        {
            case ">":
                return statValue > condition.value;
            case "<":
                return statValue < condition.value;
            case ">=":
                return statValue >= condition.value;
            case "<=":
                return statValue <= condition.value;
            case "=":
                return statValue === condition.value;
            default:
                return false;
        }
    });
}