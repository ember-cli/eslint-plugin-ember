const rule = require('../../../lib/rules/template-no-class-bindings');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-class-bindings', rule, {
  valid: [
    '<template><SomeThing /></template>',
    '<template>{{lol-wat}}</template>',
    '<template>{{true}}</template>',
    '<template>{{"hehe"}}</template>',
    '<template><div class="foo"></div></template>',
  ],
  invalid: [
    {
      code: '<template>{{some-thing classBinding="lol:wat"}}</template>',
      output: null,
      errors: [
        {
          messageId: 'noClassBindings',
          data: { name: 'classBinding' },
        },
      ],
    },
    {
      code: '<template><SomeThing @classBinding="lol:wat" /></template>',
      output: null,
      errors: [
        {
          messageId: 'noClassBindings',
          data: { name: '@classBinding' },
        },
      ],
    },
    {
      code: '<template>{{some-thing classNameBindings="lol:foo:bar"}}</template>',
      output: null,
      errors: [
        {
          messageId: 'noClassBindings',
          data: { name: 'classNameBindings' },
        },
      ],
    },
    {
      code: '<template><SomeThing @classNameBindings="lol:foo:bar" /></template>',
      output: null,
      errors: [
        {
          messageId: 'noClassBindings',
          data: { name: '@classNameBindings' },
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

hbsRuleTester.run('template-no-class-bindings', rule, {
  valid: ['<SomeThing />', '{{lol-wat}}', '{{true}}', '{{"hehe"}}'],
  invalid: [
    {
      code: '{{some-thing classBinding="lol:wat"}}',
      output: null,
      errors: [
        {
          message:
            'Passing the `classBinding` property as an argument within templates is not allowed.',
        },
      ],
    },
    {
      code: '<SomeThing @classBinding="lol:wat" />',
      output: null,
      errors: [
        {
          message:
            'Passing the `@classBinding` property as an argument within templates is not allowed.',
        },
      ],
    },
    {
      code: '{{some-thing classNameBindings="lol:foo:bar"}}',
      output: null,
      errors: [
        {
          message:
            'Passing the `classNameBindings` property as an argument within templates is not allowed.',
        },
      ],
    },
    {
      code: '<SomeThing @classNameBindings="lol:foo:bar" />',
      output: null,
      errors: [
        {
          message:
            'Passing the `@classNameBindings` property as an argument within templates is not allowed.',
        },
      ],
    },
  ],
});
