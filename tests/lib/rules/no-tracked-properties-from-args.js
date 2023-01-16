//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-tracked-properties-from-args');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-tracked-properties-from-args', rule, {
  valid: [
    `
      import { tracked } from '@glimmer/tracking'

      class Test {
        @someDecorator test = this.args.test
      }`,
    `
      import { tracked } from '@glimmer/tracking'

      class Test {
        @tracked test = this.someValue
      }`,
    `
      import { tracked } from '@glimmer/tracking'

      class Test {
        @tracked test = 7
      }`,
    `
      import { tracked } from '@glimmer/tracking'
      
      class Test {
        test = 7
      }`,
    `
      import { tracked } from '@glimmer/tracking'

      class Test {
        test = "test"
      }`,
    `
      import { tracked } from '@glimmer/tracking'

      class Test {
        @tracked test = this.notArgs.args.test
      }`,
    `
      import { tracked as fooTracked } from '@glimmer/tracking';

      class Test {
        @fooTracked test = this.notArgs.args.test
      }
    `,
    `
      import { tracked } from '@glimmer/tracking';

      class Test {
        @tracked test = this.args2.test
      }
    `,
    `
      class Test{
        notInitializedProperty;
      }
    `,
    `
      import { tracked as fooTracked } from '@glimmer/tracking';

      class Test {
        someProperty = this.someMethod();
      }
    `,
  ],
  invalid: [
    {
      code: `
      import { tracked } from '@glimmer/tracking'

      class Test {
        @tracked test = this.args;
      }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          // type could be ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8)
        },
      ],
    },
    {
      code: `
      import { tracked } from '@glimmer/tracking'

      class Test {
        @tracked test = this.args.test;
      }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          // type could be ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8)
        },
      ],
    },
    {
      code: `
      import { tracked as fooTracked } from '@glimmer/tracking';
      
      class Test {
        @fooTracked test = this.args.test
      }
    `,
      output: null,
      errors: [
        {
          messageId: 'main',
          // type could be ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8)
        },
      ],
    },
  ],
});
