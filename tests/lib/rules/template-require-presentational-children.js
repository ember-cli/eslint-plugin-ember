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
    // SKIPPED_TAGS: <svg> is always skipped, even when its role has childrenPresentational
    // (graphics-symbol is such a role via Graphics-ARIA; this covers the new aria-query-derived set).
    `<template>
    <svg role="graphics-symbol">
      <circle cx="10" cy="10" r="10"></circle>
    </svg></template>`,
    `<template>
      <MyButton role="tab">
        <:default>Button text</:default>
      </MyButton>
    </template>`,
    {
      code: '<template><button><div>item1</div><custom-element>item2</custom-element></button></template>',
      options: [{ additionalNonSemanticTags: ['custom-element'] }],
    },
  ],

  invalid: [
    {
      code: '<template><div role="button"><h2>Test</h2></div></template>',
      output: null,
      errors: [
        {
          message: '<div> has a role of button, it cannot have semantic descendants like <h2>',
        },
      ],
    },
    {
      code: '<template><div role="button"><h2 role="presentation"><img /></h2></div></template>',
      output: null,
      errors: [
        {
          message: '<div> has a role of button, it cannot have semantic descendants like <img>',
        },
      ],
    },
    {
      code: '<template><div role="button"><h2 role="presentation"><button>Test <img/></button></h2></div></template>',
      output: null,
      errors: [
        {
          message: '<div> has a role of button, it cannot have semantic descendants like <button>',
        },
        {
          message: '<div> has a role of button, it cannot have semantic descendants like <img>',
        },
      ],
    },
    // doc-pagebreak: DPUB-ARIA role with childrenPresentational; now included via aria-query.
    {
      code: '<template><div role="doc-pagebreak"><h2>pg</h2></div></template>',
      output: null,
      errors: [
        {
          message:
            '<div> has a role of doc-pagebreak, it cannot have semantic descendants like <h2>',
        },
      ],
    },
    // graphics-symbol: Graphics-ARIA role with childrenPresentational; flags on non-svg host.
    {
      code: '<template><div role="graphics-symbol"><text>X</text></div></template>',
      output: null,
      errors: [
        {
          message:
            '<div> has a role of graphics-symbol, it cannot have semantic descendants like <text>',
        },
      ],
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

hbsRuleTester.run('template-require-presentational-children', rule, {
  valid: [
    '<button></button>',
    '<div></div>',
    '<li role="tab">Tab title</li>',
    '<li role="tab"><h3 role="presentation">Tab Title</h3></li>',
    '<div role="button"><div><span></span></div></div>',
    '<span role="checkbox"/>',
    '<div role="article"><h2>Hello</h2></div>',
    `
    <ul role="tablist">
      <li role="presentation">
        <a role="tab" href="#">Tab 1</a>
      </li>
    </ul>
    `,
    `
    <svg role="img">
      <title>Title here</title>
      <circle cx="10" cy="10" r="10"></circle>
    </svg>`,
    // SKIPPED_TAGS: <svg> is always skipped, even when its role has childrenPresentational
    // (graphics-symbol is such a role via Graphics-ARIA; this covers the new aria-query-derived set).
    `
    <svg role="graphics-symbol">
      <circle cx="10" cy="10" r="10"></circle>
    </svg>`,
    `
      <MyButton role="tab">
        <:default>Button text</:default>
      </MyButton>
    `,
    {
      code: '<button><div>item1</div><custom-element>item2</custom-element></button>',
      options: [{ additionalNonSemanticTags: ['custom-element'] }],
    },
  ],
  invalid: [
    {
      code: '<div role="button"><h2>Test</h2></div>',
      output: null,
      errors: [
        {
          message: '<div> has a role of button, it cannot have semantic descendants like <h2>',
        },
      ],
    },
    {
      code: '<div role="button"><h2 role="presentation"><img /></h2></div>',
      output: null,
      errors: [
        {
          message: '<div> has a role of button, it cannot have semantic descendants like <img>',
        },
      ],
    },
    {
      code: '<div role="button"><h2 role="presentation"><button>Test <img/></button></h2></div>',
      output: null,
      errors: [
        {
          message: '<div> has a role of button, it cannot have semantic descendants like <button>',
        },
        {
          message: '<div> has a role of button, it cannot have semantic descendants like <img>',
        },
      ],
    },
    // doc-pagebreak: DPUB-ARIA role with childrenPresentational; now included via aria-query.
    {
      code: '<div role="doc-pagebreak"><h2>pg</h2></div>',
      output: null,
      errors: [
        {
          message:
            '<div> has a role of doc-pagebreak, it cannot have semantic descendants like <h2>',
        },
      ],
    },
    // graphics-symbol: Graphics-ARIA role with childrenPresentational; flags on non-svg host.
    {
      code: '<div role="graphics-symbol"><text>X</text></div>',
      output: null,
      errors: [
        {
          message:
            '<div> has a role of graphics-symbol, it cannot have semantic descendants like <text>',
        },
      ],
    },
  ],
});
