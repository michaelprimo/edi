import * as math from 'mathjs';
import { Logger } from './log.js';

export function getDamageValueFromFormula(formula, attacker, defender)
{
    
   const scope = {};
    Object.keys(attacker.stats).forEach(stat => scope[`a_${stat}`] = attacker.stats[stat]);
    Object.keys(defender.stats).forEach(stat => scope[`b_${stat}`] = defender.stats[stat]);

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
        case "=":
            return defenderTargetStat = damageValueFromFormula;
        default:
            return defenderTargetStat;
    }
    
}

export function calculateSkillEffect(selectedSkill, logger, chooseTarget, currentCharacters)
{
    //get the value from the skill to use for healing or damaging the target's resources
    const damageValueFromSkillFormula = getDamageValueFromFormula(selectedSkill.value, currentCharacters, chooseTarget);

    //manipulate the results with the data and the Math.js formula
    chooseTarget.stats[selectedSkill.targetStat] =
        applySkillDamageFormula(chooseTarget.stats[selectedSkill.targetStat], damageValueFromSkillFormula, selectedSkill.operator);

    switch(selectedSkill.operator)
    {
        case "+":
            logger.log("damageHealedWithSkill", {
                "targetName": chooseTarget.name,
                "damageAmount": damageValueFromSkillFormula
            });
            break;
        case "-":
            logger.log("damageDealtWithSkill", {
                "targetName": chooseTarget.name,
                "damageAmount": damageValueFromSkillFormula
            });
            break;
        default:
            break;
    }
}