import * as math from 'mathjs';

export function getDamageValueFromFormula(formula, attacker, defender)
{
    
   const scope = {};
    Object.keys(attacker.stats).forEach(stat => scope[`a_${stat}`] = attacker.stats[stat]);
    Object.keys(defender.stats).forEach(stat => scope[`b_${stat}`] = defender.stats[stat]);
    
    console.log("risultato:", math.evaluate(formula, scope));

    return math.evaluate(formula, scope);
}

export function applySkillDamageFormula(defenderTargetStat, damageValueFromFormula, skillEffectOperator)
{

    switch(skillEffectOperator)
    {
        case "+":
            return defenderTargetStat += damageValueFromFormula;
        case "-":
            return defenderTargetStat -= damageValueFromFormula;
        case "*":
            return defenderTargetStat *= damageValueFromFormula;
        case "/":
            return defenderTargetStat /= damageValueFromFormula;
        default:
            return defenderTargetStat;
    }
    
}