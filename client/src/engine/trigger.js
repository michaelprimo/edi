import { checkRuleCondition } from '.././engine/rules.js';
import { checkStatus } from './status.js';

export function triggerActions(data, target, trigger)
{
    let checkRules;
    
    checkRules = checkRuleCondition(data, target, trigger);
    checkStatus(data, target, trigger);
    return checkRules;
}