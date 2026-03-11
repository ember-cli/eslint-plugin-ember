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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-invalid-interactive', rule, {
  valid: [
    '<button {{action "foo"}}></button>',
    '<canvas {{on "mousedown"}}></canvas>',
    '<div role="button" {{action "foo"}}></div>',
    '<div randomProperty={{myValue}}></div>',
    '<li><button {{action "foo"}}></button></li>',
    '<form {{action "foo" on="submit"}}></form>',
    '<form onsubmit={{action "foo"}}></form>',
    '<form onchange={{action "foo"}}></form>',
    '<form {{action "foo" on="reset"}}></form>',
    '<form {{action "foo" on="change"}}></form>',
    '<form onreset={{action "foo"}}></form>',
    '<img onerror={{action "foo"}}>',
    '<img onload={{action "foo"}}>',
    '<InputSearch @onInput={{action "foo"}} />',
    '<InputSearch @onInput={{action "foo"}}></InputSearch>',
    '{{#with (hash bar=(component "foo")) as |foo|}}<foo.bar @onInput={{action "foo"}}></foo.bar>{{/with}}',
    '<form {{on "submit" this.send}}></form>',
    '<form {{on "reset" this.reset}}></form>',
    '<form {{on "change" this.change}}></form>',
    '<div {{on "scroll" this.handleScroll}}></div>',
    '<code {{on "copy" (action @onCopy)}}></code>',
    '<img {{on "load" this.onLoad}} {{on "error" this.onError}}>',
    '<select {{on "change" this.handleChange}}></select>',
    '<details {{on "toggle" this.handleToggle}}></details>',
    '<video {{on "pause" this.onPause}}></video>',
    '<img {{action "foo" on="load"}}>',
    '<img {{action "foo" on="error"}}>',
    // additionalInteractiveTags config
    {
      code: '<div {{on "click" this.onClick}}></div>',
      options: [{ additionalInteractiveTags: ['div'] }],
    },
    {
      code: '<div {{action "foo"}}></div>',
      options: [{ additionalInteractiveTags: ['div'] }],
    },
    {
      code: '<div onclick={{action "foo"}}></div>',
      options: [{ additionalInteractiveTags: ['div'] }],
    },
    {
      code: '<img onerror={{action "foo"}}>',
      options: [{ additionalInteractiveTags: ['img'] }],
    },
    // ignoredTags config
    {
      code: '<div {{on "click" this.actionName}}>...</div>',
      options: [{ ignoredTags: ['div'] }],
    },
    {
      code: '<div onclick={{action "foo"}}></div>',
      options: [{ ignoredTags: ['div'] }],
    },
  ],
  invalid: [
    {
      code: '<div {{action "foo"}}></div>',
      output: null,
      errors: [
        {
          message:
            'Non-interactive element <div> should not have interactive handler "{{action}}".',
        },
      ],
    },
    {
      code: '<div onclick={{action "foo"}}></div>',
      output: null,
      errors: [
        {
          message: 'Non-interactive element <div> should not have interactive handler "onclick".',
        },
      ],
    },
    {
      code: '<div onclick={{pipe-action "foo"}}></div>',
      output: null,
      errors: [
        { message: 'Non-interactive element <div> should not have interactive handler "onclick".' },
      ],
    },
    {
      code: '<div onsubmit={{action "foo"}}></div>',
      output: null,
      errors: [
        {
          message: 'Non-interactive element <div> should not have interactive handler "onsubmit".',
        },
      ],
    },
    {
      code: '<div randomAttribute={{action "foo"}}></div>',
      output: null,
      errors: [
        {
          message:
            'Non-interactive element <div> should not have interactive handler "randomattribute".',
        },
      ],
    },
    {
      code: '<form {{action "foo" on="click"}}></form>',
      output: null,
      errors: [
        {
          message:
            'Non-interactive element <form> should not have interactive handler "{{action}}".',
        },
      ],
    },
    {
      code: '<div {{action "foo" on="submit"}}></div>',
      output: null,
      errors: [
        {
          message:
            'Non-interactive element <div> should not have interactive handler "{{action}}".',
        },
      ],
    },
  ],
});
