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
    // Bare-string-literal mustache on rel: renders the literal string per
    // doc row i2 analog. Was previously a false-positive (rule treated all
    // non-GlimmerTextNode rel values as empty); now correctly recognized.
    '<template><a href="/" target="_blank" rel={{"noopener noreferrer"}}>Link</a></template>',
    // Bare-string-literal mustache on target — i2 analog renders target="_blank".
    '<template><a href="/" target={{"_blank"}} rel="noopener noreferrer">Link</a></template>',
    // Dynamic rel — runtime value isn't statically known; conservative skip
    // (no flag). Glimmer's "concat is never falsy" guarantees the attribute
    // is rendered; the rule simply can't verify the tokens at lint time.
    '<template><a href="/" target="_blank" rel={{this.relValue}}>Link</a></template>',
    '<template><a href="/" target="_blank" rel="noopener {{this.extra}}">Link</a></template>',
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
  ],
});
