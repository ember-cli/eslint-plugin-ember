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
  
    // Test cases ported from ember-template-lint
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
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><button onclick={{action "myAction"}} ONFOCUS={{action "myAction"}} otherProperty=true></button></template>',
      output: null,
      errors: [{ messageId: 'noElementEventActions' }],
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
