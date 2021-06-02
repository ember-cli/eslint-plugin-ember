//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-invalid-debug-function-arguments');
const RuleTester = require('eslint').RuleTester;
const javascriptUtils = require('../../../lib/utils/javascript');

const { DEBUG_FUNCTIONS, ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const VALID_USAGES_BASIC = [
  {
    code: "myFunction(true, 'My string.');",
  },
  {
    code: "Ember.myFunction(true, 'My string.');",
  },
];

const VALID_USAGES_FOR_EACH_DEBUG_FUNCTION = javascriptUtils.flat(
  DEBUG_FUNCTIONS.map((debugFunction) => [
    {
      code: `import { ${debugFunction} } from '@ember/debug'; OtherClass.${debugFunction}(true, 'My string.');`,
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}();`,
    },
    {
      code: `Ember.${debugFunction}();`,
    },
    {
      // Missing import:
      code: `${debugFunction}(true, 'My string.');`,
    },
    {
      // Wrong import:
      code: `import { ${debugFunction} } from 'something-else'; ${debugFunction}(true, 'My string.');`,
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}('My description.');`,
    },
    {
      code: `Ember.${debugFunction}('My description.');`,
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}('My description.', true);`,
    },
    {
      code: `Ember.${debugFunction}('My description.', true);`,
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}('My description.', true, { id: 'some-id' });`,
    },
    {
      code: `Ember.${debugFunction}('My description.', true, { id: 'some-id' });`,
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}('My description.', CONDITION);`,
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}(DESCRIPTION, true);`,
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}(DESCRIPTION, CONDITION);`,
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}.unrelatedFunction(true, 'My description.');`,
    },
    {
      code: `Ember.${debugFunction}.unrelatedFunction(true, 'My description.');`,
    },
  ])
);

const VALID_USAGES = [...VALID_USAGES_BASIC, ...VALID_USAGES_FOR_EACH_DEBUG_FUNCTION];

const INVALID_USAGES = javascriptUtils.flat(
  DEBUG_FUNCTIONS.map((debugFunction) => [
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}(true, 'My description.');`,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `Ember.${debugFunction}(true, 'My description.');`,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}(true, 'My description.', { id: 'some-id' });`,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `Ember.${debugFunction}(true, 'My description.', { id: 'some-id' });`,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}(true, \`My \${123} description.\`);`,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}(CONDITION, 'My description.');`,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `import { ${debugFunction} } from '@ember/debug'; ${debugFunction}(CONDITION, \`My \${123} description.\`);`,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ])
);

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-invalid-debug-function-arguments', rule, {
  valid: VALID_USAGES,
  invalid: INVALID_USAGES,
});
