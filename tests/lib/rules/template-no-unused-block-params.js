const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-unused-block-params');

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unused-block-params', rule, {
  valid: [
    // All params used
    '<template>{{#each items as |item|}}{{item.name}}{{/each}}</template>',
    '<template>{{#each items as |item index|}}{{index}}: {{item}}{{/each}}</template>',

    // No block params
    '<template>{{#each items}}{{this}}{{/each}}</template>',

    // Param used in nested path
    '<template>{{#let user as |u|}}{{u.name}}{{/let}}</template>',
  
    // Test cases ported from ember-template-lint
    '<template>{{cat}}</template>',
    '<template>{{#each cats as |cat|}}{{cat}}{{/each}}</template>',
    '<template>{{#each cats as |cat|}}{{partial "cat"}}{{/each}}</template>',
    '<template>{{#each cats as |cat|}}{{cat.name}}{{/each}}</template>',
    '<template>{{#each cats as |cat|}}{{meow cat}}{{/each}}</template>',
    '<template>{{#each cats as |cat index|}}{{index}}{{/each}}</template>',
    '<template>{{#each cats as |cat index|}}{{#each cat.lives as |life|}}{{index}}: {{life}}{{/each}}{{/each}}</template>',
    '<template>{{#each cats as |cat|}}{{#meow-meow cat as |cat|}}{{cat}}{{/meow-meow}}{{/each}}</template>',
    '<template>{{#with (component "foo-bar") as |FooBar|}}<FooBar />{{/with}}</template>',
    '<template><BurgerMenu as |menu|><header>Something</header><menu.item>Text</menu.item></BurgerMenu></template>',
    '<template>{{#burger-menu as |menu|}}<header>Something</header>{{#menu.item}}Text{{/menu.item}}{{/burger-menu}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#each items as |item|}}Hello{{/each}}</template>',
      output: null,
      errors: [{ messageId: 'unusedBlockParam', data: { param: 'item' } }],
    },
    {
      code: '<template>{{#each items as |item index|}}{{item}}{{/each}}</template>',
      output: null,
      errors: [{ messageId: 'unusedBlockParam', data: { param: 'index' } }],
    },
    {
      code: '<template>{{#let value as |v|}}Something{{/let}}</template>',
      output: null,
      errors: [{ messageId: 'unusedBlockParam', data: { param: 'v' } }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{#each cats as |cat|}}Dogs{{/each}}</template>',
      output: null,
      errors: [{ messageId: 'unusedBlockParam' }],
    },
    {
      code: '<template>{{#each cats as |cat index|}}{{cat}}{{/each}}</template>',
      output: null,
      errors: [{ messageId: 'unusedBlockParam' }],
    },
    {
      code: '<template>{{#each cats as |cat index|}}{{/each}}</template>',
      output: null,
      errors: [{ messageId: 'unusedBlockParam' }],
    },
  ],
});
