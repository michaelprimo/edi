export function validateData(data) {
    const rules = data.rules;
    const characters = data.characters;

    // controlla tutte le regole
    const areRulesOkay = rules.every(rule => {
        const statName = rule.condition.stat;

        // ogni character deve avere questa stat
        return characters.every(character => character.stats.hasOwnProperty(statName));
    });

    if (!areRulesOkay) {
        return "Not every character has the stats required by the rules. Check your JSON!";
    }

    return true;
}