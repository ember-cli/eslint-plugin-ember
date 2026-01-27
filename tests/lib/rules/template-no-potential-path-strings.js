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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-potential-path-strings', rule, {
  valid: [
    '<img src="foo.png">',
    '<img src={{picture}}>',
    '<img src={{this.picture}}>',
    '<img src={{@img}}>',
    '<SomeComponent @foo={{@bar}} />',
    '<Ui::Demo @title="@my-org/my-package" />',
    '<Ui::Demo @title="@my-org\\my-package" />',
    '<Ui::Demo @title="@my-org|my-package" />',
  ],
  invalid: [
    {
      code: '<img src="this.picture">',
      output: null,
      errors: [
        { message: 'Potential path string detected. Use dynamic values instead of path strings.' },
      ],
    },
    {
      code: '<img src=this.picture>',
      output: null,
      errors: [
        { message: 'Potential path string detected. Use dynamic values instead of path strings.' },
      ],
    },
    {
      code: '<img src="@img">',
      output: null,
      errors: [
        { message: 'Potential path string detected. Use dynamic values instead of path strings.' },
      ],
    },
    {
      code: '<img src=@img>',
      output: null,
      errors: [
        { message: 'Potential path string detected. Use dynamic values instead of path strings.' },
      ],
    },
    {
      code: '<SomeComponent @foo=@bar />',
      output: null,
      errors: [
        { message: 'Potential path string detected. Use dynamic values instead of path strings.' },
      ],
    },
    {
      code: '<SomeComponent @foo=this.bar />',
      output: null,
      errors: [
        { message: 'Potential path string detected. Use dynamic values instead of path strings.' },
      ],
    },
  ],
});
