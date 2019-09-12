const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-translation-key-interpolation');

const { ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-translation-key-interpolation', rule, {
  valid: [
    // With valid string:
    "intl.t('some.key');",
    "this.intl.t('some.key');",
    "this.get('intl').t('some.key');",

    // With valid variable usage:
    'intl.t(SOME_VARIABLE);',
    'this.intl.t(SOME_VARIABLE);',
    "this.get('intl').t(SOME_VARIABLE);",

    // With valid function call:
    'intl.t(constructKey());',
    'this.intl.t(constructKey());',
    "this.get('intl').t(constructKey());",

    // Not the right function:
    'otherClass.t(`key.${variable}`);', // eslint-disable-line no-template-curly-in-string
    'intl.otherFunction(`key.${variable}`);', // eslint-disable-line no-template-curly-in-string

    // Not the right function (with `this`):
    'this.otherClass.t(`key.${variable}`);', // eslint-disable-line no-template-curly-in-string
    'this.intl.otherFunction(`key.${variable}`);', // eslint-disable-line no-template-curly-in-string

    // Custom service name:
    {
      code: `this.i18n.t('some.key');`,
      options: [{ serviceName: 'i18n' }],
    },
  ],
  invalid: [
    {
      code: 'intl.t(`key.${variable}`);', // eslint-disable-line no-template-curly-in-string
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      // With variable:
      code: 'intl.t(`key.${variable}`, { someVariable: 123 });', // eslint-disable-line no-template-curly-in-string
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'this.intl.t(`key.${variable}`);', // eslint-disable-line no-template-curly-in-string
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },

    // Custom service name:
    {
      code: 'this.i18n.t(`key.${variable}`);', // eslint-disable-line no-template-curly-in-string
      options: [{ serviceName: 'i18n' }],
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ],
});
