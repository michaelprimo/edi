export function checkStatus(battler, takeTurn) {

    for(let i=0; i<battler.length;i++)
    {

    
        if(battler[i].status === undefined || battler[i].status.length === 0) continue;

        battler[i].status.forEach(status => {
            const effects = status.effects;

            // Tipo 1: modifica una stat (ha "stat" e "operator")
            if(effects.stat) {
                if(!battler[i].statModifiers) battler[i].statModifiers = [];
                
                const alreadyExists = battler[i].statModifiers.some(
                    m => m.stat === effects.stat && m.source === status.name
                );
                
                if(!alreadyExists) {
                    battler[i].statModifiers.push({
                        stat: effects.stat,
                        value: Number(effects.value),
                        source: status.name
                    });
                }
            }
            
            // Tipo 2: proprietà diretta del battler[i] (isTargetable, canHaveTurns)
            else {
                Object.entries(effects).forEach(([key, value]) => {
                    battler[i][key] = value;
                });
            }
        });

        // Scala i turni e rimuove gli status scaduti
        if(takeTurn) {
            battler[i].status = battler[i].status
                .map(s => ({ ...s, turns: s.turns > 0 ? s.turns - 1 : s.turns }))
                .filter(s => s.turns !== 0);
                
            // Rimuove anche i modifiers degli status scaduti
            if(battler[i].statModifiers) {
                battler[i].statModifiers = battler[i].statModifiers
                    .filter(m => battler[i].status.some(s => s.name === m.source));
            }
        }

    }
}