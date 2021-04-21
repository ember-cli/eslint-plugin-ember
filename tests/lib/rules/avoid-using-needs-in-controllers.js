// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/avoid-using-needs-in-controllers');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});
eslintTester.run('avoid-using-needs-in-controllers', rule, {
  valid: [
    'export default Controller.extend();',
    'export default Controller.extend({ ...foo });',
    'export default Controller.extend({ random: [] });',
    'export default FooController.extend();',
    'Controller.reopen();',
    'FooController.reopen();',
    'Controller.reopenClass();',
    'FooController.reopenClass();',
  ],
  invalid: [
    {
      code: 'export default Controller.extend({ needs: [] });',
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
    {
      // With object variable.
      code: 'const body = { needs: [] }; export default Controller.extend(body);',
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
    {
      code: 'Controller.reopenClass({ needs: [] });',
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
    {
      code: 'Controller.reopen({ needs: [] });',
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
    {
      code: "export default Controller['extend']({ needs: [] });",
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
    {
      filename: 'example-app/controllers/some-controller.js',
      code: 'export default FooController.extend({ needs: [] });',
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
    {
      filename: 'example-app/controllers/some-controller.js',
      code: 'FooController.reopenClass({ needs: [] });',
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
    {
      filename: 'example-app/controllers/some-controller.js',
      code: 'FooController.reopen({ needs: [] });',
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
    {
      filename: 'example-app/controllers/some-controller.js',
      code: "export default FooController['extend']({ needs: [] });",
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
  ],
});
