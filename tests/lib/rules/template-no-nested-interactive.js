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
    // <audio>/<video> without `controls` are NOT interactive (no rendered UI, no focus).
    '<template><button><audio></audio></button></template>',
    '<template><button><video></video></button></template>',
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
    // Bare-mustache falsy literals on tabindex omit the attribute at runtime
    // (doc rows t6, t7) — the wrapping element is NOT interactive, so nesting
    // a button inside is valid. AST-presence-only check would have flagged.
    '<template><button><div tabindex={{false}}></div></button></template>',
    '<template><button><div tabindex={{null}}></div></button></template>',
    '<template><button><div tabindex={{undefined}}></div></button></template>',
    // Dynamic tabindex — runtime value is unknown; conservative skip.
    '<template><button><div tabindex={{this.idx}}></div></button></template>',
    '<template><label><input></label></template>',
    // Config: ignoreUsemapAttribute (alias for ignoreUsemap)
    {
      code: '<template><button><img usemap=""></button></template>',
      options: [{ ignoreUsemapAttribute: true }],
    },
    '<template><details><summary>Details</summary>Something small enough to escape casual notice.</details></template>',
    '<template><details> <summary>Details</summary>Something small enough to escape casual notice.</details></template>',
    '<template><details><summary>Advanced</summary><label for="x">Field</label><input id="x" /></details></template>',
    '<template><details><summary>More</summary><div><button type="button">Action</button></div></details></template>',
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

    // Mixed menu-item variants — `menuitemcheckbox` and `menuitemradio`
    // nested alongside plain `menuitem` follow the same APG Menu Button
    // pattern. Should not flag as nested-interactive.
    `<template>
    <ul role="menu" aria-label="options">
      <li role="menuitemcheckbox" aria-checked="false">Show hidden</li>
      <li role="menuitemradio" aria-checked="true">Sort by name</li>
      <li role="menuitemradio" aria-checked="false">Sort by date</li>
    </ul>
    </template>`,
    // Submenu attached to a menuitemcheckbox (APG permits this).
    `<template>
    <ul role="menu">
      <li role="menuitemcheckbox" aria-haspopup="true" aria-checked="false">
        Advanced
        <ul role="menu">
          <li role="menuitem">Inspect</li>
          <li role="menuitem">Export</li>
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
    // Label-association: HTML's "first labelable descendant" rule means a
    // second interactive child is orphaned from the label. Flag per upstream
    // ember-template-lint parity.
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
      code: '<template><label><input><input></label></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    // <object usemap> is interactive via rule-level special case (upstream parity).
    {
      code: '<template><object usemap=""><button></button></object></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    // <audio controls> / <video controls> are HTML interactive content; nesting inside <button> fires.
    {
      code: '<template><button><video controls></video></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    {
      code: '<template><button><audio controls></audio></button></template>',
      output: null,
      errors: [{ messageId: 'nested' }],
    },
    // <canvas> is interactive (drawing/game-UI convention); nesting fires even with tabindex.
    {
      code: '<template><canvas tabindex="0"><button>Click</button></canvas></template>',
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
    // Bare-mustache falsy literals omit the attribute at runtime (t6, t7).
    '<button><div tabindex={{false}}></div></button>',
    '<button><div tabindex={{null}}></div></button>',
    '<button><div tabindex={{this.idx}}></div></button>',
    '<label><input></label>',
    '<details><summary>Details</summary>Something small enough to escape casual notice.</details>',
    '<details> <summary>Details</summary>Something small enough to escape casual notice.</details>',
    '<details><summary>Advanced</summary><label for="x">Field</label><input id="x" /></details>',
    '<details><summary>More</summary><div><button type="button">Action</button></div></details>',
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
    // Config: ignoreUsemap
    {
      code: '<button><img usemap=""></button>',
      options: [{ ignoreUsemap: true }],
    },
    // Config: ignoreUsemapAttribute (alias for ignoreUsemap)
    {
      code: '<button><img usemap=""></button>',
      options: [{ ignoreUsemapAttribute: true }],
    },
    // <audio>/<video> without `controls` are NOT interactive.
    '<button><audio></audio></button>',
    '<button><video></video></button>',
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
      code: '<button><img usemap=""></button>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <img> inside <button>.' }],
    },
    // <object usemap> is interactive via rule-level special case (upstream parity).
    {
      code: '<object usemap=""><button></button></object>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <button> inside <object>.' }],
    },
    // Label-association: HTML's "first labelable descendant" rule means a
    // second interactive child is orphaned from the label.
    {
      code: '<label><button>Click</button><a href="#">Link</a></label>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <a> inside <label>.' }],
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
    // <video controls> is HTML interactive content; nesting inside <button> fires.
    {
      code: '<button><video controls></video></button>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <video> inside <button>.' }],
    },
    // <canvas> is interactive (drawing/game-UI convention); nesting fires even with tabindex.
    {
      code: '<canvas tabindex="0"><button>Click</button></canvas>',
      output: null,
      errors: [{ message: 'Do not nest interactive element <button> inside <canvas>.' }],
    },
  ],
});
