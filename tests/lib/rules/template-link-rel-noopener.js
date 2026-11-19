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
    // target="_self" does not require rel
    '<template><a href="/some/where" target="_self"></a></template>',
    // self-closing
    '<template><a href="/" target="_blank" rel="noopener noreferrer" /></template>',
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
      output: '<template><a href="/" target="_blank" rel="noopener noreferrer">Link</a></template>',
      errors: [{ messageId: 'missingRel' }],
    },
    // rel="nofollow" — present but wrong values
    {
      code: '<template><a href="/" target="_blank" rel="nofollow">Link</a></template>',
      output:
        '<template><a href="/" target="_blank" rel="nofollow noopener noreferrer">Link</a></template>',
      errors: [{ messageId: 'missingRel' }],
    },
    // self-closing — insert before `/>`, not after `/`
    {
      code: '<template><a href="/" target="_blank" /></template>',
      output: '<template><a href="/" target="_blank" rel="noopener noreferrer" /></template>',
      errors: [{ messageId: 'missingRel' }],
    },
    // dynamic rel — reported, but not autofixed
    {
      code: '<template><a href="/" target="_blank" rel={{this.rel}}>Link</a></template>',
      output: null,
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

hbsRuleTester.run('template-link-rel-noopener (hbs)', rule, {
  valid: [
    '<a href="/some/where"></a>',
    '<a href="/some/where" target="_self"></a>',
    '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',
    '<a href="/some/where" target="_blank" rel="noreferrer noopener"></a>',
    '<a href="/some/where" target="_blank" rel="nofollow noreferrer noopener"></a>',
    '<a href="/some/where" target="_blank" rel="noopener noreferrer" />',
  ],
  invalid: [
    {
      code: '<a href="/some/where" target="_blank"></a>',
      output: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<a href="/some/where" target="_blank" rel="nofollow"></a>',
      output: '<a href="/some/where" target="_blank" rel="nofollow noopener noreferrer"></a>',
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<a href="/some/where" target="_blank" rel="noopener"></a>',
      output: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<a href="/some/where" target="_blank" rel="noreferrer"></a>',
      output: '<a href="/some/where" target="_blank" rel="noopener noreferrer"></a>',
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<a href="/some/where" target="_blank" />',
      output: '<a href="/some/where" target="_blank" rel="noopener noreferrer" />',
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<a href="/some/where" target="_blank"/>',
      output: '<a href="/some/where" target="_blank" rel="noopener noreferrer"/>',
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<a href="/some/where" target="_blank" rel={{this.rel}}></a>',
      output: null,
      errors: [{ messageId: 'missingRel' }],
    },
    {
      code: '<a href="/some/where" target="_blank" rel="nofollow {{this.rel}}"></a>',
      output: null,
      errors: [{ messageId: 'missingRel' }],
    },
  ],
});
