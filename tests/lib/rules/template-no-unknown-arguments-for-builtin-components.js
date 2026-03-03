const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/template-no-unknown-arguments-for-builtin-components');

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unknown-arguments-for-builtin-components', rule, {
  valid: [
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Input @type="text" @value={{this.value}} />
          </template>
        }
      `,
      output: null,
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Textarea @value={{this.text}} />
          </template>
        }
      `,
    },

    '<template><Input @value="foo" /></template>',
    '<template><Textarea @value="hello" /></template>',
    '<template><LinkTo @route="info" @model={{this.model}} /></template>',
    '<template><LinkTo @route="info" /></template>',
    '<template><LinkTo @query={{hash foo=bar}} /></template>',
    '<template><LinkTo @model={{this.model}} /></template>',
    '<template><LinkTo @models={{array comment.photo comment}} /></template>',
  ],

  invalid: [
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Input @unknownArg="value" />
          </template>
        }
      `,
      output: null,
      errors: [
        {
          messageId: 'unknownArgument',
        },
      ],
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <Textarea @invalidProp={{this.value}} />
          </template>
        }
      `,
      output: null,
      errors: [
        {
          messageId: 'unknownArgument',
        },
      ],
    },

    {
      code: '<template><Input @valuee={{this.content}} /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template><Textarea @valuee={{this.content}} /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template><LinkTo @route="foo" @valuee={{this.content}} /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template><LinkTo @route="foo" @madel={{this.content}} /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template><LinkTo @route="info" @model={{this.model}} @models={{this.models}} /></template>',
      output: null,
      errors: [{ messageId: 'conflictArgument' }, { messageId: 'conflictArgument' }],
    },
    {
      code: '<template><LinkTo @route="info" @model={{this.model}} @tagName="button" /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template><LinkTo @route="info" @model={{this.model}} @elementId="superstar" /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template><LinkTo @route="info" @model={{this.model}} @doubleClick={{action this.click}} /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template><Input @value="1" @bubbles={{false}} /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template><Input @value="1" @elementId="42" @disabled="disabled" /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }, { messageId: 'unknownArgument' }],
    },
    {
      code: '<template><Input @value="1" @key-up={{ths.onKeyUp}} /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template><Textarea @value="1" @bubbles={{false}} /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template><Textarea @value="1" @elementId="42" /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template><Textarea @value="1" @key-up={{ths.onKeyUp}} /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      code: '<template> <LinkTo class="auk-search-results-list__item" @route={{@route}} @models={{this.models}} @random="test" @query={{@query}} ...attributes >Hello</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
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

hbsRuleTester.run('template-no-unknown-arguments-for-builtin-components', rule, {
  valid: [
    '<Input @value="foo" />',
    '<Textarea @value="hello" />',
    '<LinkTo @route="info" @model={{this.model}} />',
    '<LinkTo @route="info" />',
    '<LinkTo @query={{hash foo=bar}} />',
    '<LinkTo @model={{this.model}} />',
    '<LinkTo @models={{array comment.photo comment}} />',
  ],
  invalid: [
    {
      code: '<Input @valuee={{this.content}} />',
      output: null,
      errors: [
        {
          message:
            '"@valuee" is not a known argument for the <Input /> component. Did you mean "@value"?',
        },
      ],
    },
    {
      code: '<Textarea @valuee={{this.content}} />',
      output: null,
      errors: [
        {
          message:
            '"@valuee" is not a known argument for the <Textarea /> component. Did you mean "@value"?',
        },
      ],
    },
    {
      code: '<LinkTo @route="foo" @valuee={{this.content}} />',
      output: null,
      errors: [{ message: '"@valuee" is not a known argument for the <LinkTo /> component.' }],
    },
    {
      code: '<LinkTo @route="foo" @madel={{this.content}} />',
      output: null,
      errors: [{ message: '"@madel" is not a known argument for the <LinkTo /> component.' }],
    },
    {
      code: '<LinkTo @route="info" @model={{this.model}} @models={{this.models}} />',
      output: null,
      errors: [
        { message: '"@model" conflicts with "@models", only one should exist.' },
        { message: '"@models" conflicts with "@model", only one should exist.' },
      ],
    },
    {
      code: '<LinkTo @route="info" @model={{this.model}} @tagName="button" />',
      output: null,
      errors: [{ message: 'Passing the "@tagName" argument to <LinkTo /> is deprecated.' }],
    },
    {
      code: '<LinkTo @route="info" @model={{this.model}} @elementId="superstar" />',
      output: null,
      errors: [
        {
          message: `Passing the "@elementId" argument to <LinkTo /> is deprecated.
Instead, please pass the attribute directly, i.e. "<LinkTo id={{...}} />" instead of "<LinkTo @elementId={{...}} />".`,
        },
      ],
    },
    {
      code: '<LinkTo @route="info" @model={{this.model}} @doubleClick={{action this.click}} />',
      output: null,
      errors: [
        {
          message: `Passing the "@doubleClick" argument to <LinkTo /> is deprecated.
Instead, please use the {{on}} modifier, i.e. "<LinkTo {{on "dblclick" ...}} />" instead of "<LinkTo @doubleClick={{...}} />".`,
        },
      ],
    },
    {
      code: '<Input @value="1" @bubbles={{false}} />',
      output: null,
      errors: [{ message: 'Passing the "@bubbles" argument to <Input /> is deprecated.' }],
    },
    {
      code: '<Input @value="1" @elementId="42" @disabled="disabled" />',
      output: null,
      errors: [
        {
          message: `Passing the "@elementId" argument to <Input /> is deprecated.
Instead, please pass the attribute directly, i.e. "<Input id={{...}} />" instead of "<Input @elementId={{...}} />".`,
        },
        {
          message: `Passing the "@disabled" argument to <Input /> is deprecated.
Instead, please pass the attribute directly, i.e. "<Input disabled={{...}} />" instead of "<Input @disabled={{...}} />".`,
        },
      ],
    },
    {
      code: '<Input @value="1" @key-up={{ths.onKeyUp}} />',
      output: null,
      errors: [
        {
          message: `Passing the "@key-up" argument to <Input /> is deprecated.
Instead, please use the {{on}} modifier, i.e. "<Input {{on "keyup" ...}} />" instead of "<Input @key-up={{...}} />".`,
        },
      ],
    },
    {
      code: '<Textarea @value="1" @bubbles={{false}} />',
      output: null,
      errors: [{ message: 'Passing the "@bubbles" argument to <Textarea /> is deprecated.' }],
    },
    {
      code: '<Textarea @value="1" @elementId="42" />',
      output: null,
      errors: [
        {
          message: `Passing the "@elementId" argument to <Textarea /> is deprecated.
Instead, please pass the attribute directly, i.e. "<Textarea id={{...}} />" instead of "<Textarea @elementId={{...}} />".`,
        },
      ],
    },
    {
      code: '<Textarea @value="1" @key-up={{ths.onKeyUp}} />',
      output: null,
      errors: [
        {
          message: `Passing the "@key-up" argument to <Textarea /> is deprecated.
Instead, please use the {{on}} modifier, i.e. "<Textarea {{on "keyup" ...}} />" instead of "<Textarea @key-up={{...}} />".`,
        },
      ],
    },
    {
      code: ' <LinkTo class="auk-search-results-list__item" @route={{@route}} @models={{this.models}} @random="test" @query={{@query}} ...attributes >Hello</LinkTo>',
      output: null,
      errors: [
        {
          message:
            '"@random" is not a known argument for the <LinkTo /> component. Did you mean "@dragEnd"?',
        },
      ],
    },
  ],
});
