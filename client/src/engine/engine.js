import { checkRuleCondition } from '.././engine/rules.js';
import { shuffleObjects } from '.././engine/turnsystem.js';
import { validateData } from '.././engine/validateData.js';
import { checkStatus } from './status.js';
import { getDamageValueFromFormula, applySkillDamageFormula } from './damage.js';
import { triggerActions } from './trigger.js';
import { getTargetForSkill } from './target.js';
import { getValuefromSkill } from './skills.js';
import { setupGame } from './setup.js';
import { addTextLog } from './log.js';

export function runEngine(JSONData, gameLogs)
    {
        const data = structuredClone(JSONData);

        setupGame(data);

        let currentBattlers = structuredClone(data.battlers);
        let selectedSkill;
        let checkRules = null;
        let getWinners;
        let statusAddedFromSkill;
        let statusInstance;
        console.log("Edi v0.09: simulazione di debug");
        while(checkRules === null && data.game.turns <= 10)
        {

            data.game.turns++;
            gameLogs = addTextLog(gameLogs, "showTurns", 
            {
                "numberOfTurnsPassed": data.game.turns
            });
            
            currentBattlers = shuffleObjects(currentBattlers);
            //console.log("currentBattlers: ", structuredClone(currentBattlers));
            //checkRuleCondition onTurnStart
            //sistemare il fatto che all'inizio del turno del battler ci deve essere questo boost
            
            checkRules = triggerActions(data, currentBattlers, "onTurnStart");
            //checkStatus(data, currentBattlers, "onTurnStart");
            for(let i = 0; i<currentBattlers.length; i++)
            {
                gameLogs = addTextLog(gameLogs, "battlerTurnStart", 
                    {
                        "battlerName": currentBattlers[i].name, 
                        "battlerStats": JSON.stringify(currentBattlers[i].stats) 
                    });
                if(currentBattlers[i].stats.canHaveTurns === true)
                {
                    selectedSkill = getValuefromSkill(currentBattlers[i]);

                    if(selectedSkill)
                    {
                        gameLogs = addTextLog(gameLogs, "skillUse", 
                        {
                            "battlerName": currentBattlers[i].name,
                            "battlerSkillName": selectedSkill.name
                        });
                        let chooseTarget = getTargetForSkill(currentBattlers, i, selectedSkill.effects[0].targetSkill);
        
                        for(let j = 0; j<chooseTarget.length; j++)
                        {
                            if(chooseTarget[j] !== undefined)
                            {
                                console.log("Prima: " + currentBattlers[i].name + " Target " + chooseTarget[j].name + " HP: " + chooseTarget[j].stats["health"] + " Target MP: " + chooseTarget[j].stats["mana"]);
                        
                                //checkRuleCondition onActionStart

                                for(let k = 0; k<selectedSkill.effects.length; k++)
                                {
                                    console.log("formula: ", selectedSkill.effects[k].value);
                                    console.log("attacker: ", currentBattlers[i]);
                                    console.log("defense: ", chooseTarget[j]);

                                    let damageValueFromSkillFormula = getDamageValueFromFormula(selectedSkill.effects[k].value, currentBattlers[i], chooseTarget[j]);
                                    chooseTarget[j].stats[selectedSkill.effects[k].targetStat] = applySkillDamageFormula(chooseTarget[j].stats[selectedSkill.effects[k].targetStat], damageValueFromSkillFormula, selectedSkill.effects[k].operator);
                                    gameLogs = addTextLog(gameLogs, "damageDealtWithSkill", {"targetName": chooseTarget[j].name, "damageAmount": damageValueFromSkillFormula});


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
                                checkRules = triggerActions(data, currentBattlers, "onActionEnd");
                                console.log("chooseTarget: ", structuredClone(chooseTarget[j]) , "currentBattlers: ", structuredClone(currentBattlers));
                            }
                        }
                    }
                }
                else
                {
                    gameLogs = addTextLog(gameLogs, "noResources", {"battlerName": currentBattlers[i].name});
                }
            }
            //console.log("TRIGGERED");
                triggerActions(data, currentBattlers, "onTurnEnd");
                //checkRuleCondition onTurnEnd
        }
             return checkRules;
    }