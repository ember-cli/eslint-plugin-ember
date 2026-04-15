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
    // Rule is HBS-only: `render` in GJS/GTS is a JS binding, not the classic helper
    {
      filename: 'test.gjs',
      code: '<template>{{render "user"}}</template>',
    },
    {
      filename: 'test.gts',
      code: '<template>{{render "user"}}</template>',
    },
  ],
  invalid: [
    {
      code: '<template>{{render "user"}}</template>',
      output: '<template>{{user}}</template>',
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: "<template>{{render 'ken-griffey'}}</template>",
      output: '<template>{{ken-griffey}}</template>',
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: "<template>{{render 'baseball-player' pitcher}}</template>",
      output: '<template>{{baseball-player model=pitcher}}</template>',
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
      code: "{{render 'ken-griffey'}}",
      output: '{{ken-griffey}}',
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: "{{render 'baseball-player' pitcher}}",
      output: '{{baseball-player model=pitcher}}',
      errors: [{ messageId: 'deprecated' }],
    },
  ],
});
