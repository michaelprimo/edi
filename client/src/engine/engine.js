import { checkRuleCondition } from '.././engine/rules.js';
import { shuffleObjects } from '.././engine/turnsystem.js';
import { validateData } from '.././engine/validateData.js';
import { checkStatus } from './status.js';
import { applySkillDamageFormula } from './damage.js';
import { triggerActions } from './trigger.js';

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

let targetBattlers = currentBattlers.filter(b => b.battlerType === target && b.stats.isTargetable == true);


return targetBattlers;
}

export function runEngine(JSONData)
    {
        const data = structuredClone(JSONData); 
        
        data.battlers.forEach((battler, i) => {
            battler.stats.isTargetable ??= true;
            battler.stats.canHaveTurns ??= true;
            battler.baseStats ??= structuredClone(battler.stats);
            battler.id = i;
            battler.checkStatusParams = [];
        });

        let currentBattlers = structuredClone(data.battlers);
        let selectedSkill;
        let checkRules = null;
        let getWinners;
        let statusAddedFromSkill;
        let statusInstance;
        console.log("Edi v0.08: simulazione di debug");
        while(checkRules === null && data.game.turns <= 10)
        {

            data.game.turns++;
            console.log("TURNO ", data.game.turns);
            currentBattlers = shuffleObjects(currentBattlers);
            
            //checkRuleCondition onTurnStart
            //sistemare il fatto che all'inizio del turno del battler ci deve essere questo boost
            
            checkRules = triggerActions(data, currentBattlers, "onTurnStart");
            //checkStatus(data, currentBattlers, "onTurnStart");
            for(let i = 0; i<currentBattlers.length; i++)
            {
                if(currentBattlers[i].stats.canHaveTurns === true)
                {
                    selectedSkill = getValuefromSkill(data.skills, currentBattlers, i, 0);

                    let chooseTarget = getTargetForSkill(currentBattlers, i, selectedSkill.effects[0].targetSkill);
                    console.log("-------------------- target di ", currentBattlers[i].name, ": ", structuredClone(chooseTarget));

                    if(chooseTarget[0] !== undefined)
                    {
                        console.log("Prima: " + currentBattlers[i].name + " Target " + chooseTarget[0].name + " HP: " + chooseTarget[0].stats["health"] + " Target MP: " + chooseTarget[0].stats["mana"]);
                    
                    //checkRuleCondition onActionStart

                    for(let j = 0; j<selectedSkill.effects.length; j++)
                    {
                        chooseTarget[0].stats[selectedSkill.effects[j].targetStat] = applySkillDamageFormula(selectedSkill.effects[j].value, chooseTarget[0].stats[selectedSkill.effects[j].targetStat], selectedSkill.effects[j].operator);
                        if(selectedSkill.effects[j].addStatus)
                        {
                            if (!chooseTarget[0].status) 
                            {
                                chooseTarget[0].status = [];
                            }
                            
                            statusAddedFromSkill = data.status.find(chosenStatus => chosenStatus.name === selectedSkill.effects[j].addStatus);
                            
                            let checkIfStatusExists = chooseTarget[0].status.find(findStatus => findStatus.name === selectedSkill.effects[j].addStatus);
                            console.log("statusAddedFromSkill è: ", statusAddedFromSkill, " checkIfStatusExists: ", checkIfStatusExists);
                            if(checkIfStatusExists === undefined)
                            {
                                statusInstance = structuredClone(statusAddedFromSkill);
                                chooseTarget[0].status.push(statusInstance);
                                console.log(chooseTarget[0].name, " ha ricevuto da una skill lo status: ", statusAddedFromSkill.name, "che dura: ", statusAddedFromSkill.turns, " turni");
                            }
                        } 
                    }
                    console.log("Dopo: " + currentBattlers[i].name + " Target " + chooseTarget[0].name + " HP: " + chooseTarget[0].stats["health"] + " Target MP: " + chooseTarget[0].stats["mana"]);
                    //checkRuleCondition onActionEnd: da sistemare nel caso non trovi nulla
                    checkRules = triggerActions(data, currentBattlers, "onActionEnd");
                    console.log("chooseTarget: ", structuredClone(chooseTarget[0]) , "currentBattlers: ", structuredClone(currentBattlers));
                }
                else
                {
                    console.log("NO TARGETS");
                }
                
                
                
                }

                //checkRuleCondition onTurnEnd
            }
        }
             return checkRules;
    }