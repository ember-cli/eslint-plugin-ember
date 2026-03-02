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

    '<template><iframe title="Welcome to the Matrix!" /></template>',
    '<template><iframe title={{someValue}} /></template>',
    '<template><iframe title="" aria-hidden /></template>',
    '<template><iframe title="" hidden /></template>',
    '<template><iframe title="foo" /><iframe title="bar" /></template>',
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

    {
      code: '<template><iframe title="foo" /><iframe title="foo" /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe title="foo" /><iframe title="boo" /><iframe title="foo" /><iframe title="boo" /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }, { messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe src="12" /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe src="12" title={{false}} /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe src="12" title="{{false}}" /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe src="12" title="" /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
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

hbsRuleTester.run('template-require-iframe-title', rule, {
  valid: [
    '<iframe title="Welcome to the Matrix!" />',
    '<iframe title={{someValue}} />',
    '<iframe title="" aria-hidden />',
    '<iframe title="" hidden />',
    '<iframe title="foo" /><iframe title="bar" />',
  ],
  invalid: [
    {
      code: '<iframe title="foo" /><iframe title="foo" />',
      output: null,
      errors: [
        { message: '<iframe> elements must have a unique title property.' },
      ],
    },
    {
      code: '<iframe title="foo" /><iframe title="boo" /><iframe title="foo" /><iframe title="boo" />',
      output: null,
      errors: [
        { message: '<iframe> elements must have a unique title property.' },
        { message: '<iframe> elements must have a unique title property.' },
      ],
    },
    {
      code: '<iframe src="12" />',
      output: null,
      errors: [
        { message: '<iframe> elements must have a unique title property.' },
      ],
    },
    {
      code: '<iframe src="12" title={{false}} />',
      output: null,
      errors: [
        { message: '<iframe> elements must have a unique title property.' },
      ],
    },
    {
      code: '<iframe src="12" title="{{false}}" />',
      output: null,
      errors: [
        { message: '<iframe> elements must have a unique title property.' },
      ],
    },
    {
      code: '<iframe src="12" title="" />',
      output: null,
      errors: [
        { message: '<iframe> elements must have a unique title property.' },
      ],
    },
  ],
});
