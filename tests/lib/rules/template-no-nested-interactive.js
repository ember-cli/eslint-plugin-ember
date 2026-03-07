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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-nested-interactive', rule, {
  valid: [
    '<button>button</button>',
    '<button>button <strong>!!!</strong></button>',
    '<a><button>button</button></a>',
    '<a href="/">link</a>',
    '<a href="/">link <strong>!!!</strong></a>',
    '<button><input type="hidden"></button>',
    '<div tabindex=-1><button>Click me!</button></div>',
    '<div tabindex="1"><button></button></div>',
    '<label><input></label>',
    '<details><summary>Details</summary>Something small enough to escape casual notice.</details>',
    '<details> <summary>Details</summary>Something small enough to escape casual notice.</details>',
    `
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
    `,
    `
  <label> My input:
    {{#if @select}}
      <select></select>
    {{else}}
      <input type='text'>
    {{/if}}
  </label>
    `,
    `
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
    `,
    // Config: ignoredTags
    {
      code: '<button><input></button>',
      options: [{ ignoredTags: ['button'] }],
    },
    // Config: ignoreTabindex
    {
      code: '<button><div tabindex=-1></div></button>',
      options: [{ ignoreTabindex: true }],
    },
  ],
  invalid: [
    {
      code: '<details>Something small enough to escape casual notice.<summary>Details</summary></details>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <summary> inside <details>.' }],
    },
    {
      code: '<summary><a href="/">button</a></summary>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <a> inside <summary>.' }],
    },
    {
      code: '<a href="/">button<a href="/">!</a></a>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <a> inside <a>.' }],
    },
    {
      code: '<a href="/">button<button>!</button></a>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <button> inside <a>.' }],
    },
    {
      code: '<button>button<a href="/">!</a></button>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <a> inside <button>.' }],
    },
    {
      code: '<button>button<button>!</button></button>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <button> inside <button>.' }],
    },
    {
      code: '<button><input type="text"></button>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <input> inside <button>.' }],
    },
    {
      code: '<button><details><p>!</p></details></button>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <details> inside <button>.' }],
    },
    {
      code: '<button><embed type="video/quicktime" src="movie.mov" width="640" height="480"></button>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <embed> inside <button>.' }],
    },
    {
      code: '<button><iframe src="/frame.html" width="640" height="480"></iframe></button>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <iframe> inside <button>.' }],
    },
    {
      code: '<button><select></select></button>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <select> inside <button>.' }],
    },
    {
      code: '<button><textarea></textarea></button>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <textarea> inside <button>.' }],
    },
    {
      code: '<button><div tabindex="1"></div></button>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <div> inside <button>.' }],
    },
    {
      code: '<object usemap=""><button></button></object>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <button> inside <object>.' }],
    },
    {
      code: '<label><input><input></label>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <input> inside <label>.' }],
    },
    // Config: additionalInteractiveTags
    {
      code: '<button><my-special-input></my-special-input></button>',
      output: null,
      options: [{ additionalInteractiveTags: ['my-special-input'] }],
      errors: [{ message: 'Do not nest interactive element <my-special-input> inside <button>.' }],
    },
    // Label with multiple interactive children including tabindex
    {
      code: [
        '<label for="foo">',
        '  <div id="foo" tabindex=-1></div>',
        '  <input>',
        '</label>',
      ].join('\n'),
      output: null,
      errors: [{ message: 'Do not nest interactive element <input> inside <label>.' }],
    },
  ],
});
