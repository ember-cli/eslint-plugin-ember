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

    '<template><div>...</div></template>',
    '<template><div><div ...attributes>...</div></div></template>',
    '<template><div ...attributes>...</div></template>',
    '<template><div ...attributes>...</div><div ...attributes>...</div></template>',
  ],

  invalid: [
    {
      code: '<template><div ...attributes><span ...attributes>Text</span></div></template>',
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
      code: '<template><section ...attributes><div><button ...attributes>Click</button></div></section></template>',
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
      code: '<template><div ...attributes class="wrapper"><input ...attributes /></div></template>',
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
      code: `<template><div ...attributes>
  <div ...attributes>
    ...
  </div>
</div>
</template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use ...attributes on nested elements. Only use it on the top-level element of a component.',
        },
      ],
    },
    {
      code: `<template><div ...attributes>
  <div>
    <div ...attributes>
    ...
    </div>
  </div>
</div>
</template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use ...attributes on nested elements. Only use it on the top-level element of a component.',
        },
      ],
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

hbsRuleTester.run('template-no-nested-splattributes', rule, {
  valid: [
    '<div>...</div>',
    '<div><div ...attributes>...</div></div>',
    '<div ...attributes>...</div>',
    '<div ...attributes>...</div><div ...attributes>...</div>',
  ],
  invalid: [
  ],
});
