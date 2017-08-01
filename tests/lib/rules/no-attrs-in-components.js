'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-attrs-in-components');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-attrs-in-components', rule, {
  valid: [
    {
      code: `Component.extend({
        init() {
          const newName = get(this, '_name');
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    }
  ],

  invalid: [
    {
      code: `Component.extend({
        init() {
          const newName = this.attrs.name;
        }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Do not use this.attrs',
      }]
    }
  ]
});
