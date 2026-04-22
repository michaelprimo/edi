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
                            if(status.applyOnce === true)
                            {
                                
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
                            battler[i].checkStatusParams.push(status.effects[j].stat);
                        }
                        status.turns--;
                    }
                }
            });
            
            battler[i].status = battler[i].status.filter(s => s.turns !== 0);
                 
        }
    }
       
}