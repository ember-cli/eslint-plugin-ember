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

    '<template><html lang="en"></html></template>',
    '<template><html lang="en-US"></html></template>',
    '<template><html lang="DE-BW"></html></template>',
    '<template><html lang={{lang}}></html></template>',
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

    {
      code: '<template><html></html></template>',
      output: null,
      errors: [{ message: 'The <html> element must have a lang attribute.' }],
    },
    {
      code: '<template><html lang=""></html></template>',
      output: null,
      errors: [{ message: 'The <html> element must have a non-empty lang attribute.' }],
    },
    {
      code: '<template><html lang="gibberish"></html></template>',
      output: null,
      errors: [{ message: 'The <html> element has an invalid lang value "gibberish".' }],
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

hbsRuleTester.run('template-require-lang-attribute', rule, {
  valid: [
    '<html lang="en"></html>',
    '<html lang="en-US"></html>',
    '<html lang="DE-BW"></html>',
    '<html lang={{lang}}></html>',
    '<html lang="de"></html>',
    '<html lang={{this.language}}></html>',
    '<html lang={{this.blah}}></html>',
    // validateValues: false allows non-BCP47 values
    {
      code: '<html lang="hurrah"></html>',
      options: [{ validateValues: false }],
    },
    {
      code: '<html lang={{this.blah}}></html>',
      options: [{ validateValues: false }],
    },
  ],
  invalid: [
    {
      code: '<html></html>',
      output: null,
      errors: [{ message: 'The <html> element must have a lang attribute.' }],
    },
    {
      code: '<html lang=""></html>',
      output: null,
      errors: [{ message: 'The <html> element must have a non-empty lang attribute.' }],
    },
    {
      code: '<html lang="gibberish"></html>',
      output: null,
      errors: [{ message: 'The <html> element has an invalid lang value "gibberish".' }],
    },
  ],
});
