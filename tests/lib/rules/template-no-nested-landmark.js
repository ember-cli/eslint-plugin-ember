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
  
    // Test cases ported from ember-template-lint
    '<template><div><main></main></div></template>',
    '<template><div role="application"><div role="document"><div role="application"></div></div></div></template>',
    '<template><header><nav></nav></header></template>',
    '<template><div role="banner"><nav></nav></div></template>',
    '<template><header><div role="navigation"></div></header></template>',
    '<template><div role="banner"><div role="navigation"></div></div></template>',
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
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><main><main></main></main></template>',
      output: null,
      errors: [{ message: 'Landmark elements should not be nested within other landmarks.' }],
    },
    {
      code: '<template><main><div><main></main></div></main></template>',
      output: null,
      errors: [{ message: 'Landmark elements should not be nested within other landmarks.' }],
    },
    {
      code: '<template><div role="main"><main></main></div></template>',
      output: null,
      errors: [{ message: 'Landmark elements should not be nested within other landmarks.' }],
    },
    {
      code: '<template><div role="main"><div><main></main></div></div></template>',
      output: null,
      errors: [{ message: 'Landmark elements should not be nested within other landmarks.' }],
    },
    {
      code: '<template><main><div role="main"></div></main></template>',
      output: null,
      errors: [{ message: 'Landmark elements should not be nested within other landmarks.' }],
    },
    {
      code: '<template><main><div><div role="main"></div></div></main></template>',
      output: null,
      errors: [{ message: 'Landmark elements should not be nested within other landmarks.' }],
    },
    {
      code: '<template><nav><nav></nav></nav></template>',
      output: null,
      errors: [{ message: 'Landmark elements should not be nested within other landmarks.' }],
    },
    {
      code: '<template><header><header></header></header></template>',
      output: null,
      errors: [{ message: 'Landmark elements should not be nested within other landmarks.' }],
    },
    {
      code: '<template><header><div role="banner"></div></header></template>',
      output: null,
      errors: [{ message: 'Landmark elements should not be nested within other landmarks.' }],
    },
    {
      code: '<template><div role="contentinfo"><footer></footer></div></template>',
      output: null,
      errors: [{ message: 'Landmark elements should not be nested within other landmarks.' }],
    },
  ],
});
