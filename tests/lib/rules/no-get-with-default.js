const rule = require('../../../lib/rules/no-get-with-default');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;
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
    // this.getWithDefault
    {
      code: "const test = this.getWithDefault('key', []);", // With a string property.
      output: "const test = (this.get('key') === undefined ? [] : this.get('key'));",
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 'const test = this.getWithDefault(SOME_VARIABLE, []);', // With a variable property.
      output:
        'const test = (this.get(SOME_VARIABLE) === undefined ? [] : this.get(SOME_VARIABLE));',
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "this.getWithDefault('name', '').trim()",
      output: "(this.get('name') === undefined ? '' : this.get('name')).trim()", // Parenthesis matter here.
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },

    // getWithDefault (imported)
    {
      code: "const test = getWithDefault(this, 'key', []);", // With a string property.
      output: "const test = (get(this, 'key') === undefined ? [] : get(this, 'key'));",
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 'const test = getWithDefault(this, SOME_VARIABLE, []);', // With a variable property.
      output:
        'const test = (get(this, SOME_VARIABLE) === undefined ? [] : get(this, SOME_VARIABLE));',
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "getWithDefault(this, 'name', '').trim()",
      output: "(get(this, 'name') === undefined ? '' : get(this, 'name')).trim()", // Parenthesis matter here.
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
  ],
});
