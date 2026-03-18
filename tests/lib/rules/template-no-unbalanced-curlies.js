//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-unbalanced-curlies');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

// Note: Unbalanced curlies cause parser errors before the rule can run
// This rule is designed to catch edge cases in the AST if they somehow exist
// The parser itself will catch most unbalanced curly issues
ruleTester.run('template-no-unbalanced-curlies', rule, {
  valid: [
    '<template>{{value}}</template>',
    '<template>{{#if condition}}{{value}}{{/if}}</template>',
    '<template>{{helper param1 param2}}</template>',
    '<template>{{{unescaped}}}</template>',

    '<template>{foo}</template>',
    '<template>{{foo}}</template>',
    '<template>{{{foo}}}</template>',
    `<template>{{{foo
}}}</template>`,
    '<template>\\{{foo}}</template>',
    '<template>\\{{foo}}\\{{foo}}</template>',
    '<template>\\{{foo}}{{foo}}</template>',
    `<template>\\{{foo
}}</template>`,
  ],
  invalid: [
    // Parser catches these before the rule runs, so no invalid cases to test

    {
      code: '<template>foo}}</template>',
      output: null,
      errors: [{ messageId: 'noUnbalancedCurlies' }],
    },
    {
      code: '<template>{foo}}</template>',
      output: null,
      errors: [{ messageId: 'noUnbalancedCurlies' }],
    },
    {
      code: '<template>foo}}}</template>',
      output: null,
      errors: [{ messageId: 'noUnbalancedCurlies' }],
    },
    {
      code: '<template>{foo}}}</template>',
      output: null,
      errors: [{ messageId: 'noUnbalancedCurlies' }],
    },
    {
      code: `<template>{foo
}}}</template>`,
      output: null,
      errors: [{ messageId: 'noUnbalancedCurlies' }],
    },
    {
      code: `<template>{foo
}}}
bar</template>`,
      output: null,
      errors: [{ messageId: 'noUnbalancedCurlies' }],
    },
    {
      code: `<template>{foor
barr
r
baz}}}</template>`,
      output: null,
      errors: [{ messageId: 'noUnbalancedCurlies' }],
    },
    {
      code: '<template>{foorbarrrbaz}}}</template>',
      output: null,
      errors: [{ messageId: 'noUnbalancedCurlies' }],
    },
    {
      code: '<template>{foo\r\nbar\r\n\r\nbaz}}}</template>',
      output: null,
      errors: [{ messageId: 'noUnbalancedCurlies' }],
    },
    {
      code: '<template>{foo\rbar\r\rbaz}}}</template>',
      output: null,
      errors: [{ messageId: 'noUnbalancedCurlies' }],
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

hbsRuleTester.run('template-no-unbalanced-curlies', rule, {
  valid: [
    '{foo}',
    '{{foo}}',
    '{{{foo}}}',
    `{{{foo
}}}`,
    '\\{{foo}}',
    '\\{{foo}}\\{{foo}}',
    '\\{{foo}}{{foo}}',
    `\\{{foo
}}`,
  ],
  invalid: [
    {
      code: 'foo}}',
      output: null,
      errors: [
        { message: 'Unbalanced mustache curlies detected. This may indicate a syntax error.' },
      ],
    },
    {
      code: '{foo}}',
      output: null,
      errors: [
        { message: 'Unbalanced mustache curlies detected. This may indicate a syntax error.' },
      ],
    },
    {
      code: 'foo}}}',
      output: null,
      errors: [
        { message: 'Unbalanced mustache curlies detected. This may indicate a syntax error.' },
      ],
    },
    {
      code: '{foo}}}',
      output: null,
      errors: [
        { message: 'Unbalanced mustache curlies detected. This may indicate a syntax error.' },
      ],
    },
    {
      code: `{foo
}}}`,
      output: null,
      errors: [
        { message: 'Unbalanced mustache curlies detected. This may indicate a syntax error.' },
      ],
    },
    {
      code: `{foo
}}}
bar`,
      output: null,
      errors: [
        { message: 'Unbalanced mustache curlies detected. This may indicate a syntax error.' },
      ],
    },
    {
      code: `{foo
bar

baz}}}`,
      output: null,
      errors: [
        { message: 'Unbalanced mustache curlies detected. This may indicate a syntax error.' },
      ],
    },
    {
      code: '{foo\r\nbar\r\n\r\nbaz}}}',
      output: null,
      errors: [
        { message: 'Unbalanced mustache curlies detected. This may indicate a syntax error.' },
      ],
    },
    {
      code: '{foo\rbar\r\rbaz}}}',
      output: null,
      errors: [
        { message: 'Unbalanced mustache curlies detected. This may indicate a syntax error.' },
      ],
    },
  ],
});
