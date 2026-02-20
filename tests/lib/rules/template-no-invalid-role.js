//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-invalid-role');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-role', rule, {
  valid: [
    `<template>
      <div role="button">Click</div>
    </template>`,
    `<template>
      <div role="navigation">Nav</div>
    </template>`,
    `<template>
      <div role="main">Content</div>
    </template>`,
    `<template>
      <div role="presentation">Hidden</div>
    </template>`,
    `<template>
      <div role="none">Hidden</div>
    </template>`,
    `<template>
      <div>No role</div>
    </template>`,
    `<template>
      <div role={{this.dynamicRole}}>Dynamic</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <div role="invalid">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: "Invalid ARIA role 'invalid'. Must be a valid ARIA role.",
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div role="btn">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: "Invalid ARIA role 'btn'. Must be a valid ARIA role.",
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div role="fake-role">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: "Invalid ARIA role 'fake-role'. Must be a valid ARIA role.",
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
