//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-accesskey-attribute');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-accesskey-attribute', rule, {
  valid: [
    `<template>
      <button>Click me</button>
    </template>`,
    `<template>
      <div class="button">Content</div>
    </template>`,

    '<template><div></div></template>',
  ],

  invalid: [
    {
      code: `<template>
        <button accesskey="s">Save</button>
      </template>`,
      output: `<template>
        <button>Save</button>
      </template>`,
      errors: [
        {
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <a href="#" accesskey="h">Home</a>
      </template>`,
      output: `<template>
        <a href="#">Home</a>
      </template>`,
      errors: [
        {
          type: 'GlimmerAttrNode',
        },
      ],
    },

    {
      code: '<template><button accesskey="n"></button></template>',
      output: '<template><button></button></template>',
      errors: [
        {
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications.',
        },
      ],
    },
    {
      code: '<template><button accesskey></button></template>',
      output: '<template><button></button></template>',
      errors: [
        {
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications.',
        },
      ],
    },
    {
      code: '<template><button accesskey={{some-key}}></button></template>',
      output: '<template><button></button></template>',
      errors: [
        {
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications.',
        },
      ],
    },
    {
      code: '<template><button accesskey="{{some-key}}"></button></template>',
      output: '<template><button></button></template>',
      errors: [
        {
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications.',
        },
      ],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-accesskey-attribute (hbs)', rule, {
  valid: ['<div></div>'],
  invalid: [
    {
      code: '<button accesskey="n"></button>',
      output: '<button></button>',
      errors: [
        {
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications.',
        },
      ],
    },
    {
      code: '<button accesskey></button>',
      output: '<button></button>',
      errors: [
        {
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications.',
        },
      ],
    },
    {
      code: '<button accesskey={{some-key}}></button>',
      output: '<button></button>',
      errors: [
        {
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications.',
        },
      ],
    },
    {
      code: '<button accesskey="{{some-key}}"></button>',
      output: '<button></button>',
      errors: [
        {
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications.',
        },
      ],
    },
  ],
});
