//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-redundant-landmark-role');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-redundant-landmark-role', rule, {
  valid: [
    `<template>
      <nav>Navigation</nav>
    </template>`,
    `<template>
      <main>Content</main>
    </template>`,
    `<template>
      <aside>Sidebar</aside>
    </template>`,
    `<template>
      <div role="navigation">Custom nav</div>
    </template>`,
    `<template>
      <nav role="presentation">Override implicit role</nav>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <nav role="navigation">Nav</nav>
      </template>`,
      output: `<template>
        <nav>Nav</nav>
      </template>`,
      errors: [
        {
          message:
            'Redundant role "navigation". The <nav> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <main role="main">Content</main>
      </template>`,
      output: `<template>
        <main>Content</main>
      </template>`,
      errors: [
        {
          message: 'Redundant role "main". The <main> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <aside role="complementary">Sidebar</aside>
      </template>`,
      output: `<template>
        <aside>Sidebar</aside>
      </template>`,
      errors: [
        {
          message:
            'Redundant role "complementary". The <aside> element already has this role implicitly.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
