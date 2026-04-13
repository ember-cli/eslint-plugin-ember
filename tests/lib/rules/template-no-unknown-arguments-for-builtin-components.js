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

    // Custom component imported with the same name as a built-in — should NOT be flagged
    {
      filename: 'my-component.gjs',
      code: `
        import Input from './my-custom-input';
        <template><Input @unknownArg="x" /></template>
      `,
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Textarea from './my-custom-textarea';
        <template><Textarea @customProp={{this.val}} /></template>
      `,
    },
    {
      filename: 'my-component.gjs',
      code: `
        import LinkTo from './my-custom-link';
        <template><LinkTo @anythingGoes="yes" /></template>
      `,
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Input from './my-custom-input';
        export default class MyComponent {
          <template><Input @customArg="value" @anotherArg={{this.foo}} /></template>
        }
      `,
    },
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
      // Deprecated argument without a replacement attribute — autofixed by removal.
      code: '<template><LinkTo @route="info" @model={{this.model}} @tagName="button" /></template>',
      output: '<template><LinkTo @route="info" @model={{this.model}} /></template>',
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      // Deprecated argument with replacement — autofixed by renaming to the HTML attribute.
      code: '<template><LinkTo @route="info" @model={{this.model}} @elementId="superstar" /></template>',
      output: '<template><LinkTo @route="info" @model={{this.model}} id="superstar" /></template>',
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      // Deprecated event with a helper invocation value — migrated to an `{{on}}` modifier with the helper as a sub-expression.
      code: '<template><LinkTo @route="info" @model={{this.model}} @doubleClick={{action this.click}} /></template>',
      output:
        '<template><LinkTo @route="info" @model={{this.model}} {{on "dblclick" (action this.click)}} /></template>',
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      // Deprecated argument without a replacement attribute — autofixed by removal.
      code: '<template><Input @value="1" @bubbles={{false}} /></template>',
      output: '<template><Input @value="1" /></template>',
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      // Two deprecated arguments on Input — both renamed to HTML attributes.
      code: '<template><Input @value="1" @elementId="42" @disabled="disabled" /></template>',
      output: '<template><Input @value="1" id="42" disabled="disabled" /></template>',
      errors: [{ messageId: 'unknownArgument' }, { messageId: 'unknownArgument' }],
    },
    {
      // Deprecated event with a simple path value — migrated to an `{{on}}` modifier.
      code: '<template><Input @value="1" @key-up={{ths.onKeyUp}} /></template>',
      output: '<template><Input @value="1" {{on "keyup" ths.onKeyUp}} /></template>',
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      // Deprecated argument without a replacement attribute — autofixed by removal.
      code: '<template><Textarea @value="1" @bubbles={{false}} /></template>',
      output: '<template><Textarea @value="1" /></template>',
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      // Deprecated argument with replacement — autofixed by renaming to the HTML attribute.
      code: '<template><Textarea @value="1" @elementId="42" /></template>',
      output: '<template><Textarea @value="1" id="42" /></template>',
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      // Deprecated event with a simple path value — migrated to an `{{on}}` modifier.
      code: '<template><Textarea @value="1" @key-up={{ths.onKeyUp}} /></template>',
      output: '<template><Textarea @value="1" {{on "keyup" ths.onKeyUp}} /></template>',
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      // Truly unknown/typo argument — not autofixed.
      code: '<template> <LinkTo class="auk-search-results-list__item" @route={{@route}} @models={{this.models}} @random="test" @query={{@query}} ...attributes >Hello</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },
    {
      // Deprecated event with a string-literal value — cannot migrate to `{{on}}`, so no autofix.
      code: '<template><Input @value="1" @click="noop" /></template>',
      output: null,
      errors: [{ messageId: 'unknownArgument' }],
    },

    // Missing required arguments
    {
      code: '<template><LinkTo /></template>',
      output: null,
      errors: [{ messageId: 'requiredArgument' }],
    },
    {
      code: '<template><LinkTo @disabled={{true}} /></template>',
      output: null,
      errors: [{ messageId: 'requiredArgument' }],
    },
    {
      filename: 'my-component.gjs',
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          <template>
            <LinkTo @replace={{true}}>Home</LinkTo>
          </template>
        }
      `,
      output: null,
      errors: [{ messageId: 'requiredArgument' }],
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
      output: '<LinkTo @route="info" @model={{this.model}} />',
      errors: [{ message: 'Passing the "@tagName" argument to <LinkTo /> is deprecated.' }],
    },
    {
      code: '<LinkTo @route="info" @model={{this.model}} @elementId="superstar" />',
      output: '<LinkTo @route="info" @model={{this.model}} id="superstar" />',
      errors: [
        {
          message: `Passing the "@elementId" argument to <LinkTo /> is deprecated.
Instead, please pass the attribute directly, i.e. "<LinkTo id={{...}} />" instead of "<LinkTo @elementId={{...}} />".`,
        },
      ],
    },
    {
      code: '<LinkTo @route="info" @model={{this.model}} @doubleClick={{action this.click}} />',
      output:
        '<LinkTo @route="info" @model={{this.model}} {{on "dblclick" (action this.click)}} />',
      errors: [
        {
          message: `Passing the "@doubleClick" argument to <LinkTo /> is deprecated.
Instead, please use the {{on}} modifier, i.e. "<LinkTo {{on "dblclick" ...}} />" instead of "<LinkTo @doubleClick={{...}} />".`,
        },
      ],
    },
    {
      code: '<Input @value="1" @bubbles={{false}} />',
      output: '<Input @value="1" />',
      errors: [{ message: 'Passing the "@bubbles" argument to <Input /> is deprecated.' }],
    },
    {
      code: '<Input @value="1" @elementId="42" @disabled="disabled" />',
      output: '<Input @value="1" id="42" disabled="disabled" />',
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
      output: '<Input @value="1" {{on "keyup" ths.onKeyUp}} />',
      errors: [
        {
          message: `Passing the "@key-up" argument to <Input /> is deprecated.
Instead, please use the {{on}} modifier, i.e. "<Input {{on "keyup" ...}} />" instead of "<Input @key-up={{...}} />".`,
        },
      ],
    },
    {
      code: '<Textarea @value="1" @bubbles={{false}} />',
      output: '<Textarea @value="1" />',
      errors: [{ message: 'Passing the "@bubbles" argument to <Textarea /> is deprecated.' }],
    },
    {
      code: '<Textarea @value="1" @elementId="42" />',
      output: '<Textarea @value="1" id="42" />',
      errors: [
        {
          message: `Passing the "@elementId" argument to <Textarea /> is deprecated.
Instead, please pass the attribute directly, i.e. "<Textarea id={{...}} />" instead of "<Textarea @elementId={{...}} />".`,
        },
      ],
    },
    {
      code: '<Textarea @value="1" @key-up={{ths.onKeyUp}} />',
      output: '<Textarea @value="1" {{on "keyup" ths.onKeyUp}} />',
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

    // Missing required arguments
    {
      code: '<LinkTo />',
      output: null,
      errors: [
        {
          message:
            'Arguments "@route" or "@query" or "@model" or "@models" is required for <LinkTo /> component.',
        },
      ],
    },
    {
      code: '<LinkTo @disabled={{true}} />',
      output: null,
      errors: [
        {
          message:
            'Arguments "@route" or "@query" or "@model" or "@models" is required for <LinkTo /> component.',
        },
      ],
    },
    {
      code: '<LinkTo @replace={{true}}>Home</LinkTo>',
      output: null,
      errors: [
        {
          message:
            'Arguments "@route" or "@query" or "@model" or "@models" is required for <LinkTo /> component.',
        },
      ],
    },
  ],
});
