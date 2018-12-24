//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-test-and-then');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});

ruleTester.run('no-test-and-then', rule, {
  valid: [
    {
      code: "run(() => { console.log('Hello World.'); });"
    },
    {
      code: 'myCustomClass.andThen(myFunction);'
    }
  ],
  invalid: [
    {
      code: 'andThen(() => { assert.ok(myBool); });',
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    }
  ]
});
