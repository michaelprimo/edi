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
        case "characterTurnStart":
            return `Ora è il turno di ${actionValues.characterName}! Stats: ${structuredClone(actionValues.characterstats)} Status: Stats: ${structuredClone(actionValues.characterstatus)}`;
        case "skillUse":
            return `${actionValues.characterName} usa ${actionValues.characterskillName}!`;
        case "damageDealtWithSkill":
            return `${actionValues.targetName} ha subito ${actionValues.damageAmount} danni!`;
        case "damageHealedWithSkill":
            return `${actionValues.targetName} si è curato di ${actionValues.damageAmount}!`;
        case "noTargets":
            return `${actionValues.characterName} non può usare skills a causa della mancanza di target!`;
        case "noResources":
            return `${actionValues.characterName} non può usare skills a causa della mancanza di risorse!`;
        case "declareWinners":
            return `${actionValues.winners} è il gruppo vincente!`;
        case "declareLosers":
            return `${actionValues.losers} è il gruppo perdente...`;
        default:
            break;
    }
}