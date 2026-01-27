const rule = require('../../../lib/rules/template-require-iframe-title');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-iframe-title', rule, {
  valid: [
    '<template><iframe title="Video"></iframe></template>',
    '<template><iframe title="Map" src="/map"></iframe></template>',
    '<template><iframe aria-hidden="true"></iframe></template>',
    '<template><iframe hidden></iframe></template>',
  ],
  invalid: [
    {
      code: '<template><iframe src="/content"></iframe></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe title=""></iframe></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
  ],
});
