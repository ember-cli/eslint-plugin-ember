const rule = require('../../../lib/rules/template-link-rel-noopener');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-link-rel-noopener', rule, {
  valid: [
    '<template><a href="/" target="_blank" rel="noopener noreferrer">Link</a></template>',
    '<template><a href="/some/where"></a></template>',
    '<template><a href="/some/where" target="_self"></a></template>',
    '<template><a href="/some/where" target="_blank" rel="noopener noreferrer"></a></template>',
    '<template><a href="/some/where" target="_blank" rel="noreferrer noopener"></a></template>',
    '<template><a href="/some/where" target="_blank" rel="nofollow noreferrer noopener"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="nofollow noopener noreferrer"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noopener nofollow noreferrer"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer nofollow"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="nofollow noreferrer noopener"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noreferrer nofollow noopener"></a></template>',
    '<template><a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener nofollow"></a></template>',
  ],
  invalid: [
    {
      code: '<template><a href="/" target="_blank">Link</a></template>',
      output: '<template><a href="/" target="_blank" rel="noopener noreferrer">Link</a></template>',
      errors: [{ messageId: 'missingRel' }],
    },

    {
      code: '<template><a href="/some/where" target="_blank"></a></template>',
      output:
        '<template><a href="/some/where" target="_blank" rel="noopener noreferrer"></a></template>',
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<template><a href="/some/where" target="_blank" rel="nofollow"></a></template>',
      output:
        '<template><a href="/some/where" target="_blank" rel="nofollow noopener noreferrer"></a></template>',
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<template><a href="/some/where" target="_blank" rel="noopener"></a></template>',
      output:
        '<template><a href="/some/where" target="_blank" rel="noopener noreferrer"></a></template>',
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<template><a href="/some/where" target="_blank" rel="noreferrer"></a></template>',
      output:
        '<template><a href="/some/where" target="_blank" rel="noopener noreferrer"></a></template>',
      errors: [{ messageId: 'missingRel' }],
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

hbsRuleTester.run('template-link-rel-noopener', rule, {
  valid: [
    '<a href="/some/where"></a>',
    '<a href="/some/where" target="_self"></a>',
    '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',
    '<a href="/some/where" target="_blank" rel="noreferrer noopener"></a>',
    '<a href="/some/where" target="_blank" rel="nofollow noreferrer noopener"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="nofollow noopener noreferrer"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noopener nofollow noreferrer"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noopener noreferrer nofollow"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="nofollow noreferrer noopener"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noreferrer nofollow noopener"></a>',
    '<a href="/some/where/ingrid" target="_blank" rel="noreferrer noopener nofollow"></a>',
  ],
  invalid: [
    {
      code: '<a href="/some/where" target="_blank"></a>',
      output: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',
      errors: [{ message: 'links with target="_blank" must have rel="noopener noreferrer"' }],
    },
    {
      code: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
      output: '<a href="/some/where" target="_blank" rel="nofollow noopener noreferrer"></a>',
      errors: [{ message: 'links with target="_blank" must have rel="noopener noreferrer"' }],
    },
    {
      code: '<a href="/some/where" target="_blank" rel="noopener"></a>',
      output: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',
      errors: [{ message: 'links with target="_blank" must have rel="noopener noreferrer"' }],
    },
    {
      code: '<a href="/some/where" target="_blank" rel="noreferrer"></a>',
      output: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',
      errors: [{ message: 'links with target="_blank" must have rel="noopener noreferrer"' }],
    },
  ],
});
