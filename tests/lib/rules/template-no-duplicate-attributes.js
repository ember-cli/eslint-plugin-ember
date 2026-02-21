//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-duplicate-attributes');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-duplicate-attributes', rule, {
  valid: [
    `<template>
      <div class="foo" id="bar"></div>
    </template>`,
    `<template>
      <button type="button" disabled></button>
    </template>`,
    `<template>
      {{helper arg1="a" arg2="b"}}
    </template>`,
    `<template>
      {{#each items as |item|}}
        {{item}}
      {{/each}}
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template>{{my-component firstName=firstName lastName=lastName}}</template>',
    '<template> {{fullName}}</template>',
    '<template><a class="btn">{{btnLabel}}</a></template>',
    '<template>{{employee-profile employee=(hash firstName=firstName lastName=lastName age=age)}}</template>',
    '<template>{{employee-profile employee=(hash fullName=(hash firstName=firstName lastName=lastName) age=age)}}</template>',
  ],

  invalid: [
    {
      code: `<template>
        <div class="foo" class="bar"></div>
      </template>`,
      output: `<template>
        <div class="foo"></div>
      </template>`,
      errors: [
        {
          message: "Duplicate attribute 'class' found in the Element.",
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <input type="text" disabled type="email" />
      </template>`,
      output: `<template>
        <input type="text" disabled />
      </template>`,
      errors: [
        {
          message: "Duplicate attribute 'type' found in the Element.",
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        {{helper foo="bar" foo="baz"}}
      </template>`,
      output: `<template>
        {{helper foo="bar"}}
      </template>`,
      errors: [
        {
          message: "Duplicate attribute 'foo' found in the MustacheStatement.",
          type: 'GlimmerHashPair',
        },
      ],
    },
    {
      code: `<template>
        {{#if condition key="a" key="b"}}
          content
        {{/if}}
      </template>`,
      output: `<template>
        {{#if condition key="a"}}
          content
        {{/if}}
      </template>`,
      errors: [
        {
          message: "Duplicate attribute 'key' found in the BlockStatement.",
          type: 'GlimmerHashPair',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{my-component firstName=firstName lastName=lastName firstName=firstName}}</template>',
      output: null,
      errors: [{ message: 'Duplicate attribute ' }],
    },
    {
      code: '<template>{{#my-component firstName=firstName lastName=lastName firstName=firstName as |fullName|}}{{/my-component}}</template>',
      output: null,
      errors: [{ message: 'Duplicate attribute ' }],
    },
    {
      code: '<template><a class="btn" class="btn">{{btnLabel}}</a></template>',
      output: null,
      errors: [{ message: 'Duplicate attribute ' }],
    },
    {
      code: '<template>{{employee-profile employee=(hash firstName=firstName lastName=lastName age=age firstName=firstName)}}</template>',
      output: null,
      errors: [{ message: 'Duplicate attribute ' }],
    },
    {
      code: '<template>{{employee-profile employee=(hash fullName=(hash firstName=firstName lastName=lastName firstName=firstName) age=age)}}</template>',
      output: null,
      errors: [{ message: 'Duplicate attribute ' }],
    },
  ],
});
