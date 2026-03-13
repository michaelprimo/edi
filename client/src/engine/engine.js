import { checkRuleCondition } from '.././engine/rules.js';
import { shuffleObjects } from '.././engine/turnsystem.js';
import { validateData } from '.././engine/validateData.js';
import { checkStatus } from './status.js';

export function getValuefromSkill(dataSkill, currentBattlers, battlerIndex, skillToUse) 
    {
        let skillSelected = currentBattlers[battlerIndex].skills[skillToUse];

        
        let skillFound = dataSkill.find(s => s.name === skillSelected);

        if (skillFound && skillFound.effects && skillFound.effects.length > 0) {
            return skillFound;
        }

        console.warn("Skill non trovata o senza effetti!");
        return 0; 
    }

export function getTargetForSkill(currentBattlers, battlerIndex, targetType) {
let target = targetType === "default" 
    ? currentBattlers[battlerIndex].targetType 
    : targetType;

let targetBattlers = currentBattlers.filter(b => b.battlerType === target && b.isTargetable == true);


return targetBattlers;
}

export function runEngine(JSONData)
    {
        const data = structuredClone(JSONData); 
 
        data.battlers.forEach(battler => {
            battler.isTargetable ??= true;
            battler.canHaveTurns ??= true;
            battler.statModifiers ??= [];
        });

        let currentBattlers = structuredClone(data.battlers);
        let selectedSkill;
        let checkRules = false;
        let statusAddedFromSkill;
        console.log("Edi v0.05: simulazione di debug");
        while(checkRules == "" && data.game.turns <= 10)
        {
            data.game.turns++;
            currentBattlers = shuffleObjects(currentBattlers);
            
            //checkRuleCondition onTurnStart

            for(let i = 0; i<currentBattlers.length; i++)
            {
                checkStatus(currentBattlers[i], true);
                if(currentBattlers[i].canHaveTurns === true)
                {
                selectedSkill = getValuefromSkill(data.skills, currentBattlers, i, 0);

                let chooseTarget = getTargetForSkill(currentBattlers, i, selectedSkill.effects[0].targetSkill);
                
                console.log("Prima: " + currentBattlers[i].name + " Target " + chooseTarget[0].name + " HP: " + chooseTarget[0].stats["health"] + " Target MP: " + chooseTarget[0].stats["mana"]);
                
                //checkRuleCondition onActionStart

                for(let j = 0; j<selectedSkill.effects.length; j++)
                {
                    chooseTarget[0].stats[selectedSkill.effects[j].targetStat] -= selectedSkill.effects[j].value;
                    if(selectedSkill.effects[j].addStatus)
                    {
                        if (!chooseTarget[0].status) 
                        {
                            chooseTarget[0].status = [];
                        }
                        
                        statusAddedFromSkill = data.status.find(chosenStatus => chosenStatus.name === selectedSkill.effects[j].addStatus);
                        
                        let checkIfStatusExists = chooseTarget[0].status.find(findStatus => findStatus.name === selectedSkill.effects[j].addStatus);

                        if(checkIfStatusExists === undefined)
                        {
                            chooseTarget[0].status.push(statusAddedFromSkill);
                            console.log(chooseTarget[0].name, " ha ricevuto da una skill lo status: ", statusAddedFromSkill.name);
                        }
                    } 
                }
                console.log("Dopo: " + currentBattlers[i].name + " Target " + chooseTarget[0].name + " HP: " + chooseTarget[0].stats["health"] + " Target MP: " + chooseTarget[0].stats["mana"]);
                //checkRuleCondition onActionEnd: da sistemare nel caso non trovi nulla

                checkRules = checkRuleCondition(data.rules.filter(rule => rule.trigger == "onActionEnd"), currentBattlers, data.status);
                checkStatus(currentBattlers, false);
                //dare il target o tutto currentBattlers al checkStatus
                
                console.log("chooseTarget: ", structuredClone(chooseTarget[0]) , "currentBattlers: ", structuredClone(currentBattlers));
                
                }

                //checkRuleCondition onTurnEnd
            }
        }
        return [checkRules, data.game.turns];

        
    }