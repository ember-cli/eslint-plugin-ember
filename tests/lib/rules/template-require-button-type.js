//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-require-button-type');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-button-type', rule, {
  valid: [
    `<template>
      <button type="button">Click me</button>
    </template>`,
    `<template>
      <button type="submit">Submit</button>
    </template>`,
    `<template>
      <button type="reset">Reset</button>
    </template>`,
    `<template>
      <div>Not a button</div>
    </template>`,

    '<template><button type="button" /></template>',
    '<template><button type="button">label</button></template>',
    '<template><button type="submit" /></template>',
    '<template><button type="reset" /></template>',
    '<template><button type="{{buttonType}}" /></template>',
    '<template><button type={{buttonType}} /></template>',
    '<template><div/></template>',
    '<template><div></div></template>',
    '<template><div type="randomType"></div></template>',
  ],

  invalid: [
    {
      code: `<template>
        <button>Click me</button>
      </template>`,
      output: `<template>
        <button type="button">Click me</button>
      </template>`,
      errors: [
        {
          message: 'All `<button>` elements should have a valid `type` attribute',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <form>
          <button>Submit</button>
        </form>
      </template>`,
      output: `<template>
        <form>
          <button type="submit">Submit</button>
        </form>
      </template>`,
      errors: [
        {
          message: 'All `<button>` elements should have a valid `type` attribute',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <button type="invalid">Click</button>
      </template>`,
      output: `<template>
        <button type="button">Click</button>
      </template>`,
      errors: [
        {
          message: 'All `<button>` elements should have a valid `type` attribute',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <form>
          <button type="invalid">Submit</button>
        </form>
      </template>`,
      output: `<template>
        <form>
          <button type="submit">Submit</button>
        </form>
      </template>`,
      errors: [
        {
          message: 'All `<button>` elements should have a valid `type` attribute',
          type: 'GlimmerAttrNode',
        },
      ],
    },

    {
      code: '<template><button/></template>',
      output: '<template><button type="button" /></template>',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '<template><button></button></template>',
      output: '<template><button type="button"></button></template>',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '<template><button>label</button></template>',
      output: '<template><button type="button">label</button></template>',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '<template><button type="" /></template>',
      output: '<template><button type="button" /></template>',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '<template><button type="foo" /></template>',
      output: '<template><button type="button" /></template>',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '<template><button type=42 /></template>',
      output: '<template><button type="button" /></template>',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '<template><form><button></button></form></template>',
      output: '<template><form><button type="submit"></button></form></template>',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '/** silly example <button> usage */ <template><button></button></template>',
      output:
        '/** silly example <button> usage */ <template><button type="button"></button></template>',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-require-button-type (hbs)', rule, {
  valid: [
    '<button type="button" />',
    '<button type="button">label</button>',
    '<button type="submit" />',
    '<button type="reset" />',
    '<button type="{{buttonType}}" />',
    '<button type={{buttonType}} />',
    '<div/>',
    '<div></div>',
    '<div type="randomType"></div>',
  ],
  invalid: [
    {
      code: '<button/>',
      output: '<button type="button" />',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '<button>label</button>',
      output: '<button type="button">label</button>',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '<button type="" />',
      output: '<button type="button" />',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '<button type="foo" />',
      output: '<button type="button" />',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '<button type=42 />',
      output: '<button type="button" />',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
    {
      code: '<form><button></button></form>',
      output: '<form><button type="submit"></button></form>',
      errors: [{ message: 'All `<button>` elements should have a valid `type` attribute' }],
    },
  ],
});
