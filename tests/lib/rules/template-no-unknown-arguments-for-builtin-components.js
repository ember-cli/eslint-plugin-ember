const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template-no-unknown-arguments-for-builtin-components');

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unknown-arguments-for-builtin-components', rule, {
  valid: [
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Input @type="text" @value={{this.value}} />
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
            <Textarea @value={{this.text}} />
          </template>
        }
      `,
    },
  ],

  invalid: [
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Input @unknownArg="value" />
          </template>
        }
      `,
      output: null,
      errors: [
        {
          messageId: 'unknownArgument',
        },
      ],
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Textarea @invalidProp={{this.value}} />
          </template>
        }
      `,
      output: null,
      errors: [
        {
          messageId: 'unknownArgument',
        },
      ],
    },
  ],
});
