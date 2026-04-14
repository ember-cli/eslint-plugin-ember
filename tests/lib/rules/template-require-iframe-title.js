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
      errors: [{ messageId: 'emptyTitle' }],
    },

    {
      // Both occurrences are reported with a shared `#N` index.
      code: '<template><iframe title="foo" /><iframe title="foo" /></template>',
      output: null,
      errors: [
        { message: 'This title is not unique. #1' },
        {
          message:
            '<iframe> elements must have a unique title property. Value title="foo" already used for different iframe. #1',
        },
      ],
    },
    {
      // Three duplicates → the first occurrence is re-reported on every
      // collision, so iframe #1 is flagged twice (once per later collision)
      // and iframes #2 and #3 are each flagged once. ESLint sorts by source
      // location, so the two first-occurrence reports (same location) come
      // before the two later occurrences.
      code: '<template><iframe title="foo" /><iframe title="foo" /><iframe title="foo" /></template>',
      output: null,
      errors: [
        { message: 'This title is not unique. #1' },
        { message: 'This title is not unique. #1' },
        {
          message:
            '<iframe> elements must have a unique title property. Value title="foo" already used for different iframe. #1',
        },
        {
          message:
            '<iframe> elements must have a unique title property. Value title="foo" already used for different iframe. #1',
        },
      ],
    },
    {
      // Two distinct duplicate groups → 4 reports, indices #1 and #2.
      // ESLint sorts errors by source location; the two "first-occurrence"
      // reports attach to the first two iframes and so precede the two
      // "other-occurrence" reports attached to the later iframes.
      code: '<template><iframe title="foo" /><iframe title="boo" /><iframe title="foo" /><iframe title="boo" /></template>',
      output: null,
      errors: [
        { message: 'This title is not unique. #1' },
        { message: 'This title is not unique. #2' },
        {
          message:
            '<iframe> elements must have a unique title property. Value title="foo" already used for different iframe. #1',
        },
        {
          message:
            '<iframe> elements must have a unique title property. Value title="boo" already used for different iframe. #2',
        },
      ],
    },
    {
      code: '<template><iframe src="12" /></template>',
      output: null,
      errors: [{ messageId: 'missingTitle' }],
    },
    {
      code: '<template><iframe src="12" title={{false}} /></template>',
      output: null,
      errors: [{ messageId: 'dynamicFalseTitle' }],
    },
    {
      code: '<template><iframe src="12" title="{{false}}" /></template>',
      output: null,
      errors: [{ messageId: 'dynamicFalseTitle' }],
    },
    {
      code: '<template><iframe src="12" title="" /></template>',
      output: null,
      errors: [{ messageId: 'emptyTitle' }],
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
        { message: 'This title is not unique. #1' },
        {
          message:
            '<iframe> elements must have a unique title property. Value title="foo" already used for different iframe. #1',
        },
      ],
    },
    {
      // Three duplicates: the first occurrence is re-reported on every
      // collision, so iframe #1 is flagged twice and each later iframe once.
      code: '<iframe title="foo" /><iframe title="foo" /><iframe title="foo" />',
      output: null,
      errors: [
        { message: 'This title is not unique. #1' },
        { message: 'This title is not unique. #1' },
        {
          message:
            '<iframe> elements must have a unique title property. Value title="foo" already used for different iframe. #1',
        },
        {
          message:
            '<iframe> elements must have a unique title property. Value title="foo" already used for different iframe. #1',
        },
      ],
    },
    {
      code: '<iframe title="foo" /><iframe title="boo" /><iframe title="foo" /><iframe title="boo" />',
      output: null,
      errors: [
        { message: 'This title is not unique. #1' },
        { message: 'This title is not unique. #2' },
        {
          message:
            '<iframe> elements must have a unique title property. Value title="foo" already used for different iframe. #1',
        },
        {
          message:
            '<iframe> elements must have a unique title property. Value title="boo" already used for different iframe. #2',
        },
      ],
    },
    {
      code: '<iframe src="12" />',
      output: null,
      errors: [{ message: '<iframe> elements must have a unique title property.' }],
    },
    {
      code: '<iframe src="12" title={{false}} />',
      output: null,
      errors: [{ message: '<iframe> elements must have a unique title property.' }],
    },
    {
      code: '<iframe src="12" title="{{false}}" />',
      output: null,
      errors: [{ message: '<iframe> elements must have a unique title property.' }],
    },
    {
      code: '<iframe src="12" title="" />',
      output: null,
      errors: [{ message: '<iframe> elements must have a unique title property.' }],
    },
  ],
});
