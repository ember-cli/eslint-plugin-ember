'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-leaking-state-in-program-scope');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('no-leaking-state-in-program-scope', rule, {
  valid: [
    `const foo = "bar";`,
    `export default Ember.Service.extend({
      init() {
        var foo = "bar";
      }
    });`,
  ],

  invalid: [
    {
      code: `var foo = "bar";`,
      errors: [{ message: 'Use const on global scope', type: 'VariableDeclaration' }],
    },
    {
      code: `let foo = "bar";`,
      errors: [{ message: 'Use const on global scope', type: 'VariableDeclaration' }],
    },
  ],
});
