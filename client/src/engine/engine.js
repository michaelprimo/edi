import { checkRuleCondition } from '.././engine/rules.js';
import { shuffleObjects } from '.././engine/turnsystem.js';
import { validateData } from '.././engine/validateData.js';
import { checkStatus } from './status.js';
import { getDamageValueFromFormula, applySkillDamageFormula } from './damage.js';
import { triggerActions } from './trigger.js';
import { getTargetForSkill } from './target.js';
import { getSkilltoUse, putAllSkillEffectsOnArray } from './skills.js';
import { setupGame } from './setup.js';
import { Logger } from './log.js';

export function runEngine(JSONData)
    {
        //create an isolated clone of the JSON data so we can duplicate and manipulate it at will without problems
        const data = structuredClone(JSONData);
        //we start setting up the log manager that makes us see the content on what's happening on screen
        const logger = new Logger();
        //here we add some special fields on the data and making checks of it
        setupGame(data);

        let currentBattlers = putBattlersInBattle(structuredClone(data.battlers));
        currentBattlers = putAgentsinBattlers(data, currentBattlers);
        let selectedSkill;
        let checkRules = undefined;
        let getWinners;
        let statusAddedFromSkill;
        let statusInstance;
        
        console.warn("trovare un altro modo per finire la simulazione che non sia 'data.game.turns <= 10' per forza");
        while((checkRules === undefined || checkRules === null) && data.game.turns <= 999)
        {

            data.game.turns++;
            logger.log("showTurns", { numberOfTurnsPassed: data.game.turns });
            
            currentBattlers = shuffleObjects(currentBattlers);
           
            checkRules = triggerActions(data, currentBattlers, "onTurnStart");
            
            for(let i = 0; i<currentBattlers.length; i++)
            {
                logger.log("battlerTurnStart", {
                        "battlerName": currentBattlers[i].name, 
                        "battlerStats": JSON.stringify(currentBattlers[i].stats),
                        "battlerStatus": JSON.stringify(currentBattlers[i].status)
                    });
        
                if(currentBattlers[i].stats.canHaveTurns === true)
                {
                    console.log("prima fase: selezionare skill da engine.js a getSkilltoUse in skills.js");
                    selectedSkill = getSkilltoUse(currentBattlers[i], currentBattlers);
                    console.log("selectedSkill alla fine è: ", selectedSkill);

                    if(selectedSkill)
                    {
                        logger.log("skillUse", 
                        {
                            "battlerName": currentBattlers[i].name,
                            "battlerSkillName": selectedSkill.name
                        });

                        let chooseTarget = getTargetForSkill(currentBattlers, currentBattlers[i], selectedSkill);
                        
                        console.log(currentBattlers[i].agent);

                        for(let j = 0; j<chooseTarget.length; j++)
                        {
                            if(chooseTarget[j] !== undefined)
                            {

                                for(let k = 0; k<selectedSkill.effects.length; k++)
                                {

                                    let damageValueFromSkillFormula = getDamageValueFromFormula(selectedSkill.effects[k].value, currentBattlers[i], chooseTarget[j]);
                                    chooseTarget[j].stats[selectedSkill.effects[k].targetStat] = applySkillDamageFormula(chooseTarget[j].stats[selectedSkill.effects[k].targetStat], damageValueFromSkillFormula, selectedSkill.effects[k].operator);
                                    
                                    switch(selectedSkill.effects[k].operator)
                                    {
                                        case "+":
                                            logger.log("damageHealedWithSkill", 
                                            {
                                                "targetName": chooseTarget[j].name, "damageAmount": damageValueFromSkillFormula
                                            });
                                            break;
                                        case "-":
                                            logger.log("damageDealtWithSkill", 
                                            {
                                                "targetName": chooseTarget[j].name, "damageAmount": damageValueFromSkillFormula
                                            });
                                            break;
                                        default:
                                            break;
                                    }
                                    
                                    if(selectedSkill.effects[k].addStatus)
                                    {
                                        if (!chooseTarget[j].status) 
                                        {
                                            chooseTarget[j].status = [];
                                        }
                                        
                                        statusAddedFromSkill = data.status.find(chosenStatus => chosenStatus.name === selectedSkill.effects[k].addStatus);
                                        
                                        let checkIfStatusExists = chooseTarget[j].status.find(findStatus => findStatus.name === selectedSkill.effects[k].addStatus);
                                        if(checkIfStatusExists === undefined)
                                        {
                                            statusInstance = structuredClone(statusAddedFromSkill);
                                            chooseTarget[j].status.push(statusInstance);
                                        }
                                    } 
                                }
                                
                            }
                        }
                        checkRules = triggerActions(data, currentBattlers, "onActionEnd");
                        if(checkRules !== null)
                        {
                            const winnersEntry = checkRules.find(r => r.winners !== undefined);
                            const losersEntry = checkRules.find(r => r.losers !== undefined);
                            
                            if(winnersEntry)
                            {
                                logger.log("declareWinners", { "winners": winnersEntry.winners[0].battlerType });
                            }
                            if(losersEntry)
                            {
                                logger.log("declareLosers", { "losers": losersEntry.losers[0].battlerType });
                            }
                            return { checkRules, logs: logger.getLogs() };
                        }
                    }
                }
                else
                {
                    logger.log("noResources", {"battlerName": currentBattlers[i].name});
                }
            }
                triggerActions(data, currentBattlers, "onTurnEnd");
        }
             
    }

function putBattlersInBattle(currentBattlers)
{
    let battlersInBattle = [];

    currentBattlers.forEach(battler => 
    {
        if(battler.inBattle === true)
        {
            battlersInBattle.push(battler);
        }
    });
    return battlersInBattle;
}

function putAgentsinBattlers(data, currentBattlers)
{
    data.agent.forEach(agent => {
        currentBattlers.forEach(battler => {
            if(battler.name === agent.assignTo)
            {
                battler.agent = agent.behaviour;
            }
        });
    });
    
    return currentBattlers;
}