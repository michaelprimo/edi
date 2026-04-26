//vedere se creare una variabile temporanea come originalBattlerStats può aiutare
export function checkStatus(data, battler, statusTrigger) 
{
    for(let i=0; i<battler.length;i++)
    {
        
        if(battler[i].status.length <= 0 || battler[i].status === undefined)
        {
            continue;
        }
        else
        {
            
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
                            if(status.applyOnce === true) {
                                console.log(battler[i].id);
                               
                                const originalBattler = data.battlers.find(b => b.id === battler[i].id);

                                if (originalBattler) 
                                {
                                    console.log("Trovato originale!", originalBattler.name);
                                    
                                    let baseValue = originalBattler.stats[status.effects[j].stat];
                                  
                                    battler[i].stats[status.effects[j].stat] = baseValue;
                                } 
                                else 
                                {
                                    console.error("Non ho trovato il battler con ID:", battler[i].id, "dentro data.battlers");
                                }
                        }

                            switch(status.effects[j].operator)
                            {
                                case "+":
                                {
                                    battler[i].stats[status.effects[j].stat] += status.effects[j].value;
                                    
                                    break;
                                }
                                case "-":
                                {
                                    battler[i].stats[status.effects[j].stat] -= status.effects[j].value;
                                    
                                    break;
                                }
                                case "*":
                                {
                                    battler[i].stats[status.effects[j].stat] *= status.effects[j].value;
                                    
                                    break;
                                }
                                case "/":
                                {
                                    battler[i].stats[status.effects[j].stat] /= Math.floor(status.effects[j].value);
                                    
                                    break;
                                }
                                case "=":
                                {
                                    battler[i].stats[status.effects[j].stat] = status.effects[j].value;
                                    break;
                                }
                            }  
                        }
                    }

                    if(status.repelStatus !== undefined)
                    {
                        battler[i].status = battler[i].status.filter(s => !status.repelStatus.includes(s.name));
                    }
                    
                    if(status.turns > 0 && statusTrigger == "onTurnEnd")
                    {
                        if(status.applyOnce === true)
                        {
                            console.log("battler:", battler[i]);
                            battler[i].checkStatusParams.push(status.effects[j].stat);
                        }
                        status.turns--;
                    }
                }
            });
            
            battler[i].status = battler[i].status.filter(s => s.turns !== 0 && s.stacks !== 0);
                 
        }
    } 
}