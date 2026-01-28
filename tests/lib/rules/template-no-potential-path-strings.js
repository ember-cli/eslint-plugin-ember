const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template-no-potential-path-strings');

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-potential-path-strings', rule, {
  valid: [
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>{{this.propertyName}}</div>
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
            <div>Hello world</div>
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
            <div>this.propertyName</div>
          </template>
        }
      `,
      filename: 'my-component.gjs',
      output: null,
      errors: [
        {
          messageId: 'noPotentialPathStrings',
        },
      ],
    },
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div>foo.bar</div>
          </template>
        }
      `,
      filename: 'my-component.gjs',
      output: null,
      errors: [
        {
          messageId: 'noPotentialPathStrings',
        },
      ],
    },
  ],
});
