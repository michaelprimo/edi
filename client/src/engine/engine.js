import { shuffleObjects } from '.././engine/turnsystem.js';
import { calculateSkillEffect } from './damage.js';
import { triggerActions } from './trigger.js';
import { getTargetForSkill } from './target.js';
import { getSkilltoUse } from './skills.js';
import { setupGame } from './setup.js';
import { Logger } from './log.js';
import { Agents } from './JSONdata.js';
import { applyTargetStatusFromSkillEffect, removeTargetStatusFromSkillEffect } from './status.js';

export function runEngine(JSONData)
{
    //create an isolated clone of the JSON data so we can duplicate and manipulate it at will without problems
    const data = structuredClone(JSONData);

    const agents = new Agents();
    agents.log(data.agent);

    //we start setting up the log manager that makes us see the content on what's happening on screen
    const logger = new Logger();
    //here we add some special fields on the data and making checks of it
    setupGame(data);

     //let's put in this variable the characters of the game, removing the other ones out of the battle
    let currentCharacters = putcharactersInBattle(structuredClone(data.characters));
    //let's check if in the agent section of the JSON we see some agents to push in our characters.
    currentCharacters = putAgentsincharacters(data, currentCharacters);

    //we put the skill chosen by the character here.
    let selectedSkill;
    //when this variable will be populated with winners and losers of the game, the simulation will end
    let checkRules = undefined;
    

    //----------the main cycle of the simulation, to check if we can remove the checkRules check to something like "stopSimulation === false"
    while((checkRules === undefined || checkRules === null) && data.game.turns <= data.game.maxSimulationTurns)
    {
        data.game.turns++;
        logger.log("showTurns", { numberOfTurnsPassed: data.game.turns });

        //we need both for getting the turn order based on the battle system selected
        currentCharacters = shuffleObjects(currentCharacters, data.game);
        
        checkRules = triggerActions(data, currentCharacters, "onTurnStart");

        //every character move in their turns
        for(let i = 0; i < currentCharacters.length; i++)
        {
            checkRules = triggerActions(data, currentCharacters, "onActionStart");
            logger.log("characterTurnStart", {
                "characterName": currentCharacters[i].name,
                "characterstats": JSON.stringify(currentCharacters[i].stats),
                "characterstatus": JSON.stringify(currentCharacters[i].status)
            });

            //we are checking if the character is stunned or not. If it's stunned, the character won't act otherwise proceed
            if(currentCharacters[i].stats.canHaveTurns === true)
            {
                //let's find the skill to use
                selectedSkill = getSkilltoUse(currentCharacters[i], currentCharacters);
                
                //if the character has a skill ready, this will happen. 
                if(selectedSkill !== undefined)
                {
                    logger.log("skillUse", {
                        "characterName": currentCharacters[i].name,
                        "characterskillName": selectedSkill.name
                    });

                    //select the target of the skill
                    const chooseTarget = getTargetForSkill(currentCharacters, currentCharacters[i], selectedSkill);

                    console.log("chooseTarget: ", chooseTarget);
                    //apply the effect for each target
                    for(let j = 0; j < chooseTarget.length; j++)
                    {
                        console.log("length: ", chooseTarget.length);
                        if(chooseTarget[j] === undefined) continue;

                        //apply each skill effect on the target
                        for(let k = 0; k < selectedSkill.effects.length; k++)
                        {
                            calculateSkillEffect(selectedSkill.effects[k], logger, chooseTarget[j], currentCharacters[i]);
                            applyTargetStatusFromSkillEffect(data.status, selectedSkill.effects[k], currentCharacters[i], chooseTarget[j], currentCharacters, logger);
                            removeTargetStatusFromSkillEffect(selectedSkill.effects[k], currentCharacters[i], chooseTarget[j], currentCharacters, logger);
                        }
                    }

                    checkRules = triggerActions(data, currentCharacters, "onActionEnd");
                    if(data.game.turns >= data.game.maxSimulationTurns)
                    {
                        checkRules = "draw";
                        return { checkRules, logs: logger.getLogs() };
                    }
                    if(checkRules !== null)
                    {
                        const winnersEntry = checkRules.find(r => r.winners !== undefined);
                        const losersEntry = checkRules.find(r => r.losers !== undefined);

                        if(winnersEntry) logger.log("declareWinners", { "winners": winnersEntry.winners[0].characterType });
                        if(losersEntry) logger.log("declareLosers", { "losers": losersEntry.losers[0].characterType });
                        return { checkRules, logs: logger.getLogs() };
                    }
                }
                //here the character doesn't have a skill ready to use
                else
                {
                    logger.log("noResources", {"characterName": currentCharacters[i].name});
                }
            }
            else
            {
                //---------------------------------defeated or stunned
                logger.log("noResources", {"characterName": currentCharacters[i].name});
            }
        }
        triggerActions(data, currentCharacters, "onTurnEnd");
    }
}

function putcharactersInBattle(currentCharacters)
{
    let charactersInBattle = [];
    currentCharacters.forEach(character =>
    {
        if(character.inBattle === true)
        {
            charactersInBattle.push(character);
        }
    });
    return charactersInBattle;
}

function putAgentsincharacters(data, currentCharacters)
{
    data.agent.forEach(agent => {
        currentCharacters.forEach(character => {
            if(character.name === agent.assignTo)
            {
                character.agent = agent.behaviour;
            }
        });
    });

    return currentCharacters;
}

