'use strict';
const rules = require('../lib').rules;

describe('recommended rules', () => {
  it('has the right list', () => {
    const errors = [];

    for (const name of Object.keys(rules)) {
      if (rules[name].meta.docs.recommended) {
        errors.push(name);
      }
    }

    expect(errors).toMatchSnapshot();
  });

  it('gjs config has the right list', () => {
    const errors = [];

    for (const name of Object.keys(rules)) {
      if (rules[name].meta.docs.recommendedGjs) {
        errors.push(name);
      }
    }

    expect(errors).toMatchSnapshot();
  });

  it('gts config has the right list', () => {
    const errors = [];

    for (const name of Object.keys(rules)) {
      if (rules[name].meta.docs.recommendedGts) {
        errors.push(name);
      }
    }

    expect(errors).toMatchSnapshot();
  });
});
