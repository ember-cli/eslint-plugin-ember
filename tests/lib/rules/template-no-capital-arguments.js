const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template-no-capital-arguments');

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-capital-arguments', rule, {
  valid: [
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@arg}}</div>
          </template>
        }
      `,
      filename: 'my-component.gjs',
      output: null,
    },
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@myArgument}}</div>
          </template>
        }
      `,
      filename: 'my-component.gjs',
      output: null,
    },
  ],

  invalid: [
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@Arg}}</div>
          </template>
        }
      `,
      filename: 'my-component.gjs',
      output: null,
      errors: [
        {
          messageId: 'noCapitalArguments',
        },
      ],
    },
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{@MyArgument}}</div>
          </template>
        }
      `,
      filename: 'my-component.gjs',
      output: null,
      errors: [
        {
          messageId: 'noCapitalArguments',
        },
      ],
    },
  ],
});
