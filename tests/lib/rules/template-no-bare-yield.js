//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-bare-yield');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-bare-yield', rule, {
  valid: [
    // yield with params is fine
    '<template>{{yield this}}</template>',
    '<template>{{yield @model}}</template>',
    '<template>{{yield (hash someProp=someValue)}}</template>',
    // yield is not the only content
    '<template>{{yield}}<div>Content</div></template>',
    '<template><div>Content</div>{{yield}}</template>',
    // no yield at all
    '<template><div>Content</div></template>',
  ],
  invalid: [
    {
      code: '<template>{{yield}}</template>',
      output: null,
      errors: [{ messageId: 'noBareYield' }],
    },
    {
      // whitespace around yield doesn't count as other content
      code: '<template>  {{yield}}  </template>',
      output: null,
      errors: [{ messageId: 'noBareYield' }],
    },
    {
      // comments don't count as other content
      code: '<template>{{! a comment }}{{yield}}</template>',
      output: null,
      errors: [{ messageId: 'noBareYield' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-bare-yield', rule, {
  valid: [
    '{{yield (hash someProp=someValue)}}',
    '{{yield this}}',
    // yield with other content
    '{{yield}}<div>Content</div>',
  ],
  invalid: [
    {
      code: '{{yield}}',
      output: null,
      errors: [{ messageId: 'noBareYield' }],
    },
    {
      // whitespace around yield doesn't count as other content
      code: '     {{yield}}',
      output: null,
      errors: [{ messageId: 'noBareYield' }],
    },
    {
      code: '\n  {{yield}}\n     ',
      output: null,
      errors: [{ messageId: 'noBareYield' }],
    },
    {
      // comments don't count as other content
      code: '\n{{! some comment }}  {{yield}}\n     ',
      output: null,
      errors: [{ messageId: 'noBareYield' }],
    },
  ],
});
