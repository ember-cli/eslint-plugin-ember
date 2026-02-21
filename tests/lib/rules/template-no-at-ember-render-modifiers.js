//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-at-ember-render-modifiers');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-at-ember-render-modifiers', rule, {
  valid: [
    `<template>
      <div></div>
    </template>`,
    `<template>
      <div {{on "click" this.handleClick}}></div>
    </template>`,
    `<template>
      <MyComponent />
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template><div {{this.someModifier}}></div></template>',
    '<template><div {{someModifier}}></div></template>',
    '<template><div {{did-foo}}></div></template>',
    '<template>{{did-insert}}</template>',
    '<template>{{did-update}}</template>',
    '<template>{{will-destroy}}</template>',
  ],

  invalid: [
    {
      code: `<template>
        <div {{did-insert this.setup}}></div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid using @ember/render-modifiers. Use (did-insert), (did-update), or (will-destroy) from ember-render-helpers instead.',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },
    {
      code: `<template>
        <div {{did-update this.update}}></div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid using @ember/render-modifiers. Use (did-insert), (did-update), or (will-destroy) from ember-render-helpers instead.',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },
    {
      code: `<template>
        <div {{will-destroy this.cleanup}}></div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid using @ember/render-modifiers. Use (did-insert), (did-update), or (will-destroy) from ember-render-helpers instead.',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><div {{did-insert}}></div></template>',
      output: null,
      errors: [{ message: 'Avoid using @ember/render-modifiers. Use (did-insert), (did-update), or (will-destroy) from ember-render-helpers instead.' }],
    },
    {
      code: '<template><div {{did-update}}></div></template>',
      output: null,
      errors: [{ message: 'Avoid using @ember/render-modifiers. Use (did-insert), (did-update), or (will-destroy) from ember-render-helpers instead.' }],
    },
    {
      code: '<template><div {{will-destroy}}></div></template>',
      output: null,
      errors: [{ message: 'Avoid using @ember/render-modifiers. Use (did-insert), (did-update), or (will-destroy) from ember-render-helpers instead.' }],
    },
  ],
});
