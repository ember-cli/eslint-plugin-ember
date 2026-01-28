const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template-no-element-event-actions');

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-element-event-actions', rule, {
  valid: [
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <button {{on "click" this.handleClick}}>Click</button>
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
            <div>No events</div>
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
            <button onclick={{this.handleClick}}>Click</button>
          </template>
        }
      `,
      filename: 'my-component.gjs',
      output: null,
      errors: [
        {
          messageId: 'noElementEventActions',
        },
      ],
    },
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div onmouseenter={{this.handleHover}}>Hover</div>
          </template>
        }
      `,
      filename: 'my-component.gjs',
      output: null,
      errors: [
        {
          messageId: 'noElementEventActions',
        },
      ],
    },
  ],
});
