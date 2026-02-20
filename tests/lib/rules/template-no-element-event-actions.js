const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template-no-element-event-actions');

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-element-event-actions', rule, {
  valid: [
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <button {{on "click" this.handleClick}}>Click</button>
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
            <div>No events</div>
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
            <button onclick={{this.handleClick}}>Click</button>
          </template>
        }
      `,
      output: null,
      errors: [
        {
          messageId: 'noElementEventActions',
        },
      ],
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <div onmouseenter={{this.handleHover}}>Hover</div>
          </template>
        }
      `,
      output: null,
      errors: [
        {
          messageId: 'noElementEventActions',
        },
      ],
    },
  ],
});
