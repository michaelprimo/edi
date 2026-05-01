import { putAllTargetsOfAllSkillEffectsOnArray } from './skills.js';

export function getTargetForSkill(currentCharacters, character, selectedSkill) {

    let targetType = putAllTargetsOfAllSkillEffectsOnArray(selectedSkill);
    const sortedcharacters = [...currentCharacters].sort((a, b) => a.id - b.id);
    let targetcharacters = [];

    targetType.forEach(type => {
        switch(type)
        {
            case "all":
                targetcharacters = currentCharacters;
                break;

            case "allEnemies":
                targetcharacters = [...targetcharacters, ...sortedcharacters.filter(b => 
                    b.characterType === character.targetType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )];
                break;

            case "enemy":
                targetcharacters = [...targetcharacters, sortedcharacters.find(b => 
                    b.characterType === character.targetType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )].filter(Boolean);
                break;

            case "allTargets":
                targetcharacters = [...targetcharacters, ...sortedcharacters.filter(b => 
                    b.characterType !== character.characterType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )];
                break;

            case "target":
                targetcharacters = [...targetcharacters, sortedcharacters.find(b => 
                    b.characterType !== character.characterType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )].filter(Boolean);
                break;

            case "allAllies":
                targetcharacters = [...targetcharacters, ...sortedcharacters.filter(b => 
                    b.characterType === character.characterType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )];
                break;

            case "ally":
                targetcharacters = [...targetcharacters, sortedcharacters.find(b => 
                    b.characterType === character.characterType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )].filter(Boolean);
                break;

            case "self":
                targetcharacters = [...targetcharacters, character];
                break;
        }
    });

    return targetcharacters;
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