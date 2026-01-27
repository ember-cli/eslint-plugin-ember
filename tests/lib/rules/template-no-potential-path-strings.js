const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template-no-potential-path-strings');

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-potential-path-strings', rule, {
  valid: [
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{this.propertyName}}</div>
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
            <div>Hello world</div>
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
            <div>this.propertyName</div>
          </template>
        }
      `,
      output: null,
      errors: [
        {
          messageId: 'noPotentialPathStrings',
        },
      ],
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>foo.bar</div>
          </template>
        }
      `,
      output: null,
      errors: [
        {
          messageId: 'noPotentialPathStrings',
        },
      ],
    },
  ],
});
