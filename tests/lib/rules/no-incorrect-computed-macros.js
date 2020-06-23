'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-incorrect-computed-macros');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const { ERROR_MESSAGE_AND_OR } = rule;
const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: { legacyDecorators: true },
  },
});

ruleTester.run('no-incorrect-computed-macros', rule, {
  valid: [
    // Correct usage:
    `import { and } from '@ember/object/computed';
     and('someProperty1', 'someProperty2')`,
    `import { or } from '@ember/object/computed';
     or('someProperty1', 'someProperty2')`,

    // Spread element:
    `import { and } from '@ember/object/computed';
     and(...deps)`,
    `import { or } from '@ember/object/computed';
     or(...deps)`,

    // Brace expansion:
    `import { and } from '@ember/object/computed';
    and('user.{name,token}')`,
    `import { or } from '@ember/object/computed';
    or('user.{name,token}')`,

    // Wrong function:
    `import { and } from '@ember/object/computed';
     and.random()`,
    `import { or } from '@ember/object/computed';
     or.random()`,

    // Wrong function:
    `import { and } from '@ember/object/computed';
     random.and()`,
    `import { and } from '@ember/object/computed';
    random.or()`,

    // Not from the right import.
    'and()',
    'or()',

    // One test case with decorators:
    `import { and } from '@ember/object/computed';
     class Test { @and('someProperty1', 'someProperty2') prop }`,
  ],

  invalid: [
    {
      code: `
      import { and } from '@ember/object/computed';
      and()`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_AND_OR,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
      import { or } from '@ember/object/computed';
      or()`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_AND_OR,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
      import { and } from '@ember/object/computed';
      and('someProperty')`,
      output: `
      import { readOnly } from '@ember/object/computed';
import { and } from '@ember/object/computed';
      readOnly('someProperty')`,
      errors: [
        {
          message: ERROR_MESSAGE_AND_OR,
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
      import { or } from '@ember/object/computed';
      or('someProperty')`,
      output: `
      import { readOnly } from '@ember/object/computed';
import { or } from '@ember/object/computed';
      readOnly('someProperty')`,
      errors: [
        {
          message: ERROR_MESSAGE_AND_OR,
          type: 'Identifier',
        },
      ],
    },
    {
      // One test case with decorators:
      code: `
      import { and } from '@ember/object/computed';
      class Test { @and('someProperty') prop }`,
      output: `
      import { readOnly } from '@ember/object/computed';
import { and } from '@ember/object/computed';
      class Test { @readOnly('someProperty') prop }`,
      errors: [
        {
          message: ERROR_MESSAGE_AND_OR,
          type: 'Identifier',
        },
      ],
    },
  ],
});
