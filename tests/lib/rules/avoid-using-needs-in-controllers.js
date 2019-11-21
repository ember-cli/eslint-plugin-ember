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
    sourceType: 'module',
  },
});
eslintTester.run('avoid-using-needs-in-controllers', rule, {
  valid: [
    `
      import Controller from '@ember/controller';
      export default Controller.extend();
    `,
    `
      import FooController from '@ember/controller';
      export default FooController.extend();
    `,
    `
      import Controller from '@ember/controller';
      Controller.reopen();
    `,
    `
      import FooController from '@ember/controller';
      FooController.reopen();
    `,
    `
      import Controller from '@ember/controller';
      Controller.reopenClass();
    `,
    `
      import FooController from '@ember/controller';
      FooController.reopenClass();
    `,
  ],
  invalid: [
    {
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend({ needs: [] });
      `,
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
    {
      code: `
        import Controller from '@ember/controller';
        Controller.reopenClass({ needs: [] });
      `,
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
    {
      code: `
        import Controller from '@ember/controller';
        Controller.reopen({ needs: [] });
      `,
      output: null,
      errors: [
        {
          message:
            '`needs` API has been deprecated, `Ember.inject.controller` should be used instead',
        },
      ],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default Controller['extend']({ needs: [] });
      `,
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
      code: `
        import FooController from '@ember/controller';
        export default FooController.extend({ needs: [] });
      `,
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
      code: `
        import FooController from '@ember/controller';
        FooController.reopenClass({ needs: [] });
      `,
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
      code: `
        import FooController from '@ember/controller';
        FooController.reopen({ needs: [] });
      `,
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
      code: `
        import FooController from '@ember/controller';
        export default FooController['extend']({ needs: [] });
      `,
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
