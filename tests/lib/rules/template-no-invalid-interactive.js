const rule = require('../../../lib/rules/template-no-invalid-interactive');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-interactive', rule, {
  valid: [
    {
      filename: 'test.gjs',
      code: '<template><button onclick={{this.handleClick}}>Click</button></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><a onclick={{this.handleClick}}>Link</a></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><div role="button" onclick={{this.handleClick}}>Interactive</div></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><div>No handlers</div></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><input onkeydown={{this.handleKey}} /></template>',
      output: null,
    },
  ],

  invalid: [
    {
      filename: 'test.gjs',
      code: '<template><div onclick={{this.handleClick}}>Click me</div></template>',
      output: null,
      errors: [
        {
          messageId: 'noInvalidInteractive',
          data: { tagName: 'div', handler: 'onclick' },
        },
      ],
    },
    {
      filename: 'test.gjs',
      code: '<template><span onkeydown={{this.handleKey}}>Press key</span></template>',
      output: null,
      errors: [
        {
          messageId: 'noInvalidInteractive',
          data: { tagName: 'span', handler: 'onkeydown' },
        },
      ],
    },
    {
      filename: 'test.gjs',
      code: '<template><p ondblclick={{this.handleDblClick}}>Double click</p></template>',
      output: null,
      errors: [
        {
          messageId: 'noInvalidInteractive',
          data: { tagName: 'p', handler: 'ondblclick' },
        },
      ],
    },
  ],
});
