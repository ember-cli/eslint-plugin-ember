const rule = require('../../../lib/rules/template-no-invalid-interactive');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-interactive', rule, {
  valid: [
    {
      code: '<template><button onclick={{this.handleClick}}>Click</button></template>',
      filename: 'test.gjs',
      output: null,
    },
    {
      code: '<template><a onclick={{this.handleClick}}>Link</a></template>',
      filename: 'test.gjs',
      output: null,
    },
    {
      code: '<template><div role="button" onclick={{this.handleClick}}>Interactive</div></template>',
      filename: 'test.gjs',
      output: null,
    },
    {
      code: '<template><div>No handlers</div></template>',
      filename: 'test.gjs',
      output: null,
    },
    {
      code: '<template><input onkeydown={{this.handleKey}} /></template>',
      filename: 'test.gjs',
      output: null,
    },
  ],

  invalid: [
    {
      code: '<template><div onclick={{this.handleClick}}>Click me</div></template>',
      filename: 'test.gjs',
      output: null,
      errors: [
        {
          messageId: 'noInvalidInteractive',
          data: { tagName: 'div', handler: 'onclick' },
        },
      ],
    },
    {
      code: '<template><span onkeydown={{this.handleKey}}>Press key</span></template>',
      filename: 'test.gjs',
      output: null,
      errors: [
        {
          messageId: 'noInvalidInteractive',
          data: { tagName: 'span', handler: 'onkeydown' },
        },
      ],
    },
    {
      code: '<template><p ondblclick={{this.handleDblClick}}>Double click</p></template>',
      filename: 'test.gjs',
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
