const rule = require('../../../lib/rules/template-no-abstract-roles');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-abstract-roles', rule, {
  valid: [
    '<template><div role="button"></div></template>',
    '<template><div></div></template>',
    '<template><img alt="" role="none" src="zoey.jpg"></template>',
    '<template><img alt="" role="presentation" src="zoey.jpg"></template>',
  ],
  invalid: [
    {
      code: '<template><div role="command"></div></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><div role="widget"></div></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },

    {
      code: '<template><img role="command"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="composite"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><input role="input"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="landmark"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><input role="range"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="roletype"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="section"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="sectionhead"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><select role="select"></select></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><div role="structure"></div></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="widget"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><img role="window"></template>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-abstract-roles (hbs)', rule, {
  valid: [
    '<img alt="" role="none" src="zoey.jpg">',
    '<img alt="" role="presentation" src="zoey.jpg">',
  ],
  invalid: [
    {
      code: '<img role="command">',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<img role="composite">',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<input role="input">',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<img role="landmark">',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<input role="range">',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<img role="roletype">',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<img role="section">',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<img role="sectionhead">',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<select role="select"></select>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<div role="structure"></div>',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<img role="widget">',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<img role="window">',
      output: null,
      errors: [{ messageId: 'abstractRole' }],
    },
  ],
});
