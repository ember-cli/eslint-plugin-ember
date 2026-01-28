const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template-no-unknown-arguments-for-builtin-components');

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unknown-arguments-for-builtin-components', rule, {
  valid: [
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Input @type="text" @value={{this.value}} />
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
            <Textarea @value={{this.text}} @rows="10" />
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
            <Input @unknownArg="value" />
          </template>
        }
      `,
      filename: 'my-component.gjs',
      output: null,
      errors: [
        {
          messageId: 'unknownArgument',
        },
      ],
    },
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Textarea @invalidProp={{this.value}} />
          </template>
        }
      `,
      filename: 'my-component.gjs',
      output: null,
      errors: [
        {
          messageId: 'unknownArgument',
        },
      ],
    },
  ],
});
