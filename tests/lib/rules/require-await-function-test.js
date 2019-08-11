const rule = require('../../../lib/rules/require-await-function-call');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
});

const VALID_USAGES = [
  {
    code: 'async function myFunction() { await click(); }',
  },
  {
    code: 'async function myFunction() { await asyncFunc(); }',
    options: [{ functions: ['asyncFunc'] }],
  },
  {
    // When the 'AwaitExpression' isn't the direct parent of the 'CallExpression'.
    code: 'async function myFunction() { await asyncFunc().then(() => {}); }',
    options: [{ functions: ['asyncFunc'] }],
  },
  {
    // Not one of the specified functions.
    code: 'otherFunc();',
    options: [{ functions: ['asyncFunc'] }],
  },
  {
    // Not one of the specified functions.
    code: 'async function myFunction() { await otherAsyncFunc(); }',
    options: [{ functions: ['asyncFunc'] }],
  },
];

const INVALID_USAGES = [
  {
    // Missing `await`.
    code: 'async function test() { asyncFunc(); }',
    options: [{ functions: ['asyncFunc'] }],
    output: 'async function test() { await asyncFunc(); }',
    errors: [
      {
        message: 'Use `await` with `asyncFunc` function call.',
        type: 'CallExpression',
      },
    ],
  },
  {
    // Missing `await` and part of promise chain.
    code: 'async function test() { asyncFunc().then(() => {}); }',
    options: [{ functions: ['asyncFunc'] }],
    output: 'async function test() { await asyncFunc().then(() => {}); }',
    errors: [
      {
        message: 'Use `await` with `asyncFunc` function call.',
        type: 'CallExpression',
      },
    ],
  },
  {
    // Missing `await` but inside another `await` function call.
    code:
      'async function topLevelFunction() { await otherAsyncFunc(async () => { asyncFunc(); }); }',
    options: [{ functions: ['asyncFunc'] }],
    output:
      'async function topLevelFunction() { await otherAsyncFunc(async () => { await asyncFunc(); }); }',
    errors: [
      {
        message: 'Use `await` with `asyncFunc` function call.',
        type: 'CallExpression',
      },
    ],
  },
  {
    // Missing `await` on one of the default Ember async test helpers.
    code: 'async function test() { click(); }',
    output: 'async function test() { await click(); }',
    errors: [
      {
        message: 'Use `await` with `click` function call.',
        type: 'CallExpression',
      },
    ],
  },
];

ruleTester.run('require-await-function-call', rule, {
  valid: VALID_USAGES,
  invalid: INVALID_USAGES,
});
