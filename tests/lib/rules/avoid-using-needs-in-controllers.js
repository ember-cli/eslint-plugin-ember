// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/avoid-using-needs-in-controllers');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});
eslintTester.run('avoid-using-needs-in-controllers', rule, {
  valid: [
    {
      code: 'export default Controller.extend();',
    },
    {
      code: 'export default FooController.extend();',
    },
    {
      code: 'Controller.reopen();',
    },
    {
      code: 'FooController.reopen();',
    },
    {
      code: 'Controller.reopenClass();',
    },
    {
      code: 'FooController.reopenClass();',
    }
  ],
  invalid: [
    {
      code: 'export default Controller.extend({ needs: [] });',
      errors: [{
        message: '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
      }],
    },
    {
      code: 'Controller.reopenClass({ needs: [] });',
      errors: [{
        message: '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
      }],
    },
    {
      code: 'Controller.reopen({ needs: [] });',
      errors: [{
        message: '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
      }],
    },
    {
      code: "export default Controller['extend']({ needs: [] });",
      errors: [{
        message: '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
      }],
    },
    {
      filename: 'example-app/controllers/some-controller.js',
      code: 'export default FooController.extend({ needs: [] });',
      errors: [{
        message: '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
      }],
    },
    {
      filename: 'example-app/controllers/some-controller.js',
      code: 'FooController.reopenClass({ needs: [] });',
      errors: [{
        message: '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
      }],
    },
    {
      filename: 'example-app/controllers/some-controller.js',
      code: 'FooController.reopen({ needs: [] });',
      errors: [{
        message: '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
      }],
    },
    {
      filename: 'example-app/controllers/some-controller.js',
      code: "export default FooController['extend']({ needs: [] });",
      errors: [{
        message: '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
      }],
    },
  ]
});
