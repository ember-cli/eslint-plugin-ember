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
      <button>Save</button>
    </template>`,
    `<template>
      <a href="#">Home</a>
    </template>`,
    `<template>
      <div class="container">Content</div>
    </template>`,
    `<template>
      <input type="text" placeholder="Enter text" />
    </template>`,
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
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.',
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
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <input type="submit" accesskey="s" value="Submit" />
      </template>`,
      output: `<template>
        <input type="submit" value="Submit" />
      </template>`,
      errors: [
        {
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: '<template><div accesskey="d">Content</div></template>',
      output: '<template><div>Content</div></template>',
      errors: [
        {
          message:
            'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
