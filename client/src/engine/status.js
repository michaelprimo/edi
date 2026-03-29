//vedere se creare una variabile temporanea come originalBattlerStats può aiutare
export function checkStatus(data, battler, statusTrigger) 
{

   

    //console.log("data.battlers:", structuredClone(data.battlers), " battler: ", structuredClone(battler), " statusTrigger: ", structuredClone(statusTrigger));
    for(let i=0; i<battler.length;i++)
    {
        
        if(battler[i].status.length <= 0 || battler[i].status === undefined)
        {
            //console.log(battler[i].name, " non ha status. Trigger attivo: ", statusTrigger);
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
                
                for(let j = 0; j<status.effects.length; j++)
                {
                    if(status.trigger === statusTrigger)
                    {   
                        if(status.effects[j].stat !== undefined)
                        {
                            if(status.applyOnce === true)
                            {
                                //battler[i].stats[status.effects[j].stat] = battler[i].baseStats[status.effects[j].stat];
                                //console.log("!La forza di ", battler[i].name, " è ora: ", battler[i].stats[status.effects[j]].stat)
                            }

                            switch(status.effects[j].operator)
                            {
                                case "+":
                                {
                                    battler[i].stats[status.effects[j].stat] += status.effects[j].value;
                                    //console.log("La forza di ", battler[i].name, " è ora: ", battler[i].stats[status.effects[j].stat])
                                    break;
                                }
                                case "-":
                                {
                                    battler[i].stats[status.effects[j].stat] -= status.effects[j].value;
                                    //console.log("La forza di ", battler[i].name, " è ora: ", battler[i].stats[status.effects[j].stat])
                                    break;
                                }
                                case "=":
                                {
                                    battler[i].stats[status.effects[j].stat] = status.effects[j].value;
                                    //console.log("La forza di ", battler[i].name, " è ora: ", battler[i].stats[status.effects[j].stat])
                                    break;
                                }
                            }  
                        }
                    }

                    if(status.repelStatus !== undefined)
                    {
                        //console.log("Status di ", battler[i].name, " prima: ", battler[i].status);
                        battler[i].status = battler[i].status.filter(s => !status.repelStatus.includes(s.name));
                        //console.log("Status di ", battler[i].name, " ripuliti: ", battler[i].status);
                    }
                    
                    if(status.turns > 0 && statusTrigger == "onTurnEnd")
                    {
                        if(status.applyOnce === true)
                        {
                            //console.log("status.applyOnce: ", status.applyOnce);
                            //console.log("status.effects[j].stat: ", status.effects[j].stat);
                            
                            battler[i].checkStatusParams.push(status.effects[j].stat);
                        }
                        //console.log("Turni dello stato prima ", status.name, " di ", battler[i].name, ": ", status.turns, "statusTrigger:", statusTrigger);
                        status.turns--;
                        //console.log("Turni dello stato dopo", status.name, " di ", battler[i].name, ": ", status.turns, "statusTrigger:", statusTrigger);
                    }
                }
            });
            
            //lo lascio così per ora perchè so che in futuro ci saranno skill che toglieranno turni agli status e quindi
            //dovrò mettere poi più controlli e varie
            battler[i].status = battler[i].status.filter(s => s.turns !== 0);
                 
        }
    }
       
}