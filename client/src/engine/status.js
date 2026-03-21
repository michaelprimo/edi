//vedere se creare una variabile temporanea come originalBattlerStats può aiutare
export function checkStatus(data, battler, statusTrigger) 
{
    
   const orderMap = new Map(data.battlers.map((b, i) => [b.id, i]));

    battler.sort((a, b) => orderMap.get(a.id) - orderMap.get(b.id));

    console.log("data.battlers:", data.battlers, " battler: ", battler)
    for(let i=0; i<battler.length;i++)
    {
        
        if(battler[i].status.length <= 0 || battler[i].status === undefined)
        {
            console.log(battler[i].name, " non ha status. Trigger attivo: ", statusTrigger);
            continue;
        }
        else
        {
            
            //console.log("originalBattlerStats:", originalBattlerStats);
            //console.log(battler[i].name, " ha questi status: ", battler[i].status, " Trigger attivo: ", statusTrigger);
            battler[i].status.sort(
            (a,b)=>(b.priority ?? 100) - (a.priority ?? 100)
            );
           
            battler[i].status.forEach(status => 
            {
                if(status.trigger === statusTrigger)
                {
                    //console.log("statusTrigger dentro il forEach:", statusTrigger);
                    //console.log(battler[i].name, " ha ", status.name, " tra i suoi status");
                    if(status.effects.isTargetable !== undefined)
                    {
                        
                        battler[i].isTargetable = status.effects.isTargetable;
                        
                    }
                    if(status.effects.canHaveTurns !== undefined)
                    {
                        
                        battler[i].canHaveTurns = status.effects.canHaveTurns;
                        
                    }

                    
                    if(status.effects.stat !== undefined)
                    {
                        //console.log("statusTrigger dentro a stat:", statusTrigger);
                        if(status.applyOnce === true)
                        {
                            battler[i].stats[status.effects.stat] = battler[i].baseStats[status.effects.stat];
                            console.log("!La forza di ", battler[i].name, " è ora: ", battler[i].stats[status.effects.stat])
                        }

                        switch(status.effects.operator)
                        {
                            case "+":
                            {
                                battler[i].stats[status.effects.stat] += status.effects.value;
                                console.log("La forza di ", battler[i].name, " è ora: ", battler[i].stats[status.effects.stat])
                                break;
                            }
                        }
                        
                    }

                    if(status.turns > 0)
                    {
                        
                        if(status.applyOnce === true)
                        {
                            console.log("status.applyOnce: ", status.applyOnce);
                            console.log("status.effects.stat: ", status.effects.stat);
                            battler[i].checkStatusParams.push(status.effects.stat);
                        }
                        //console.log("Turni dello stato prima ", status.name, " di ", battler[i].name, ": ", status.turns);
                        status.turns--;
                        //console.log("Turni dello stato dopo", status.name, " di ", battler[i].name, ": ", status.turns);
                    }
                }
                //battler[i] = originalBattlerStats;
            });
            
            //lo lascio così per ora perchè so che in futuro ci saranno skill che toglieranno turni agli status e quindi
            //dovrò mettere poi più controlli e varie
            battler[i].status = battler[i].status.filter(s => s.turns !== 0);
                 
        }
    }
       
}