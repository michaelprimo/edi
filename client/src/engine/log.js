//we used a class instead of a function for making things cleaner when logging
export class Logger {
    constructor() {
        this.logs = [];
    }
    
    //we call the function and put the result all in this.logs
    log(actionDictionary, actionValues) {
        this.logs.push(logDictionary(actionDictionary, actionValues));
    }

    getLogs() {
        return this.logs;
    }
}

//we can easily push fixed logs based on a specific word
function logDictionary(actionDictionary, actionValues)
{
    switch(actionDictionary)
    {
        case "damageDealt":
            return `OH NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO `;
        case "showTurns":
            return `TURNO ${actionValues.numberOfTurnsPassed}`;
        case "battlerTurnStart":
            return `Ora è il turno di ${actionValues.battlerName}! Stats: ${structuredClone(actionValues.battlerStats)} Status: Stats: ${structuredClone(actionValues.battlerStatus)}`;
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