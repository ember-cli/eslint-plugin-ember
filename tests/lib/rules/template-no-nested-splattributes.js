const rule = require('../../../lib/rules/template-no-nested-splattributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-nested-splattributes', rule, {
  valid: [
    // Note: In standalone gjs/gts templates, the concept of "top-level" is different.
    // These tests focus on the clear nested cases.
    '<template><div><p>No splattributes here</p></div></template>',
  
    // Test cases ported from ember-template-lint
    '<template><div>...</div></template>',
    '<template><div><div ...attributes>...</div></div></template>',
    '<template><div ...attributes>...</div></template>',
    '<template><div ...attributes>...</div><div ...attributes>...</div></template>',
  ],

  invalid: [
    {
      code: '<template><div><span ...attributes>Text</span></div></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use ...attributes on nested elements. Only use it on the top-level element of a component.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: '<template><section><div><button ...attributes>Click</button></div></section></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use ...attributes on nested elements. Only use it on the top-level element of a component.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: '<template><div class="wrapper"><input ...attributes /></div></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use ...attributes on nested elements. Only use it on the top-level element of a component.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: `<template><div ...attributes>
</div></template>`,
      output: null,
      errors: [{ message: 'Do not use ...attributes on nested elements. Only use it on the top-level element of a component.' }],
    },
    {
      code: `<template><div ...attributes>
</div></template>`,
      output: null,
      errors: [{ message: 'Do not use ...attributes on nested elements. Only use it on the top-level element of a component.' }],
    },
  ],
});
