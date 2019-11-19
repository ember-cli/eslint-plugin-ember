const rule = require('../../../lib/rules/no-get-with-default');
const RuleTester = require('eslint').RuleTester;

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
          message:
            'Use `this.property || defaultValue` or the `this.property === undefined ? defaultValue : this.property` instead of `getWithDefault(this.property, defaultValue)`.',
          type: 'CallExpression',
        },
      ],
      output: null,
    },
    {
      code: "const test = getWithDefault(this, 'key', []);",
      errors: [
        {
          message: 'Use `||` or the ternary operator instead of `getWithDefault()`.',
          type: 'CallExpression',
        },
      ],
      output: null,
    },
  ],
});
