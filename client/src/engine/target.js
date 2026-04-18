import { putAllSkillEffectsOnArray } from './skills.js';

export function getTargetForSkill(currentBattlers, current, selectedSkill) {

    let targetType = putAllSkillEffectsOnArray(selectedSkill);
    const sortedBattlers = [...currentBattlers].sort((a, b) => a.id - b.id);
    let targetBattlers = [];

    targetType.forEach(type => {
        switch(type)
        {
            case "all":
                targetBattlers = [...targetBattlers, ...sortedBattlers];
                break;

            case "allEnemies":
                targetBattlers = [...targetBattlers, ...sortedBattlers.filter(b => 
                    b.battlerType === current.targetType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )];
                break;

            case "enemy":
                targetBattlers = [...targetBattlers, sortedBattlers.find(b => 
                    b.battlerType === current.targetType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )].filter(Boolean);
                break;

            case "allTargets":
                targetBattlers = [...targetBattlers, ...sortedBattlers.filter(b => 
                    b.battlerType !== current.battlerType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )];
                break;

            case "target":
                targetBattlers = [...targetBattlers, sortedBattlers.find(b => 
                    b.battlerType !== current.battlerType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )].filter(Boolean);
                break;

            case "allAllies":
                targetBattlers = [...targetBattlers, ...sortedBattlers.filter(b => 
                    b.battlerType === current.battlerType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )];
                break;

            case "ally":
                targetBattlers = [...targetBattlers, sortedBattlers.find(b => 
                    b.battlerType === current.battlerType && 
                    (selectedSkill.targetOnlyWithStatus ? selectedSkill.targetOnlyWithStatus.some(s => b.status.some(bs => bs.name === s)) : b.stats.isTargetable === true)
                )].filter(Boolean);
                break;

            case "self":
                targetBattlers = [...targetBattlers, current];
                break;
        }
    });

    return targetBattlers;
}