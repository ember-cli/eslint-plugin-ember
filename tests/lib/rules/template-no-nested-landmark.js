//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-nested-landmark');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-nested-landmark', rule, {
  valid: [
    `<template>
      <nav>Navigation</nav>
      <main>Content</main>
    </template>`,
    `<template>
      <div>
        <nav>Nav 1</nav>
        <nav>Nav 2</nav>
      </div>
    </template>`,
    `<template>
      <main>
        <div>Content</div>
      </main>
    </template>`,
    `<template>
      <div role="navigation">Nav</div>
      <div role="main">Content</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <nav>
          <main>Content</main>
        </nav>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Landmark elements should not be nested within other landmarks.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <main>
          <nav>Navigation</nav>
        </main>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Landmark elements should not be nested within other landmarks.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <div role="main">
          <div role="navigation">Nav</div>
        </div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Landmark elements should not be nested within other landmarks.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
