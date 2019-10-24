'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-classic-components');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const { ERROR_MESSAGE } = rule;
const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
};
const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('no-classic-components', rule, {
  valid: ["import Component from '@glimmer/component';"],

  invalid: [
    {
      code: "import Component from '@ember/component';",
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
  ],
});
