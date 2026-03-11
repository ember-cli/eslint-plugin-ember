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
    {
      code: '<template><input autofocus /></template>',
      output: '<template><input/></template>',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '<template><input type="text" autofocus="autofocus" /></template>',
      output: '<template><input type="text" /></template>',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '<template><input autofocus={{this.foo}} /></template>',
      output: '<template><input /></template>',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '<template><div autofocus="true"></div></template>',
      output: '<template><div></div></template>',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '<template><h1 autofocus="autofocus"><span>Valid Heading</span></h1></template>',
      output: '<template><h1><span>Valid Heading</span></h1></template>',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '<template><CustomComponent autofocus={{this.foo}} /></template>',
      output: '<template><CustomComponent /></template>',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-autofocus-attribute (hbs)', rule, {
  valid: [
    '<input />',
    '<input type="text" disabled="true" />',
    '<input type="password" disabled={{false}} />',
    '<input type="password" disabled />',
    '<div></div>',
    '<h1><span>Valid Heading</span></h1>',
    '<CustomComponent />',
    '<CustomComponent disabled />',
    '<CustomComponent disabled=true />',
  ],
  invalid: [
    {
      code: '<input autofocus />',
      output: '<input/>',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '<input type="text" autofocus="autofocus" />',
      output: '<input type="text" />',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '<input autofocus={{this.foo}} />',
      output: '<input />',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '<div autofocus="true"></div>',
      output: '<div></div>',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '<h1 autofocus="autofocus"><span>Valid Heading</span></h1>',
      output: '<h1><span>Valid Heading</span></h1>',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '<CustomComponent autofocus={{this.foo}} />',
      output: '<CustomComponent />',
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '{{input type="text" autofocus=true}}',
      output: null,
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
    {
      code: '{{component "input" type="text" autofocus=true}}',
      output: null,
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
        },
      ],
    },
  ],
});
