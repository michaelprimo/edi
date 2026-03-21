export function applySkillDamageFormula(attackerDamage, defenderStats, damageOperator)
{
    switch(damageOperator)
    {
        case "+":
            return defenderStats += attackerDamage;
        case "-":
            return defenderStats -= attackerDamage;
        case "*":
            return defenderStats *= attackerDamage;
        case "/":
            return defenderStats /= attackerDamage;
        default:
            return defenderStats;
    }
    
}