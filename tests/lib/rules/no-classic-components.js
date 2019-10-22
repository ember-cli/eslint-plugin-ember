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
const ruleTester = new RuleTester();
const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
};

ruleTester.run('no-classic-components', rule, {
  valid: [
    {
      code: "import Component from '@glimmer/component'",
      parserOptions,
    },
  ],

  invalid: [
    {
      code: "import Component from '@ember/component'",
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
      parserOptions,
    },
  ],
});
