import { checkRuleCondition } from '.././engine/rules.js';
import { shuffleObjects } from '.././engine/turnsystem.js';
import { validateData } from '.././engine/validateData.js';
import { checkStatus } from './status.js';
import { applySkillDamageFormula } from './damage.js';
import { triggerActions } from './trigger.js';
import { getTargetForSkill } from './target.js';
import { getValuefromSkill } from './skills.js';

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
            console.log("currentBattlers: ", structuredClone(currentBattlers));
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

                    for(let j = 0; j<chooseTarget.length; j++)
                    {
                        if(j == 1)
                        {
                            console.log("ONE MORE!");
                        }
                        if(chooseTarget[j] !== undefined)
                        {
                            console.log("Nome skill: ", selectedSkill.name);
                            console.log("Prima: " + currentBattlers[i].name + " Target " + chooseTarget[j].name + " HP: " + chooseTarget[j].stats["health"] + " Target MP: " + chooseTarget[j].stats["mana"]);
                    
                            //checkRuleCondition onActionStart

                            for(let k = 0; k<selectedSkill.effects.length; k++)
                            {
                                chooseTarget[j].stats[selectedSkill.effects[k].targetStat] = applySkillDamageFormula(selectedSkill.effects[k].value, chooseTarget[j].stats[selectedSkill.effects[k].targetStat], selectedSkill.effects[k].operator);
                                if(selectedSkill.effects[k].addStatus)
                                {
                                    if (!chooseTarget[j].status) 
                                    {
                                        chooseTarget[j].status = [];
                                    }
                                    
                                    statusAddedFromSkill = data.status.find(chosenStatus => chosenStatus.name === selectedSkill.effects[k].addStatus);
                                    
                                    let checkIfStatusExists = chooseTarget[j].status.find(findStatus => findStatus.name === selectedSkill.effects[k].addStatus);
                                    console.log("statusAddedFromSkill è: ", statusAddedFromSkill, " checkIfStatusExists: ", checkIfStatusExists);
                                    if(checkIfStatusExists === undefined)
                                    {
                                        statusInstance = structuredClone(statusAddedFromSkill);
                                        chooseTarget[j].status.push(statusInstance);
                                        console.log(chooseTarget[j].name, " ha ricevuto da una skill lo status: ", statusAddedFromSkill.name, "che dura: ", statusAddedFromSkill.turns, " turni");
                                    }
                                } 
                            }
                            console.log("Dopo: " + currentBattlers[i].name + " Target " + chooseTarget[j].name + " HP: " + chooseTarget[j].stats["health"] + " Target MP: " + chooseTarget[j].stats["mana"]);
                            //checkRuleCondition onActionEnd: da sistemare nel caso non trovi nulla
                            checkRules = triggerActions(data, currentBattlers, "onActionEnd");
                            console.log("chooseTarget: ", structuredClone(chooseTarget[j]) , "currentBattlers: ", structuredClone(currentBattlers));
                        }
                    
                    }
                
                
                
                
                }
                else
                {
                    console.log("NO TARGETS");
                }
            }
            console.log("TRIGGERED");
                triggerActions(data, currentBattlers, "onTurnEnd");
                //checkRuleCondition onTurnEnd
        }
             return checkRules;
    }