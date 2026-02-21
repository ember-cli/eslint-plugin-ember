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
  
    // Test cases ported from ember-template-lint
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
  
    // Test cases ported from ember-template-lint
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
