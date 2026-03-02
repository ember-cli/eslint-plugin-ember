//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-whitespace-for-layout');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-whitespace-for-layout', rule, {
  valid: [
    '<template><div>Hello World</div></template>',
    '<template><div>Text</div></template>',

    '<template>Start to finish</template>',
    '<template>Start&nbsp;to&nbsp;finish</template>',
    '<template>Start<br>to<br>finish</template>',
    `<template><div>
  example
</div></template>`,
    `<template><div
  foo="bar"
  baz="qux"
>
  example
</div></template>`,
  ],
  invalid: [
    {
      code: '<template><div>Hello   World</div></template>',
      output: null,
      errors: [{ messageId: 'noWhitespaceForLayout' }],
    },
    {
      code: '<template><div>Text    with    spaces</div></template>',
      output: null,
      errors: [{ messageId: 'noWhitespaceForLayout' }],
    },
    {
      code: '<template><div>Multiple     spaces</div></template>',
      output: null,
      errors: [{ messageId: 'noWhitespaceForLayout' }],
    },

    {
      code: '<template>START  FINISH</template>',
      output: null,
      errors: [{ messageId: 'noWhitespaceForLayout' }],
    },
    {
      code: '<template>START&nbsp;&nbsp;FINISH</template>',
      output: null,
      errors: [{ messageId: 'noWhitespaceForLayout' }],
    },
    {
      code: '<template>START&nbsp; FINISH</template>',
      output: null,
      errors: [{ messageId: 'noWhitespaceForLayout' }],
    },
    {
      code: '<template>START &nbsp;FINISH</template>',
      output: null,
      errors: [{ messageId: 'noWhitespaceForLayout' }],
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

hbsRuleTester.run('template-no-whitespace-for-layout', rule, {
  valid: [
    'Start to finish',
    'Start&nbsp;to&nbsp;finish',
    'Start<br>to<br>finish',
    `<div>
  example
</div>`,
    `<div
  foo="bar"
  baz="qux"
>
  example
</div>`,
  ],
  invalid: [
    {
      code: 'START  FINISH',
      output: null,
      errors: [
        { message: 'Unexpected use of whitespace for layout. Use CSS for spacing instead of multiple spaces.' },
      ],
    },
    {
      code: 'START&nbsp;&nbsp;FINISH',
      output: null,
      errors: [
        { message: 'Unexpected use of whitespace for layout. Use CSS for spacing instead of multiple spaces.' },
      ],
    },
    {
      code: 'START&nbsp; FINISH',
      output: null,
      errors: [
        { message: 'Unexpected use of whitespace for layout. Use CSS for spacing instead of multiple spaces.' },
      ],
    },
    {
      code: 'START &nbsp;FINISH',
      output: null,
      errors: [
        { message: 'Unexpected use of whitespace for layout. Use CSS for spacing instead of multiple spaces.' },
      ],
    },
  ],
});
