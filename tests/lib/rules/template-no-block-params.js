const rule = require('../../../lib/rules/template-no-block-params');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-block-params', rule, {
  valid: [
    // Plain HTML elements without block params
    '<template><div>Content</div></template>',
    '<template><span>Text</span></template>',
    '<template><button>Click</button></template>',

    // Components without block params
    '<template><MyComponent>Content</MyComponent></template>',
    '<template><MyComponent @name="foo" /></template>',

    // Mustache statements without block params
    '<template>{{my-helper arg}}</template>',
    '<template>{{this.value}}</template>',

    // Simple {{yield}} (no block params)
    '<template>{{yield}}</template>',

    // Angle bracket self-closing
    '<template><MyComponent @name="bar" /></template>',
  ],

  invalid: [
    // Component with block params (angle bracket)
    {
      code: '<template><MyComponent as |item|>{{item.name}}</MyComponent></template>',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerElementNode',
        },
      ],
    },

    // Component with multiple block params
    {
      code: '<template><MyComponent as |item index|>{{item}} {{index}}</MyComponent></template>',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerElementNode',
        },
      ],
    },

    // HTML element with block params
    {
      code: '<template><div as |content|>{{content}}</div></template>',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerElementNode',
        },
      ],
    },

    // {{#each}} with block params
    {
      code: '<template>{{#each this.items as |item|}}<li>{{item}}</li>{{/each}}</template>',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerBlockStatement',
        },
      ],
    },

    // {{#each}} with multiple block params
    {
      code: '<template>{{#each this.items as |item index|}}<li>{{index}}: {{item}}</li>{{/each}}</template>',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerBlockStatement',
        },
      ],
    },

    // {{#let}} with block params
    {
      code: '<template>{{#let this.name as |name|}}{{name}}{{/let}}</template>',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerBlockStatement',
        },
      ],
    },

    // Nested block params — two errors
    {
      code: '<template><MyComponent as |items|>{{#each items as |item|}}<li>{{item}}</li>{{/each}}</MyComponent></template>',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerElementNode',
        },
        {
          messageId: 'noBlockParams',
          type: 'GlimmerBlockStatement',
        },
      ],
    },

    // Named blocks with block params
    {
      code: '<template><Something><:Item as |foo|>{{foo}}</:Item></Something></template>',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerElementNode',
        },
      ],
    },

    // Curly component with block params
    {
      code: '<template>{{#my-component as |val|}}{{val}}{{/my-component}}</template>',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerBlockStatement',
        },
      ],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-block-params (hbs)', rule, {
  valid: [
    '<div>Content</div>',
    '<MyComponent>Content</MyComponent>',
    '<MyComponent @name="foo" />',
    '{{my-helper arg}}',
    '{{yield}}',
  ],

  invalid: [
    {
      code: '<MyComponent as |item|>{{item.name}}</MyComponent>',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<div as |content|>{{content}}</div>',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '{{#each this.items as |item|}}<li>{{item}}</li>{{/each}}',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerBlockStatement',
        },
      ],
    },
    {
      code: '{{#let this.name as |name|}}{{name}}{{/let}}',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerBlockStatement',
        },
      ],
    },
    {
      code: '{{#my-component as |val|}}{{val}}{{/my-component}}',
      output: null,
      errors: [
        {
          messageId: 'noBlockParams',
          type: 'GlimmerBlockStatement',
        },
      ],
    },
  ],
});
