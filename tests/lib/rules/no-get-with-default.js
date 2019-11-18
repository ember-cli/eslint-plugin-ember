const rule = require('../../../lib/rules/no-get-with-default');
const RuleTester = require('eslint').RuleTester;

const EXPECTED_ERROR_MESSAGE =
  'Use object-method syntax or `get` with `||` instead of `getWithDefault` for property `key`';
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-get-with-default', rule, {
  valid: [
    "const test = this.get('key') || [];",
    "const test = get(this, 'target') || [];",
    "testClass.getWithDefault('key', [])",
    "getWithDefault.testMethod(testClass, 'key', [])",
  ],
  invalid: [
    {
      code: "const test = this.getWithDefault('key', []);",
      errors: [
        {
          message: EXPECTED_ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "const test = getWithDefault(this, 'key', []);",
      errors: [
        {
          message: EXPECTED_ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
  ],
});
