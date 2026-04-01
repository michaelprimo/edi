export function addTextLog(gameLogs, actionDictionary, actionValues)
{
    let stringToLog = logDictionary(actionDictionary, actionValues);
    gameLogs.textLogs.push(stringToLog);
    return gameLogs;
}

function logDictionary(actionDictionary, actionValues)
{
    switch(actionDictionary)
    {
        case "showTurns":
            return `TURNO ${actionValues.numberOfTurnsPassed}`;
        case "battlerTurnStart":
            return `Ora è il turno di ${actionValues.battlerName}! Stats: ${actionValues.battlerStats}`;
        case "skillUse":
            return `${actionValues.battlerName} usa ${actionValues.battlerSkillName}!`;
        case "damageDealtWithSkill":
            return `${actionValues.targetName} ha subito ${actionValues.damageAmount} danni!`;
        case "noTargets":
            return `${actionValues.battlerName} non può usare skills a causa della mancanza di target!`;
        case "noResources":
            return `${actionValues.battlerName} non può usare skills a causa della mancanza di risorse!`;
        default:
            break;
    }
}