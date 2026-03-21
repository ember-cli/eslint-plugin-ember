const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template-no-potential-path-strings');

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-potential-path-strings', rule, {
  valid: [
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
      code: '<template><img src="this.picture"></template>',
      output: null,
      errors: [
        {
          message: 'Potential path in attribute string detected. Did you mean {{this.picture}}?',
        },
      ],
    },
    {
      code: '<template><img src=this.picture></template>',
      output: null,
      errors: [
        {
          message: 'Potential path in attribute string detected. Did you mean {{this.picture}}?',
        },
      ],
    },
    {
      code: '<template><img src="@img"></template>',
      output: null,
      errors: [
        {
          message: 'Potential path in attribute string detected. Did you mean {{@img}}?',
        },
      ],
    },
    {
      code: '<template><img src=@img></template>',
      output: null,
      errors: [
        {
          message: 'Potential path in attribute string detected. Did you mean {{@img}}?',
        },
      ],
    },
    {
      code: '<template><SomeComponent @foo=@bar /></template>',
      output: null,
      errors: [
        {
          message: 'Potential path in attribute string detected. Did you mean {{@bar}}?',
        },
      ],
    },
    {
      code: '<template><SomeComponent @foo=this.bar /></template>',
      output: null,
      errors: [
        {
          message: 'Potential path in attribute string detected. Did you mean {{this.bar}}?',
        },
      ],
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
        {
          message: 'Potential path in attribute string detected. Did you mean {{this.picture}}?',
        },
      ],
    },
    {
      code: '<img src=this.picture>',
      output: null,
      errors: [
        {
          message: 'Potential path in attribute string detected. Did you mean {{this.picture}}?',
        },
      ],
    },
    {
      code: '<img src="@img">',
      output: null,
      errors: [
        {
          message: 'Potential path in attribute string detected. Did you mean {{@img}}?',
        },
      ],
    },
    {
      code: '<img src=@img>',
      output: null,
      errors: [
        {
          message: 'Potential path in attribute string detected. Did you mean {{@img}}?',
        },
      ],
    },
    {
      code: '<SomeComponent @foo=@bar />',
      output: null,
      errors: [
        {
          message: 'Potential path in attribute string detected. Did you mean {{@bar}}?',
        },
      ],
    },
    {
      code: '<SomeComponent @foo=this.bar />',
      output: null,
      errors: [
        {
          message: 'Potential path in attribute string detected. Did you mean {{this.bar}}?',
        },
      ],
    },
  ],
});
