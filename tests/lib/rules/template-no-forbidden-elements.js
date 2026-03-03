const rule = require('../../../lib/rules/template-no-forbidden-elements');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-forbidden-elements', rule, {
  valid: [
    { code: '<template><div></div></template>', options: [['script']] },
    '<template><header></header></template>',
    '<template><footer></footer></template>',
    '<template><p></p></template>',
    '<template><head><meta charset="utf-8"></head></template>',
  ],
  invalid: [
    {
      code: '<template><script></script></template>',
      output: null,
      options: [['script']],
      errors: [{ messageId: 'forbidden' }],
    },

    {
      code: '<template><html></html></template>',
      output: null,
      errors: [{ messageId: 'forbidden' }],
    },
    {
      code: '<template><style></style></template>',
      output: null,
      errors: [{ messageId: 'forbidden' }],
    },
    {
      code: '<template><meta charset="utf-8"></template>',
      output: null,
      errors: [{ messageId: 'forbidden' }],
    },
    {
      code: '<template><head><html></html></head></template>',
      output: null,
      errors: [{ messageId: 'forbidden' }],
    },
    {
      code: '<template><Foo /></template>',
      output: null,
      options: [['Foo']],
      errors: [{ messageId: 'forbidden' }],
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

hbsRuleTester.run('template-no-forbidden-elements', rule, {
  valid: [
    '<header></header>',
    '<div></div>',
    '<footer></footer>',
    '<p></p>',
    '<head><meta charset="utf-8"></head>',
  ],
  invalid: [
    {
      code: '<html></html>',
      output: null,
      errors: [{ message: 'Use of forbidden element <html>' }],
    },
    {
      code: '<style></style>',
      output: null,
      errors: [{ message: 'Use of forbidden element <style>' }],
    },
    {
      code: '<meta charset="utf-8">',
      output: null,
      errors: [{ message: 'Use of forbidden element <meta>' }],
    },
    {
      code: '<head><html></html></head>',
      output: null,
      errors: [{ message: 'Use of forbidden element <html>' }],
    },
  ],
});
