//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-invalid-role');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-role', rule, {
  valid: [
    `<template>
      <div role="button">Click</div>
    </template>`,
    `<template>
      <div role="navigation">Nav</div>
    </template>`,
    `<template>
      <div role="main">Content</div>
    </template>`,
    `<template>
      <div role="presentation">Hidden</div>
    </template>`,
    `<template>
      <div role="none">Hidden</div>
    </template>`,
    `<template>
      <div>No role</div>
    </template>`,
    `<template>
      <div role={{this.dynamicRole}}>Dynamic</div>
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template><div></div></template>',
    '<template><div role="none"></div></template>',
    '<template><div role="presentation"></div></template>',
    '<template><img alt="" role="none"></template>',
    '<template><img role="none"></template>',
    '<template><img alt="" role="presentation"></template>',
    '<template><img role="presentation"></template>',
    '<template><span role="none"></span></template>',
    '<template><span role="presentation"></span></template>',
    '<template><svg role="none"></svg></template>',
    '<template><svg role="presentation"></svg></template>',
    '<template><li role="none"></li></template>',
    '<template><li role="presentation"></li></template>',
    '<template><custom-component role="none"></custom-component></template>',
    '<template><AwesomeThing role="none"></AwesomeThing></template>',
    '<template><AwesomeThing role="presentation"></AwesomeThing></template>',
    '<template><table role="textbox"></table></template>',
    '<template><div role="{{if this.inModal "dialog" "contentinfo" }}"></div></template>',
  ],

  invalid: [
    {
      code: `<template>
        <div role="invalid">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: "Invalid ARIA role 'invalid'. Must be a valid ARIA role.",
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div role="btn">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: "Invalid ARIA role 'btn'. Must be a valid ARIA role.",
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div role="fake-role">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: "Invalid ARIA role 'fake-role'. Must be a valid ARIA role.",
          type: 'GlimmerAttrNode',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><ul role="presentation"></ul></template>',
      output: null,
      errors: [{ message: 'The role "presentation" should not be used on the semantic element <ul>.' }],
    },
    {
      code: '<template><ol role="presentation"></ol></template>',
      output: null,
      errors: [{ message: 'The role "presentation" should not be used on the semantic element <ol>.' }],
    },
    {
      code: '<template><table role="presentation"></table></template>',
      output: null,
      errors: [{ message: 'The role "presentation" should not be used on the semantic element <table>.' }],
    },
    {
      code: '<template><table role="none"></table></template>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <table>.' }],
    },
    {
      code: '<template><button role="presentation"></button></template>',
      output: null,
      errors: [{ message: 'The role "presentation" should not be used on the semantic element <button>.' }],
    },
    {
      code: '<template><button role="none"></button></template>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <button>.' }],
    },
    {
      code: '<template><label role="presentation"></label></template>',
      output: null,
      errors: [{ message: 'The role "presentation" should not be used on the semantic element <label>.' }],
    },
    {
      code: '<template><label role="none"></label></template>',
      output: null,
      errors: [{ message: 'The role "none" should not be used on the semantic element <label>.' }],
    },
    {
      code: '<template><div role="command interface"></div></template>',
      output: null,
      errors: [{ message: "Invalid ARIA role 'command interface'. Must be a valid ARIA role." }],
    },
    {
      code: '<template><div role="COMMAND INTERFACE"></div></template>',
      output: null,
      errors: [{ message: "Invalid ARIA role 'COMMAND INTERFACE'. Must be a valid ARIA role." }],
    },
  ],
});
