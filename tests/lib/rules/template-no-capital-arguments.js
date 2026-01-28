const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template-no-capital-arguments');

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-capital-arguments', rule, {
  valid: [
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@arg}}</div>
          </template>
        }
      `,
      output: null,
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@myArgument}}</div>
          </template>
        }
      `,
      output: null,
    },
  ],

  invalid: [
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@Arg}}</div>
          </template>
        }
      `,
      output: null,
      errors: [
        {
          messageId: 'noCapitalArguments',
        },
      ],
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@MyArgument}}</div>
          </template>
        }
      `,
      output: null,
      errors: [
        {
          messageId: 'noCapitalArguments',
        },
      ],
    },
  ],
});
