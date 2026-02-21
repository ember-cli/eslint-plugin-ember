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
  
    // Test cases ported from ember-template-lint
    '<template><img src="foo.png"></template>',
    '<template><img src={{picture}}></template>',
    '<template><img src={{this.picture}}></template>',
    '<template><img src={{@img}}></template>',
    '<template><SomeComponent @foo={{@bar}} /></template>',
    '<template><Ui::Demo @title="@my-org/my-package" /></template>',
    '<template><Ui::Demo @title="@my-org\\my-package" /></template>',
    '<template><Ui::Demo @title="@my-org|my-package" /></template>',
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
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><img src="this.picture"></template>',
      output: null,
      errors: [{ messageId: 'noPotentialPathStrings' }],
    },
    {
      code: '<template><img src=this.picture></template>',
      output: null,
      errors: [{ messageId: 'noPotentialPathStrings' }],
    },
    {
      code: '<template><img src="@img"></template>',
      output: null,
      errors: [{ messageId: 'noPotentialPathStrings' }],
    },
    {
      code: '<template><img src=@img></template>',
      output: null,
      errors: [{ messageId: 'noPotentialPathStrings' }],
    },
    {
      code: '<template><SomeComponent @foo=@bar /></template>',
      output: null,
      errors: [{ messageId: 'noPotentialPathStrings' }],
    },
    {
      code: '<template><SomeComponent @foo=this.bar /></template>',
      output: null,
      errors: [{ messageId: 'noPotentialPathStrings' }],
    },
  ],
});
