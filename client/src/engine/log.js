export class Logger {
    constructor() {
        this.logs = [];
    }
    
    log(actionDictionary, actionValues) {
        this.logs.push(logDictionary(actionDictionary, actionValues));
    }
    
    getLogs() {
        return this.logs;
    }
}

function logDictionary(actionDictionary, actionValues)
{
    switch(actionDictionary)
    {
        case "showTurns":
            return `TURNO ${actionValues.numberOfTurnsPassed}`;
        case "battlerTurnStart":
            return `Ora è il turno di ${actionValues.battlerName}! Stats: ${structuredClone(actionValues.battlerStats)}`;
        case "skillUse":
            return `${actionValues.battlerName} usa ${actionValues.battlerSkillName}!`;
        case "damageDealtWithSkill":
            return `${actionValues.targetName} ha subito ${actionValues.damageAmount} danni!`;
        case "damageHealedWithSkill":
            return `${actionValues.targetName} si è curato di ${actionValues.damageAmount}!`;
        case "noTargets":
            return `${actionValues.battlerName} non può usare skills a causa della mancanza di target!`;
        case "noResources":
            return `${actionValues.battlerName} non può usare skills a causa della mancanza di risorse!`;
        case "declareWinners":
            return `${actionValues.winners} è il gruppo vincente!`;
        case "declareLosers":
            return `${actionValues.losers} è il gruppo perdente...`;
        default:
            break;
    }
}