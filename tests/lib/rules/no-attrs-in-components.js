'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-attrs-in-components');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run('no-attrs-in-components', rule, {
  valid: [
    `Component.extend({
        init() {
          const newName = get(this, '_name');
        }
      });`,
  ],

  invalid: [
    {
      code: `Component.extend({
        init() {
          const newName = this.attrs.name;
        }
      });`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
  ],
});
