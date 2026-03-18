//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-require-each-key');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-each-key', rule, {
  valid: [
    '<template>{{#each items key="id" as |item|}}{{item.name}}{{/each}}</template>',
    '<template>{{#each items key="@index" as |item|}}{{item.name}}{{/each}}</template>',
    '<template><div>No each block</div></template>',

    '<template>{{#each this.items key="id" as |item|}} {{item.name}} {{/each}}</template>',
    '<template>{{#each this.items key="deeply.nested.id" as |item|}} {{item.name}} {{/each}}</template>',
    '<template>{{#each this.items key="@index" as |item|}} {{item.name}} {{/each}}</template>',
    '<template>{{#each this.items key="@identity" as |item|}} {{item.name}} {{/each}}</template>',
    '<template>{{#if foo}}{{/if}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#each items as |item|}}{{item.name}}{{/each}}</template>',
      output: null,
      errors: [{ messageId: 'requireEachKey' }],
    },

    {
      code: '<template>{{#each this.items as |item|}} {{item.name}} {{/each}}</template>',
      output: null,
      errors: [{ messageId: 'requireEachKey' }],
    },
    {
      code: '<template>{{#each this.items key="@invalid" as |item|}} {{item.name}} {{/each}}</template>',
      output: null,
      errors: [{ messageId: 'requireEachKey' }],
    },
    {
      code: '<template>{{#each this.items key="" as |item|}} {{item.name}} {{/each}}</template>',
      output: null,
      errors: [{ messageId: 'requireEachKey' }],
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

hbsRuleTester.run('template-require-each-key', rule, {
  valid: [
    '{{#each this.items key="id" as |item|}} {{item.name}} {{/each}}',
    '{{#each this.items key="deeply.nested.id" as |item|}} {{item.name}} {{/each}}',
    '{{#each this.items key="@index" as |item|}} {{item.name}} {{/each}}',
    '{{#each this.items key="@identity" as |item|}} {{item.name}} {{/each}}',
    '{{#if foo}}{{/if}}',
  ],
  invalid: [
    {
      code: '{{#each this.items as |item|}} {{item.name}} {{/each}}',
      output: null,
      errors: [
        { message: 'each block should have a key attribute for better rendering performance.' },
      ],
    },
    {
      code: '{{#each this.items key="@invalid" as |item|}} {{item.name}} {{/each}}',
      output: null,
      errors: [
        { message: 'each block should have a key attribute for better rendering performance.' },
      ],
    },
    {
      code: '{{#each this.items key="" as |item|}} {{item.name}} {{/each}}',
      output: null,
      errors: [
        { message: 'each block should have a key attribute for better rendering performance.' },
      ],
    },
  ],
});
