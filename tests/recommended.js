'use strict';

const rules = require('../lib/index.js').rules;

test('recommended rules', () => {
  const errors = [];

  Object.keys(rules).forEach(name => {
    if (rules[name].meta.docs.recommended) {
      errors.push(name);
    }
  });

  expect(errors).toMatchSnapshot();
});
