import { putAllTargetsOfAllSkillEffectsOnArray } from './skills.js';

function isValidTarget(character, selectedSkill)
{
    if(selectedSkill.targetOnlyWithStatus)
    {
        return selectedSkill.targetOnlyWithStatus.some(s => character.status.some(characterStatus => characterStatus.name === s));
    }
    return character.stats.isTargetable === true;
}

function getRandomTarget(array)
{
    if(array.length === 0) return [];
    return [array[Math.floor(Math.random() * array.length)]];
}

export function getTargetForSkill(currentCharacters, character, selectedSkill, k)
{
    const targetTypes = putAllTargetsOfAllSkillEffectsOnArray(selectedSkill);
    console.log("targets:", targetTypes[k], " k: ", k, "normal targetTypes: ", targetTypes);
    const getOpponentTargets = currentCharacters.filter(c => c.characterType === character.targetType && isValidTarget(c, selectedSkill));
    const getFriendlyTargets = currentCharacters.filter(c => c.characterType === character.characterType && isValidTarget(c, selectedSkill));
    const getFriendlyTargetsExceptSelf = currentCharacters.filter(c => c.characterType === character.characterType && c !== character && isValidTarget(c, selectedSkill));
    const getOtherTargets = currentCharacters.filter(c => c.characterType !== character.characterType && isValidTarget(c, selectedSkill));
    let targetCharacters = [];

        switch(targetTypes[k])
        {
            case "all":
            {
                const getEveryTarget = currentCharacters.filter(b => isValidTarget(b, selectedSkill));
                targetCharacters = [ ...getEveryTarget];
                break;
            }
            case "allyExceptSelf":
            {
                targetCharacters = [ ...getFriendlyTargetsExceptSelf];
                break;
            }
            case "allEnemies":
            {
                targetCharacters = [ ...getOpponentTargets];
                break;
            }
            case "enemy":
            {
                targetCharacters = [ ...getRandomTarget(getOpponentTargets)];
                break;
            }
            case "allTargets":
            {
                
                targetCharacters = [...targetCharacters, ...getOtherTargets];
                break;
            }
            case "target":
            {
                targetCharacters = [...targetCharacters, ...getRandomTarget(getOtherTargets)];
                break;
            }
            case "allAllies":
            {
                targetCharacters = [...targetCharacters, ...getFriendlyTargets];
                break;
            }
            case "ally":
            {
                targetCharacters = [...targetCharacters, ...getRandomTarget(getFriendlyTargets)];
                break;
            }
            case "self":
            {
                targetCharacters = [...targetCharacters, character];
                break;
            }
        };

    return targetCharacters;
}
//character, chooseTarget, currentCharacters
export function resolveStatusTargets(targetMode, character, chooseTarget, currentCharacters)
{
    if(!character) return [];

    const roster = currentCharacters ?? [];
    const firstBy = (predicate) => roster.find(predicate);
    const allBy = (predicate) => roster.filter(predicate);
    const isTargetable = (character) => character?.stats?.isTargetable === true;

    switch(targetMode)
    {
        case "self":
            return [character];
        case "ally":
            return [firstBy(b => b.characterType === character.characterType && isTargetable(b))].filter(Boolean);
        case "allAllies":
            return allBy(b => b.characterType === character.characterType && isTargetable(b));
        case "enemy":
            return [firstBy(b => b.characterType === character.targetType && isTargetable(b))].filter(Boolean);
        case "allEnemies":
            return allBy(b => b.characterType === character.targetType && isTargetable(b));
        case "target":
            return [firstBy(b => b.characterType !== character.characterType && isTargetable(b))].filter(Boolean);
        case "allTargets":
            return allBy(b => b.characterType !== character.characterType && isTargetable(b));
        case "all":
            return roster;
        case "skillTarget":
        default:
            return chooseTarget ? [chooseTarget] : [];
    }
}