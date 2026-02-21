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
  
    // Test cases ported from ember-template-lint
    '<template><button {{action "foo"}}></button></template>',
    '<template><canvas {{on "mousedown"}}></canvas></template>',
    '<template><div role="button" {{action "foo"}}></div></template>',
    '<template><div randomProperty={{myValue}}></div></template>',
    '<template><li><button {{action "foo"}}></button></li></template>',
    '<template><form {{action "foo" on="submit"}}></form></template>',
    '<template><form onsubmit={{action "foo"}}></form></template>',
    '<template><form onchange={{action "foo"}}></form></template>',
    '<template><form {{action "foo" on="reset"}}></form></template>',
    '<template><form {{action "foo" on="change"}}></form></template>',
    '<template><form onreset={{action "foo"}}></form></template>',
    '<template><img onerror={{action "foo"}}></template>',
    '<template><img onload={{action "foo"}}></template>',
    '<template><InputSearch @onInput={{action "foo"}} /></template>',
    '<template><InputSearch @onInput={{action "foo"}}></InputSearch></template>',
    '<template>{{#with (hash bar=(component "foo")) as |foo|}}<foo.bar @onInput={{action "foo"}}></foo.bar>{{/with}}</template>',
    '<template><form {{on "submit" this.send}}></form></template>',
    '<template><form {{on "reset" this.reset}}></form></template>',
    '<template><form {{on "change" this.change}}></form></template>',
    '<template><div {{on "scroll" this.handleScroll}}></div></template>',
    '<template><code {{on "copy" (action @onCopy)}}></code></template>',
    '<template><img {{on "load" this.onLoad}} {{on "error" this.onError}}></template>',
    '<template><select {{on "change" this.handleChange}}></select></template>',
    '<template><details {{on "toggle" this.handleToggle}}></details></template>',
    '<template><video {{on "pause" this.onPause}}></video></template>',
    '<template><img {{action "foo" on="load"}}></template>',
    '<template><img {{action "foo" on="error"}}></template>',
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
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><div {{on "click" this.actionName}}>...</div></template>',
      output: null,
      errors: [{ messageId: 'noInvalidInteractive' }],
    },
    {
      code: '<template><div {{action "foo"}}></div></template>',
      output: null,
      errors: [{ messageId: 'noInvalidInteractive' }],
    },
    {
      code: '<template><div onclick={{action "foo"}}></div></template>',
      output: null,
      errors: [{ messageId: 'noInvalidInteractive' }],
    },
    {
      code: '<template><div onclick={{pipe-action "foo"}}></div></template>',
      output: null,
      errors: [{ messageId: 'noInvalidInteractive' }],
    },
    {
      code: '<template><div onsubmit={{action "foo"}}></div></template>',
      output: null,
      errors: [{ messageId: 'noInvalidInteractive' }],
    },
    {
      code: '<template><div randomAttribute={{action "foo"}}></div></template>',
      output: null,
      errors: [{ messageId: 'noInvalidInteractive' }],
    },
    {
      code: '<template><form {{action "foo" on="click"}}></form></template>',
      output: null,
      errors: [{ messageId: 'noInvalidInteractive' }],
    },
    {
      code: '<template><div {{action "foo" on="submit"}}></div></template>',
      output: null,
      errors: [{ messageId: 'noInvalidInteractive' }],
    },
  ],
});
