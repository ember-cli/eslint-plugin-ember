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
    '<nav class="navigation" role="navigation></nav>',
    '<button role="link"></button>',
    '<input type="checkbox" value="yes" checked />',
    '<input type="range" />',
    '<ul class="list" role="combobox"></ul>',
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
  ],
});
