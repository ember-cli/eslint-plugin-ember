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
  ecmaVersion: 2020,
  sourceType: 'module',
};
const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('no-classic-components', rule, {
  valid: [
    "import Component from '@glimmer/component';",
    "import { setComponentTemplate } from '@ember/component';",
    "import { helper } from '@ember/component/helper';",
  ],

  invalid: [
    {
      code: "import Component from '@ember/component';",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'ImportDefaultSpecifier',
        },
      ],
    },
  ],
});
