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
    // requireActionHelper: true — non-action mustache is not flagged
    {
      filename: 'my-component.gjs',
      code: '<template><button type="button" onclick={{this.myAction}}></button></template>',
      output: null,
      options: [{ requireActionHelper: true }],
    },
    // requireActionHelper: false — string event handler is not flagged
    {
      filename: 'my-component.gjs',
      code: '<template><button type="button" onclick="myFunction()"></button></template>',
      output: null,
      options: [{ requireActionHelper: false }],
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
    // requireActionHelper: false — any mustache on event attribute is flagged
    {
      filename: 'my-component.gjs',
      code: '<template><button type="button" onclick={{this.myAction}}></button></template>',
      output: null,
      options: [{ requireActionHelper: false }],
      errors: [{ messageId: 'noElementEventActions' }],
    },
    // requireActionHelper: true — only {{action ...}} mustaches are flagged
    {
      filename: 'my-component.gjs',
      code: '<template><button onclick={{action "myAction"}}></button></template>',
      output: null,
      options: [{ requireActionHelper: true }],
      errors: [{ messageId: 'noElementEventActions' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-element-event-actions (hbs)', rule, {
  valid: [
    '<button></button>',
    '<button type="button" onclick="myFunction()"></button>',
    '<button type="button" {{on "click" this.handleClick}}></button>',
    {
      code: '<button type="button" onclick={{this.myAction}}></button>',
      options: [{ requireActionHelper: true }],
    },
    {
      code: '<button type="button" onclick="myFunction()"></button>',
      options: [{ requireActionHelper: false }],
    },
  ],
  invalid: [
    {
      code: '<button onclick={{action "myAction"}}></button>',
      output: null,
      errors: [{ messageId: 'noElementEventActions' }],
    },
    {
      code: '<button type="button" onclick={{this.myAction}}></button>',
      output: null,
      errors: [{ messageId: 'noElementEventActions' }],
    },
    {
      code: '<button type="button" onclick={{this.myAction}}></button>',
      output: null,
      options: [{ requireActionHelper: false }],
      errors: [{ messageId: 'noElementEventActions' }],
    },
    {
      code: '<button onclick={{action "myAction"}}></button>',
      output: null,
      options: [{ requireActionHelper: true }],
      errors: [{ messageId: 'noElementEventActions' }],
    },
  ],
});
