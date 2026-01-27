//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-require-lang-attribute');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-lang-attribute', rule, {
  valid: [
    `<template>
      <html lang="en">
        <body>Content</body>
      </html>
    </template>`,
    `<template>
      <html lang="es">
        <body>Contenido</body>
      </html>
    </template>`,
    `<template>
      <div>No html element</div>
    </template>`,
    `<template>
      <html lang={{this.locale}}>
        <body>Content</body>
      </html>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <html>
          <body>Content</body>
        </html>
      </template>`,
      output: null,
      errors: [
        {
          message: 'The <html> element must have a lang attribute.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
