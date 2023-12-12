'use strict';

const rule = require('../../../lib/rules/classic-decorator-hooks');
const RuleTester = require('eslint').RuleTester;

const {
  ERROR_MESSAGE_INIT_IN_NON_CLASSIC,
  ERROR_MESSAGE_DESTROY_IN_NON_CLASSIC,
  ERROR_MESSAGE_CONSTRUCTOR_IN_CLASSIC,
} = rule;

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('classic-decorator-hooks', rule, {
  valid: [
    `
      const Foo = EmberObject.extend({
        init() {},
        destroy() {},
        ...foo
      })
    `,
    `
      class Foo extends Bar {
        constructor() {}
        willDestroy() {}
      }
    `,
    `
      @classic
      class Foo extends Bar {
        init() {}
        destroy() {}
      }
    `,
    `
      class Foo {
        init() {}
        destroy() {}
      }
    `,
  ],

  invalid: [
    {
      code: `
        class Foo extends Bar {
          init() {}
        }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_INIT_IN_NON_CLASSIC,
        },
      ],
    },
    {
      code: `
        class Foo extends Bar {
          destroy() {}
        }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_DESTROY_IN_NON_CLASSIC,
        },
      ],
    },
    {
      code: `
        @classic
        class Foo extends Bar {
          constructor() {}
        }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_CONSTRUCTOR_IN_CLASSIC,
        },
      ],
    },
  ],
});
