export function checkRuleCondition(data, characterData, ruleTrigger) {
    
    
    let checkStatusResults = [];
    let setSimulationResults = [];
    let mainRules = data.rules.filter(rule => rule.trigger === ruleTrigger);

    mainRules.forEach(rule => {
        let ruleResults = [];
        // Tipo 1: condizione su stat
        if(rule.condition.stat) {
            const { stat, operator, value } = rule.condition;
            switch(operator) {
                case "=":  ruleResults = characterData.filter(b => b.stats[stat] == value); break;
                case "<":  ruleResults = characterData.filter(b => b.stats[stat] < value); break;
                case ">":  ruleResults = characterData.filter(b => b.stats[stat] > value); break;
                case ">=": ruleResults = characterData.filter(b => b.stats[stat] >= value); break;
                case "<=": ruleResults = characterData.filter(b => b.stats[stat] <= value); break;
                default: ruleResults = [];
            }
        }

        // Tipo 2: condizione su status
        if(rule.condition.haveStatus) {
            ruleResults = characterData.filter(b => 
                b.status.some(s => s.name === rule.condition.haveStatus)
            );
            
            
            checkStatusResults = ruleResults.filter(s => s.characterType === rule.condition.checkCharacterGroup);
            const groupcharacters = characterData.filter(s => s.characterType === rule.condition.checkCharacterGroup);

            if(checkStatusResults.length === groupcharacters.length && checkStatusResults.every(b => groupcharacters.some(g => g.id === b.id)))
            {
                if(rule.effects.declareWinnerGroup)
                {
                    setSimulationResults.push({"winners": characterData.filter(s => s.characterType === rule.effects.declareWinnerGroup)});
                }
                if(rule.effects.declareLoserGroup)
                {
                    setSimulationResults.push({"losers": characterData.filter(s => s.characterType === rule.effects.declareLoserGroup)});
                }
            }
            
        }
        
        if(rule.effects.applyStatus) {
            ruleResults.forEach(character => 
                {
                const hasStatus = character.status.some(s => s.name === rule.effects.applyStatus.nameStatus);
                
                if(!hasStatus) 
                {
                    const getStatus = data.status.find(s => s.name === rule.effects.applyStatus.nameStatus);
                    const clonedStatus = structuredClone(getStatus);
                    clonedStatus.stacks = rule.effects.applyStatus.stacks;
                    character.status.push(clonedStatus);
                    
                }
            });
        }

        if(rule.effects.removeStatus) {
            ruleResults.forEach(character => 
                {
                const hasStatus = character.status.some(s => s.name === rule.effects.removeStatus);
                
                if(hasStatus) 
                {
                    const getStatus = data.status.find(s => s.name === rule.effects.removeStatus);
                    character.status = character.status.filter(s => s.name !== rule.effects.removeStatus);
                }
            });
        }

        if(rule.effects.setStat)
        {
            let characterstatData = characterData.filter(b => b.characterType === rule.condition.checkCharacterGroup);
            const effects = rule.effects;
            const condition = rule.condition;
            let isRuleConditionRespected = checkifRuleConditionIsRespected(characterstatData, condition);

            if(isRuleConditionRespected === true)
            {
                characterstatData.forEach(character => 
                {
                switch(effects.operator) 
                {
                    case "=":  character.stats[effects.setStat] = effects.value; break;
                    case "+":  character.stats[effects.setStat] += effects.value; break;
                    case "-":  character.stats[effects.setStat] -= effects.value; break;
                    case "*": character.stats[effects.setStat] *= effects.value; break;
                    case "/": character.stats[effects.setStat] /= effects.value; break;
                    default: character.stats[effects.setStat] = effects.value;
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

function checkifRuleConditionIsRespected(characterstatData, condition)
{
    return characterstatData.some(character => {
        const statValue = character.stats[condition.stat];

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