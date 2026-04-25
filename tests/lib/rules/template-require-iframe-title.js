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
    // Mustache string literals resolve to their static value — non-empty
    // literals supply an accessible name the same as a text node.
    '<template><iframe title={{"My frame"}} /></template>',
    '<template><iframe title="foo" /><iframe title="bar" /></template>',
    // allowWhitespaceOnlyTitle: true — whitespace-only accepted.
    {
      code: '<template><iframe title="   " /></template>',
      options: [{ allowWhitespaceOnlyTitle: true }],
    },
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
    // Empty string-literal mustaches and concat-with-empty-string-literal
    // resolve to "" via the static-attr-value handling and are flagged the
    // same as the text-node empty case. Closes a bypass jsx-a11y already
    // catches via getLiteralPropValue.
    {
      code: '<template><iframe title={{""}} /></template>',
      output: null,
      errors: [{ messageId: 'emptyTitle' }],
    },
    {
      code: '<template><iframe title="{{""}}" /></template>',
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
      errors: [{ messageId: 'invalidTitleLiteral', data: { literalType: 'boolean' } }],
    },
    {
      code: '<template><iframe src="12" title="{{false}}" /></template>',
      output: null,
      errors: [{ messageId: 'invalidTitleLiteral', data: { literalType: 'boolean' } }],
    },
    {
      code: '<template><iframe src="12" title="" /></template>',
      output: null,
      errors: [{ messageId: 'emptyTitle' }],
    },

    // Mustache literals that don't coerce to a useful accessible name.
    {
      code: '<template><iframe title={{null}} /></template>',
      output: null,
      errors: [{ messageId: 'invalidTitleLiteral', data: { literalType: 'null' } }],
    },
    {
      code: '<template><iframe title={{undefined}} /></template>',
      output: null,
      errors: [{ messageId: 'invalidTitleLiteral', data: { literalType: 'undefined' } }],
    },
    {
      code: '<template><iframe title={{42}} /></template>',
      output: null,
      errors: [{ messageId: 'invalidTitleLiteral', data: { literalType: 'number' } }],
    },
    {
      code: '<template><iframe title="{{null}}" /></template>',
      output: null,
      errors: [{ messageId: 'invalidTitleLiteral', data: { literalType: 'null' } }],
    },
    {
      code: '<template><iframe title="{{undefined}}" /></template>',
      output: null,
      errors: [{ messageId: 'invalidTitleLiteral', data: { literalType: 'undefined' } }],
    },
    {
      code: '<template><iframe title="{{42}}" /></template>',
      output: null,
      errors: [{ messageId: 'invalidTitleLiteral', data: { literalType: 'number' } }],
    },

    // Whitespace-only title is flagged by default (authoring hygiene).
    {
      code: '<template><iframe title="   " /></template>',
      output: null,
      errors: [{ messageId: 'emptyTitle' }],
    },
    // Empty-string title is flagged even with allowWhitespaceOnlyTitle: true
    // (an empty string is not a whitespace string).
    {
      code: '<template><iframe title="" /></template>',
      output: null,
      options: [{ allowWhitespaceOnlyTitle: true }],
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
    // allowWhitespaceOnlyTitle: true — whitespace-only accepted in HBS too.
    {
      code: '<iframe title="   " />',
      options: [{ allowWhitespaceOnlyTitle: true }],
    },
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
      errors: [
        {
          message:
            '<iframe title> must be a non-empty string. Got boolean literal, which does not describe the frame contents.',
        },
      ],
    },
    {
      code: '<iframe src="12" title="{{false}}" />',
      output: null,
      errors: [
        {
          message:
            '<iframe title> must be a non-empty string. Got boolean literal, which does not describe the frame contents.',
        },
      ],
    },
    {
      code: '<iframe src="12" title="" />',
      output: null,
      errors: [{ message: '<iframe> elements must have a unique title property.' }],
    },

    // hbs parity with gjs for the other non-string mustache literals
    // (boolean true / null / undefined / number).
    {
      code: '<iframe title={{true}} />',
      output: null,
      errors: [
        {
          message:
            '<iframe title> must be a non-empty string. Got boolean literal, which does not describe the frame contents.',
        },
      ],
    },
    {
      code: '<iframe title={{null}} />',
      output: null,
      errors: [
        {
          message:
            '<iframe title> must be a non-empty string. Got null literal, which does not describe the frame contents.',
        },
      ],
    },
    {
      code: '<iframe title={{undefined}} />',
      output: null,
      errors: [
        {
          message:
            '<iframe title> must be a non-empty string. Got undefined literal, which does not describe the frame contents.',
        },
      ],
    },
    {
      code: '<iframe title={{42}} />',
      output: null,
      errors: [
        {
          message:
            '<iframe title> must be a non-empty string. Got number literal, which does not describe the frame contents.',
        },
      ],
    },
  ],
});
