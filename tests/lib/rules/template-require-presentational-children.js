//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-require-presentational-children');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-presentational-children', rule, {
  valid: [
    `<template>
      <ul>
        <li>Item</li>
      </ul>
    </template>`,
    `<template>
      <ul role="presentation">
        <div>Content</div>
      </ul>
    </template>`,
    `<template>
      <table role="none">
        <div>Content</div>
      </table>
    </template>`,
    `<template>
      <ul role="list">
        <li>Item</li>
      </ul>
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template><button></button></template>',
    '<template><div></div></template>',
    '<template><li role="tab">Tab title</li></template>',
    '<template><li role="tab"><h3 role="presentation">Tab Title</h3></li></template>',
    '<template><div role="button"><div><span></span></div></div></template>',
    '<template><span role="checkbox"/></template>',
    '<template><div role="article"><h2>Hello</h2></div></template>',
    `<template>
    <ul role="tablist">
      <li role="presentation">
        <a role="tab" href="#">Tab 1</a>
      </li>
    </ul>
    </template>`,
    `<template>
    <svg role="img">
      <title>Title here</title>
      <circle cx="10" cy="10" r="10"></circle>
    </svg></template>`,
    `<template>
      <MyButton role="tab">
        <:default>Button text</:default>
      </MyButton>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <ul role="presentation">
          <li>Item</li>
        </ul>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Element <ul> has role="presentation" but contains semantic child <li>. Presentational elements should only contain presentational children.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <table role="none">
          <tr><td>Data</td></tr>
        </table>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Element <table> has role="none" but contains semantic child <tr>. Presentational elements should only contain presentational children.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><div role="button"><h2>Test</h2></div></template>',
      output: null,
      errors: [{ message: 'Element <ul> has role=' }],
    },
    {
      code: '<template><div role="button"><h2 role="presentation"><img /></h2></div></template>',
      output: null,
      errors: [{ message: 'Element <ul> has role=' }],
    },
    {
      code: '<template><div role="button"><h2 role="presentation"><button>Test <img/></button></h2></div></template>',
      output: null,
      errors: [{ message: 'Element <ul> has role=' }],
    },
  ],
});
