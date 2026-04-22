export function shuffleObjects(array, gameVariables) {
    console.warn("turnsystem.js: Aggiungere 'Initiative Battle System','Standard Battle System','AGI Battle System','Party/Classic Battle System'");
    const shuffled = structuredClone(array);
    
    if (gameVariables.turnSystemMainStat) 
    {
    const statName = gameVariables.turnSystemMainStat;

    shuffled.sort((a, b) => 
    {
        
        const statA = a.stats[statName];
        const statB = b.stats[statName];

        return statB - statA;
    });
    }
    else
    {
        for (let i = shuffled.length - 1; i > 0; i--) 
        {
            //questo "random" deve essere sistemato con qualcos'altro che dia RNG seedato
            const randomIndex = Math.floor(Math.random() * (i + 1)); 
            [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
        }
    }
    return shuffled;
    }