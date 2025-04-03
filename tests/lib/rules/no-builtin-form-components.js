'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-builtin-form-components');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const { ERROR_MESSAGE } = rule;
const parserOptions = {
  ecmaVersion: 2022,
  sourceType: 'module',
};
const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('no-builtin-form-components', rule, {
  valid: [
    "import Component from '@ember/component';",
    "import { setComponentTemplate } from '@ember/component';",
    "import { helper } from '@ember/component/helper';",
    "import { Input } from 'custom-component';",
    "import { Textarea } from 'custom-component';",
  ],

  invalid: [
    {
      code: "import { Input } from '@ember/component';",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'ImportSpecifier',
        },
      ],
    },
    {
      code: "import { Textarea } from '@ember/component';",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'ImportSpecifier',
        },
      ],
    },
    {
      code: "import { Input, Textarea } from '@ember/component';",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'ImportSpecifier',
        },
        {
          message: ERROR_MESSAGE,
          type: 'ImportSpecifier',
        },
      ],
    },
    {
      code: "import { Input as EmberInput } from '@ember/component';",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'ImportSpecifier',
        },
      ],
    },
    {
      code: "import { Textarea as EmberTextarea } from '@ember/component';",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'ImportSpecifier',
        },
      ],
    },
  ],
});
