'use strict';

const rule = require('../../../lib/rules/classic-decorator-no-classic-methods');
const RuleTester = require('eslint').RuleTester;

const { disallowedMethodErrorMessage } = rule;

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('classic-decorator-no-classic-methods', rule, {
  valid: [
    `
      const Foo = EmberObject.extend({
        foo() {
          this.get('bar');
        }
      })
    `,
    `
      class Foo extends Bar {
        foo() {
          get(this, 'bar');
          this.baz();
        }
      }
    `,
    `
      @classic
      class Foo extends Bar {
        foo() {
          this.get('bar');
        }
      }
    `,
    `
      class Foo {
        foo() {
          this.get('bar');
        }
      }
    `,
    `
      class Foo extends Bar {
        foo = otherClass.get('bar');
      }
    `,
  ],

  invalid: [
    {
      code: `
        class Foo extends Bar {
          foo() {
            this.get('bar');
          }
        }
      `,
      output: null,
      errors: [
        {
          message: disallowedMethodErrorMessage('get'),
          type: 'MemberExpression',
        },
      ],
    },
    {
      code: `
        class Foo extends Bar {
          foo = this.get('bar');
        }
      `,
      output: null,
      errors: [
        {
          message: disallowedMethodErrorMessage('get'),
          type: 'MemberExpression',
        },
      ],
    },
  ],
});
