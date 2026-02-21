//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-nested-interactive');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-nested-interactive', rule, {
  valid: [
    `<template>
      <button>Click me</button>
    </template>`,
    `<template>
      <a href="#test">Link</a>
    </template>`,
    `<template>
      <div>
        <button>Button 1</button>
        <button>Button 2</button>
      </div>
    </template>`,
    `<template>
      <div>
        <input type="text" />
      </div>
    </template>`,
    `<template>
      <label>
        <input type="hidden" />
        Text
      </label>
    </template>`,
    `<template>
      <div role="presentation">
        <button>Click</button>
      </div>
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template><button>button</button></template>',
    '<template><button>button <strong>!!!</strong></button></template>',
    '<template><a><button>button</button></a></template>',
    '<template><a href="/">link</a></template>',
    '<template><a href="/">link <strong>!!!</strong></a></template>',
    '<template><button><input type="hidden"></button></template>',
    '<template><div tabindex=-1><button>Click me!</button></div></template>',
    '<template><div tabindex="1"><button></button></div></template>',
    '<template><label><input></label></template>',
    '<template><details><summary>Details</summary>Something small enough to escape casual notice.</details></template>',
    '<template><details> <summary>Details</summary>Something small enough to escape casual notice.</details></template>',
    `<template>
    <ul role="menubar" aria-label="functions" id="appmenu">
      <li role="menuitem" aria-haspopup="true">
        File
        <ul role="menu">
          <li role="menuitem">New</li>
          <li role="menuitem">Open</li>
          <li role="menuitem">Print</li>
        </ul>
      </li>
    </ul>
    </template>`,
    `<template>
  <label> My input:
    {{#if @select}}
      <select></select>
    {{else}}
      <input type='text'>
    {{/if}}
  </label>
    </template>`,
    `<template>
  <label> My input:
    {{#if @select}}
      {{#if @multiple}}
        <select multiple></select>
      {{else}}
        <select></select>
      {{/if}}
    {{else}}
      <input type='text'>
    {{/if}}
  </label>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <button>
          <a href="#">Link</a>
        </button>
      </template>`,
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: `<template>
        <a href="#">
          <button>Click</button>
        </a>
      </template>`,
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: `<template>
        <button>
          <input type="text" />
        </button>
      </template>`,
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: `<template>
        <label>
          <button>Click</button>
          <a href="#">Link</a>
        </label>
      </template>`,
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: `<template>
        <div role="button">
          <a href="#">Link</a>
        </div>
      </template>`,
      output: null,
      errors: [{ messageId: 'nested' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><details>Something small enough to escape casual notice.<summary>Details</summary></details></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><summary><a href="/">button</a></summary></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><a href="/">button<a href="/">!</a></a></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><a href="/">button<button>!</button></a></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><button>button<a href="/">!</a></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><button>button<button>!</button></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><button><input type="text"></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><button><details><p>!</p></details></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><button><embed type="video/quicktime" src="movie.mov" width="640" height="480"></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><button><iframe src="/frame.html" width="640" height="480"></iframe></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><button><select></select></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><button><textarea></textarea></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><button><div tabindex="1"></div></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><button><img usemap=""></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><object usemap=""><button></button></object></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><label><input><input></label></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
  ],
});
