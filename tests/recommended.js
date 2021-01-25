'use strict';

const rules = require('../lib').rules;

describe('recommended rules', () => {
  it('has the right list', () => {
    const errors = [];

    for (const name of Object.keys(rules)) {
      // eslint-disable-next-line jest/no-if
      if (rules[name].meta.docs.recommended) {
        errors.push(name);
      }
    }

    expect(errors).toMatchSnapshot();
  });
});
