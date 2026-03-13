export function validateData(data) {
    const rules = data.rules;
    const battlers = data.battlers;

    // controlla tutte le regole
    const areRulesOkay = rules.every(rule => {
        const statName = rule.condition.stat;

        // ogni battler deve avere questa stat
        return battlers.every(battler => battler.stats.hasOwnProperty(statName));
    });

    if (!areRulesOkay) {
        return "Not every battler has the stats required by the rules. Check your JSON!";
    }

    return true;
}