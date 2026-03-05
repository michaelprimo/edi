// tests/engine.test.js
import { describe, it, expect } from 'vitest';
import { validateData } from '../engine/engine.js';

describe('validateData', () => {

  it('should return an error message if a battler lacks a required stat', () => {
    const data = {
      rules: [
        { condition: { stat: "Health", operator: "<=" }, effect: "lose" }
      ],
      battlers: [
        { name: "Player1", stats: { Health: 10 }, skills: [] },
        { name: "Enemy1", stats: { }, skills: [] } // manca Health
      ]
    };

    expect(validateData(data)).toBe("Not every battler has the stats required by the rules. Check your JSON!");
  });

});