export function checkStatus(originalBattler, battler, takeTurn) 
{
    //console.log("takeTurn: ", takeTurn);
    for(let i=0; i<battler.length;i++)
    {
        console.log(battler[i].name, " status prima: ", structuredClone(battler[i].status));
        if(battler[i].status.length <= 0 || battler[i].status === undefined)
        {
            //console.log("Ehi," , battler[i].name, " è passato di qui senza status");
            continue;
        }
        else
        {

            battler[i].status.sort(
            (a,b)=>(b.priority ?? 100) - (a.priority ?? 100)
            );

            battler[i].isTargetable = originalBattler[i].isTargetable;
            battler[i].canHaveTurns = originalBattler[i].canHaveTurns;
           
            battler[i].status.forEach(status => {
                console.log(battler[i].name, " ha ", status.name, " tra i suoi status");
                if(status.effects.isTargetable !== undefined)
                {
                    //console.log("isTargetable di ", battler[i].name, " prima (stun): ", battler[i].isTargetable);
                     battler[i].isTargetable = status.effects.isTargetable;
                     //console.log("isTargetable di ", battler[i].name, " dopo (stun): ", battler[i].isTargetable);
                }
                if(status.effects.canHaveTurns !== undefined)
                {
                     battler[i].canHaveTurns = status.effects.canHaveTurns;
                }
                //sistemare il bug del && takeTurn == true che non fa funzionare tutto e vedere se questo codice toglie un turno a tutti
                //i player (e non dovrebbe accadere) oppure no
                if(status.turns > 0 )
                {
                    console.log("OH NO! MANCANO ANCORA ", status.turns, " TURNI!!!");
                    status.turns--;
                    console.log(status.name, " dentro ", battler[i].name, " sarà attivo ancora per ", status.turns, " turni");
                    console.log(structuredClone(status))
                }
            });
            
            //lo lascio così per ora perchè so che in futuro ci saranno skill che toglieranno turni agli status e quindi
            //dovrò mettere poi più controlli e varie
            battler[i].status = battler[i].status.filter(s => s.turns !== 0);
                    
        }
        console.log(battler[i].name, " status dopo: ", structuredClone(battler[i].status));
    }
       
}