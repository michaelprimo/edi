export function getTargetForSkill(currentBattlers, battlerIndex, targetType) {


    const sortedBattlers = [...currentBattlers].sort((a, b) => a.id - b.id);

    const current = currentBattlers[battlerIndex];

    let target = targetType === "enemy" 
        ? current.targetType 
        : targetType;

    let targetBattlers;

    switch(targetType)
    {
        case "all":
            targetBattlers = sortedBattlers;
            break;

        case "allEnemies":
            targetBattlers = sortedBattlers.filter(b => 
                b.battlerType === target && b.stats.isTargetable === true
            );
            break;

        case "enemy":
            targetBattlers = [sortedBattlers.find(b => 
                b.battlerType === target && b.stats.isTargetable === true
            )];
            break;

        case "allTargets":
            targetBattlers = sortedBattlers.filter(b => 
                b.battlerType !== current.battlerType && b.stats.isTargetable === true
            );
            break;

        case "target":
            targetBattlers = [sortedBattlers.find(b => 
                b.battlerType !== current.battlerType && b.stats.isTargetable === true
            )];
            break;

        case "allAllies":
            targetBattlers = sortedBattlers.filter(b => 
                b.battlerType === current.battlerType && b.stats.isTargetable === true
            );
            //console.log("allies:", targetBattlers);
            break;

        case "ally":
            targetBattlers = [sortedBattlers.find(b => 
                b.battlerType === current.battlerType && b.stats.isTargetable === true
            )];
            //console.log("allies:", targetBattlers);
            break;

        case "self":
            targetBattlers = [current];
            //console.log("self:", targetBattlers);
            break;
    }

    return targetBattlers;
}