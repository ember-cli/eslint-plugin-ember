'use strict';

const rules = require('../lib').rules;

describe('recommended rules', () => {
  it('has the right list', () => {
    const errors = [];

    Object.keys(rules).forEach(name => {
      if (rules[name].meta.docs.recommended) {
        errors.push(name);
      }
    });

    expect(errors).toMatchSnapshot();
  });
});
