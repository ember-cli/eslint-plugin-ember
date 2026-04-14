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

    '<template><div {{this.someModifier}}></div></template>',
    '<template><div {{someModifier}}></div></template>',
    '<template><div {{did-foo}}></div></template>',
    '<template>{{did-insert}}</template>',
    '<template>{{did-update}}</template>',
    '<template>{{will-destroy}}</template>',

    // In GJS/GTS, kebab identifiers cannot be imports; these are bare paths
    // that happen to share the canonical name but are not the render modifier.
    {
      filename: 'test.gjs',
      code: '<template><div {{did-insert this.setup}}></div></template>',
    },
    // Unrelated imports with matching local names should not match
    {
      filename: 'test.gjs',
      code: `import didInsert from './my-lib';
        <template><div {{didInsert this.setup}}></div></template>`,
    },
    // Root-package import of an unknown named export is not a render modifier
    {
      filename: 'test.gjs',
      code: `import { somethingElse } from '@ember/render-modifiers';
        <template><div {{somethingElse this.setup}}></div></template>`,
    },
  ],

  invalid: [
    {
      code: `<template>
        <div {{did-insert this.setup}}></div>
      </template>`,
      output: null,
      errors: [
        {
          messageId: 'noRenderModifier',
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
          messageId: 'noRenderModifier',
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
          messageId: 'noRenderModifier',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },

    {
      code: '<template><div {{did-insert}}></div></template>',
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
    {
      code: '<template><div {{did-update}}></div></template>',
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
    {
      code: '<template><div {{will-destroy}}></div></template>',
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },

    // GJS/GTS import-based forms — local name is user-chosen
    {
      filename: 'test.gjs',
      code: `import didInsert from '@ember/render-modifiers/modifiers/did-insert';
        <template><div {{didInsert this.setup}}></div></template>`,
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
    {
      filename: 'test.gjs',
      code: `import didUpdate from '@ember/render-modifiers/modifiers/did-update';
        <template><div {{didUpdate this.update}}></div></template>`,
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
    {
      filename: 'test.gjs',
      code: `import willDestroy from '@ember/render-modifiers/modifiers/will-destroy';
        <template><div {{willDestroy this.cleanup}}></div></template>`,
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
    // Renamed default import still flags
    {
      filename: 'test.gjs',
      code: `import myInsert from '@ember/render-modifiers/modifiers/did-insert';
        <template><div {{myInsert this.setup}}></div></template>`,
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },

    // Root-package named imports — all three modifiers
    {
      filename: 'test.gjs',
      code: `import { didInsert } from '@ember/render-modifiers';
        <template><div {{didInsert this.setup}}></div></template>`,
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
    {
      filename: 'test.gjs',
      code: `import { didUpdate } from '@ember/render-modifiers';
        <template><div {{didUpdate this.update}}></div></template>`,
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
    {
      filename: 'test.gjs',
      code: `import { willDestroy } from '@ember/render-modifiers';
        <template><div {{willDestroy this.cleanup}}></div></template>`,
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
    // Aliased root-package import still flags
    {
      filename: 'test.gjs',
      code: `import { didInsert as myModifier } from '@ember/render-modifiers';
        <template><div {{myModifier this.setup}}></div></template>`,
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-at-ember-render-modifiers (hbs)', rule, {
  valid: [
    '<div {{this.someModifier}}></div>',
    '<div {{someModifier}}></div>',
    '<div {{did-foo}}></div>',
    '{{did-insert}}',
    '{{did-update}}',
    '{{will-destroy}}',
  ],
  invalid: [
    {
      code: '<div {{did-insert}}></div>',
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
    {
      code: '<div {{did-update}}></div>',
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
    {
      code: '<div {{will-destroy}}></div>',
      output: null,
      errors: [{ messageId: 'noRenderModifier' }],
    },
  ],
});
