const rule = require('../../../lib/rules/template-no-redundant-role');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-redundant-role', rule, {
  valid: [
    '<template><a role="link" aria-disabled="true">valid</a></template>',
    '<template><form role="search"></form></template>',
    '<template><footer role={{this.foo}}></footer></template>',
    '<template><footer role="{{this.stuff}}{{this.foo}}"></footer></template>',
    '<template><nav role="navigation"></nav></template>',
    '<template><ol role="list"></ol></template>',
    '<template><ul role="list"></ul></template>',
    {
      code: '<template><body role="document"></body></template>',
      options: [{ checkAllHTMLElements: false }],
    },
    {
      code: '<template><footer role={{this.bar}}></footer></template>',
      options: [{ checkAllHTMLElements: true }],
    },
    {
      code: '<template><nav class="navigation" role="navigation"></nav></template>',
      options: [{ checkAllHTMLElements: true }],
    },
    {
      code: '<template><button role="link"></button></template>',
      options: [{ checkAllHTMLElements: true }],
    },
    {
      code: '<template><input type="checkbox" value="yes" checked /></template>',
      options: [{ checkAllHTMLElements: true }],
    },
    {
      code: '<template><input type="range" /></template>',
      options: [{ checkAllHTMLElements: false }],
    },
    {
      code: '<template><dialog role="dialog" /></template>',
      options: [{ checkAllHTMLElements: false }],
    },
    {
      code: '<template><ul class="list" role="combobox"></ul></template>',
      options: [{ checkAllHTMLElements: false }],
    },
    '<template><input role="combobox"></template>',
    // <select multiple> has implicit role listbox, so combobox is not redundant.
    '<template><select role="combobox" multiple></select></template>',
    // <select size="5"> (size > 1) has implicit role listbox.
    '<template><select role="combobox" size="5"></select></template>',
    // Default <select> (no `multiple`, `size` absent or <= 1) has implicit
    // role "combobox" — an explicit `role="listbox"` overrides to listbox
    // and is NOT redundant.
    '<template><select role="listbox"></select></template>',
    '<template><select role="listbox" size="1"></select></template>',
    // Dynamic `multiple={{...}}` — can't determine implicit role statically,
    // so neither `role="combobox"` nor `role="listbox"` is flagged.
    '<template><select role="combobox" multiple={{this.isMulti}}></select></template>',
    '<template><select role="listbox" multiple={{this.isMulti}}></select></template>',

    // Role-fallback: first recognised token wins. `role="tab button"` on
    // <button> resolves to `tab` (non-redundant — button's implicit is
    // `button`, not `tab`). WAI-ARIA §4.1 fallback-list semantics.
    '<template><button role="tab button"></button></template>',
  ],
  invalid: [
    {
      code: '<template><dialog role="dialog" /></template>',
      output: '<template><dialog /></template>',
      errors: [
        {
          message: 'Use of redundant or invalid role: dialog on <dialog> detected.',
        },
      ],
    },
    {
      code: '<template><header role="banner"></header></template>',
      output: '<template><header></header></template>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: banner on <header> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    // Non-landmark same-role redundancy — covered by jsx-a11y / vue-a11y too.
    {
      code: '<template><button role="button"></button></template>',
      output: '<template><button></button></template>',
      errors: [{ message: 'Use of redundant or invalid role: button on <button> detected.' }],
    },
    {
      code: '<template><img role="img" /></template>',
      output: '<template><img /></template>',
      errors: [{ message: 'Use of redundant or invalid role: img on <img> detected.' }],
    },
    {
      // Valueless `<select size>` — per HTML boolean-attr semantics, the
      // attribute value is an empty string; Number('') is 0; 0 is NOT > 1,
      // so the implicit role stays combobox. `role="combobox"` is therefore
      // redundant and must be flagged.
      code: '<template><select role="combobox" size></select></template>',
      output: '<template><select size></select></template>',
      errors: [
        {
          message: 'Use of redundant or invalid role: combobox on <select> detected.',
        },
      ],
    },
    {
      // Role-fallback: unknown leading token is skipped per ARIA §4.1.
      // `role="xxyxyz button"` resolves to `button`, which IS redundant on
      // <button>. Autofix drops the whole role attribute — the implicit
      // `button` role is preserved natively, so runtime semantics are
      // unchanged. Authors who wanted the `xxyxyz` fallback for some
      // reason can opt out via eslint-disable.
      code: '<template><button role="xxyxyz button"></button></template>',
      output: '<template><button></button></template>',
      errors: [
        {
          message: 'Use of redundant or invalid role: button on <button> detected.',
        },
      ],
    },
    {
      code: '<template><main role="main"></main></template>',
      output: '<template><main></main></template>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: main on <main> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<template><aside role="complementary"></aside></template>',
      output: '<template><aside></aside></template>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: complementary on <aside> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<template><footer role="contentinfo"></footer></template>',
      output: '<template><footer></footer></template>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: contentinfo on <footer> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<template><form role="form"></form></template>',
      output: '<template><form></form></template>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: form on <form> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },

    {
      code: '<template><header role="banner" class="page-header"></header></template>',
      output: '<template><header class="page-header"></header></template>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: banner on <header> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
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

hbsRuleTester.run('template-no-redundant-role', rule, {
  valid: [
    '<a role="link" aria-disabled="true">valid</a>',
    '<form role="search"></form>',
    '<footer role={{this.foo}}></footer>',
    '<footer role="{{this.stuff}}{{this.foo}}"></footer>',
    '<nav role="navigation"></nav>',
    '<ol role="list"></ol>',
    '<ul role="list"></ul>',
    '<input role="combobox">',
    '<footer role={{this.bar}}></footer>',
    '<nav class="navigation" role="navigation"></nav>',
    '<button role="link"></button>',
    '<input type="checkbox" value="yes" checked />',
    '<input type="range" />',
    {
      code: '<body role="document"></body>',
      options: [{ checkAllHTMLElements: false }],
    },
    {
      code: '<dialog role="dialog" />',
      options: [{ checkAllHTMLElements: false }],
    },
    '<ul class="list" role="combobox"></ul>',
    // <select> with `multiple` has implicit role "listbox", so role="combobox"
    // is not redundant (it disagrees with the implicit role, but that is for
    // other rules to catch — this rule only flags redundancy).
    '<select role="combobox" multiple></select>',
    // <select size="5"> (size > 1) has implicit role "listbox", same reasoning.
    '<select role="combobox" size="5"></select>',
    // Default <select> (no `multiple`, `size` absent or <= 1) has implicit
    // role "combobox" — explicit role="listbox" overrides to listbox and is
    // NOT redundant.
    '<select role="listbox"></select>',
    '<select role="listbox" size="1"></select>',
  ],
  invalid: [
    {
      code: '<header role="banner"></header>',
      output: '<header></header>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: banner on <header> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<footer role="contentinfo"></footer>',
      output: '<footer></footer>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: contentinfo on <footer> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<main role="main"></main>',
      output: '<main></main>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: main on <main> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<aside role="complementary"></aside>',
      output: '<aside></aside>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: complementary on <aside> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<form role="form"></form>',
      output: '<form></form>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: form on <form> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<header role="banner" class="page-header"></header>',
      output: '<header class="page-header"></header>',
      errors: [
        {
          message:
            'Use of redundant or invalid role: banner on <header> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<dialog role="dialog" />',
      output: '<dialog />',
      errors: [{ message: 'Use of redundant or invalid role: dialog on <dialog> detected.' }],
    },
    {
      code: '<button role="button"></button>',
      output: '<button></button>',
      errors: [{ message: 'Use of redundant or invalid role: button on <button> detected.' }],
    },
    {
      code: '<input type="checkbox" name="agree" value="checkbox1" role="checkbox" />',
      output: '<input type="checkbox" name="agree" value="checkbox1" />',
      errors: [{ message: 'Use of redundant or invalid role: checkbox on <input> detected.' }],
    },
    {
      code: '<table><th role="columnheader">Some heading</th><td>cell1</td></table>',
      output: '<table><th>Some heading</th><td>cell1</td></table>',
      errors: [{ message: 'Use of redundant or invalid role: columnheader on <th> detected.' }],
    },
    {
      code: '<select name="color" id="color" role="listbox" multiple><option value="default-color">black</option></select>',
      output:
        '<select name="color" id="color" multiple><option value="default-color">black</option></select>',
      errors: [{ message: 'Use of redundant or invalid role: listbox on <select> detected.' }],
    },
    {
      // <select> without `multiple` or `size` defaults to role "combobox".
      code: '<select role="combobox"></select>',
      output: '<select></select>',
      errors: [{ message: 'Use of redundant or invalid role: combobox on <select> detected.' }],
    },
    {
      // size="1" still defaults to combobox (only size > 1 flips to listbox).
      code: '<select role="combobox" size="1"></select>',
      output: '<select size="1"></select>',
      errors: [{ message: 'Use of redundant or invalid role: combobox on <select> detected.' }],
    },
    {
      // Case-insensitive match on <select>, combined with the implicit-role check.
      code: '<select role="COMBOBOX"></select>',
      output: '<select></select>',
      errors: [{ message: 'Use of redundant or invalid role: combobox on <select> detected.' }],
    },
    {
      // Case-insensitive matching — ARIA role tokens compare as ASCII-case-insensitive.
      code: '<body role="DOCUMENT"></body>',
      output: '<body></body>',
      errors: [{ message: 'Use of redundant or invalid role: document on <body> detected.' }],
    },
    {
      code: '<main role="main"></main>',
      output: '<main></main>',
      options: [{ checkAllHTMLElements: false }],
      errors: [
        {
          message:
            'Use of redundant or invalid role: main on <main> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
    {
      code: '<aside role="complementary"></aside>',
      output: '<aside></aside>',
      options: [{ checkAllHTMLElements: false }],
      errors: [
        {
          message:
            'Use of redundant or invalid role: complementary on <aside> detected. If a landmark element is used, any role provided will either be redundant or incorrect.',
        },
      ],
    },
  ],
});
