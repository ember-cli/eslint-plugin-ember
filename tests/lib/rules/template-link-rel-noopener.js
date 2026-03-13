const rule = require('../../../lib/rules/template-link-rel-noopener');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-link-rel-noopener', rule, {
  valid: [
    '<template><a href="/" target="_blank" rel="noopener noreferrer">Link</a></template>',
    // reversed order
    '<template><a href="/" target="_blank" rel="noreferrer noopener">Link</a></template>',
    // with additional values
    '<template><a href="/" target="_blank" rel="nofollow noreferrer noopener">Link</a></template>',
    // no target="_blank" means no rel required
    '<template><a href="/">Link</a></template>',
  ],
  invalid: [
    // no rel attribute at all
    {
      code: '<template><a href="/" target="_blank">Link</a></template>',
      output: '<template><a href="/" target="_blank" rel="noopener noreferrer">Link</a></template>',
      errors: [{ messageId: 'missingRel' }],
    },
    // rel="noopener" only — missing noreferrer
    {
      code: '<template><a href="/" target="_blank" rel="noopener">Link</a></template>',
      output: '<template><a href="/" target="_blank" rel="noopener noreferrer">Link</a></template>',
      errors: [{ messageId: 'missingRel' }],
    },
    // rel="noreferrer" only — missing noopener
    {
      code: '<template><a href="/" target="_blank" rel="noreferrer">Link</a></template>',
      output: '<template><a href="/" target="_blank" rel="noreferrer noopener">Link</a></template>',
      errors: [{ messageId: 'missingRel' }],
    },
    // rel="nofollow" — present but wrong values
    {
      code: '<template><a href="/" target="_blank" rel="nofollow">Link</a></template>',
      output:
        '<template><a href="/" target="_blank" rel="nofollow noopener noreferrer">Link</a></template>',
      errors: [{ messageId: 'missingRel' }],
    },
  ],
});
