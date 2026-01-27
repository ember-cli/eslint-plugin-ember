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
    '<template><button></button></template>',
    '<template><button type="button" on={{action "myAction"}}></button></template>',
    '<template><button type="button" onclick="myFunction()"></button></template>',
    '<template><button type="button" {{action "myAction"}}></button></template>',
    '<template><button type="button" value={{value}}></button></template>',
    '<template>{{my-component onclick=(action "myAction") someProperty=true}}</template>',
    '<template><SiteHeader @someFunction={{action "myAction"}} @user={{this.user}} /></template>',
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
    {
      code: '<template><button onclick={{action "myAction"}} ONFOCUS={{action "myAction"}} otherProperty=true></button></template>',
      output: null,
      errors: [{ messageId: 'noElementEventActions' }, { messageId: 'noElementEventActions' }],
    },
    {
      code: '<template><SiteHeader onclick={{action "myAction"}} @user={{this.user}} /></template>',
      output: null,
      errors: [{ messageId: 'noElementEventActions' }],
    },
    {
      code: '<template><button type="button" onclick={{this.myAction}}></button></template>',
      output: null,
      errors: [{ messageId: 'noElementEventActions' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-element-event-actions (hbs)', rule, {
  valid: [
    '<button></button>',
    '<button type="button" on={{action "myAction"}}></button>',
    '<button type="button" onclick="myFunction()"></button>',
    '<button type="button" {{action "myAction"}}></button>',
    '<button type="button" value={{value}}></button>',
    '{{my-component onclick=(action "myAction") someProperty=true}}',
    '<SiteHeader @someFunction={{action "myAction"}} @user={{this.user}} />',
    // requireActionHelper: true — only flags {{action ...}}, so plain {{this.myAction}} is valid
    {
      code: '<button type="button" onclick={{this.myAction}}></button>',
      options: [{ requireActionHelper: true }],
    },
    // requireActionHelper: false — plain string onclick is always valid
    {
      code: '<button type="button" onclick="myFunction()"></button>',
      options: [{ requireActionHelper: false }],
    },
  ],
  invalid: [
    {
      code: '<button onclick={{action "myAction"}} ONFOCUS={{action "myAction"}} otherProperty=true></button>',
      output: null,
      errors: [{ messageId: 'noElementEventActions' }, { messageId: 'noElementEventActions' }],
    },
    {
      code: '<SiteHeader onclick={{action "myAction"}} @user={{this.user}} />',
      output: null,
      errors: [{ messageId: 'noElementEventActions' }],
    },
    {
      code: '<button type="button" onclick={{this.myAction}}></button>',
      output: null,
      errors: [{ messageId: 'noElementEventActions' }],
    },
    // requireActionHelper: false — {{this.myAction}} on event attr is still invalid
    {
      code: '<button type="button" onclick={{this.myAction}}></button>',
      output: null,
      options: [{ requireActionHelper: false }],
      errors: [{ messageId: 'noElementEventActions' }],
    },
  ],
});
