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
  
    // Test cases ported from ember-template-lint
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
  
    // Test cases ported from ember-template-lint
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
      errors: [{ messageId: 'unknownArgument' }],
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
      errors: [{ messageId: 'unknownArgument' }],
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
