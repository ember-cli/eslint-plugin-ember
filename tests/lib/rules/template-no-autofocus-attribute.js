//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-autofocus-attribute');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-autofocus-attribute', rule, {
  valid: [
    `<template>
      <input type="text" />
    </template>`,
    `<template>
      <button>Click me</button>
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template><input /></template>',
    '<template><input type="text" disabled="true" /></template>',
    '<template><input type="password" disabled={{false}} /></template>',
    '<template><input type="password" disabled /></template>',
    '<template>{{input type="text" disabled=true}}</template>',
    '<template>{{component "input" type="text" disabled=true}}</template>',
    '<template><div></div></template>',
    '<template><h1><span>Valid Heading</span></h1></template>',
    '<template><CustomComponent /></template>',
    '<template><CustomComponent disabled /></template>',
    '<template><CustomComponent disabled=true /></template>',
  ],

  invalid: [
    {
      code: `<template>
        <input type="text" autofocus />
      </template>`,
      output: `<template>
        <input type="text"/>
      </template>`,
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <textarea autofocus></textarea>
      </template>`,
      output: `<template>
        <textarea></textarea>
      </template>`,
      errors: [
        {
          type: 'GlimmerAttrNode',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><input autofocus /></template>',
      output: null,
      errors: [{ message: 'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.' }],
    },
    {
      code: '<template><input type="text" autofocus="autofocus" /></template>',
      output: null,
      errors: [{ message: 'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.' }],
    },
    {
      code: '<template><input autofocus={{this.foo}} /></template>',
      output: null,
      errors: [{ message: 'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.' }],
    },
    {
      code: '<template>{{input type="text" autofocus=true}}</template>',
      output: null,
      errors: [{ message: 'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.' }],
    },
    {
      code: '<template>{{component "input" type="text" autofocus=true}}</template>',
      output: null,
      errors: [{ message: 'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.' }],
    },
    {
      code: '<template><div autofocus="true"></div></template>',
      output: null,
      errors: [{ message: 'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.' }],
    },
    {
      code: '<template><h1 autofocus="autofocus"><span>Valid Heading</span></h1></template>',
      output: null,
      errors: [{ message: 'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.' }],
    },
    {
      code: '<template><CustomComponent autofocus={{this.foo}} /></template>',
      output: null,
      errors: [{ message: 'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.' }],
    },
  ],
});
