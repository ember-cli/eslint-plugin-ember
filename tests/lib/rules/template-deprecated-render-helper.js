const rule = require('../../../lib/rules/template-deprecated-render-helper');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-deprecated-render-helper', rule, {
  valid: [
    '<template><MyComponent /></template>',
    '<template>{{this.render}}</template>',
    '<template>{{valid-compoennt}}</template>',
    '<template>{{input placeholder=(t "email") value=email}}</template>',
    '<template>{{title "CrossCheck Web" prepent=true separator=" | "}}</template>',
    '<template>{{hockey-player teamName="Boston Bruins"}}</template>',
    '<template>{{false}}</template>',
    '<template>{{"foo"}}</template>',
    '<template>{{42}}</template>',
    '<template>{{null}}</template>',
    '<template>{{undefined}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{render "user"}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },

    {
      code: "<template>{{render 'ken-griffey'}}</template>",
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: "<template>{{render 'baseball-player' pitcher}}</template>",
      output: null,
      errors: [{ messageId: 'deprecated' }],
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

hbsRuleTester.run('template-deprecated-render-helper', rule, {
  valid: [
    '{{valid-compoennt}}',
    '{{input placeholder=(t "email") value=email}}',
    '{{title "CrossCheck Web" prepent=true separator=" | "}}',
    '{{hockey-player teamName="Boston Bruins"}}',
    '{{false}}',
    '{{"foo"}}',
    '{{42}}',
    '{{null}}',
    '{{undefined}}',
  ],
  invalid: [
    {
      code: `{{render 'ken-griffey'}}`,
      output: null,
      errors: [
        { message: 'The render helper is deprecated in favor of using components. See https://emberjs.com/deprecations/v2.x/#toc_code-render-code-helper' },
      ],
    },
    {
      code: `{{render 'baseball-player' pitcher}}`,
      output: null,
      errors: [
        { message: 'The render helper is deprecated in favor of using components. See https://emberjs.com/deprecations/v2.x/#toc_code-render-code-helper' },
      ],
    },
  ],
});
