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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-unused-block-params', rule, {
  valid: [
    '{{cat}}',
    '{{#each cats as |cat|}}{{cat}}{{/each}}',
    '{{#each cats as |cat|}}{{partial "cat"}}{{/each}}',
    '{{#each cats as |cat|}}{{cat.name}}{{/each}}',
    '{{#each cats as |cat|}}{{meow cat}}{{/each}}',
    '{{#each cats as |cat index|}}{{index}}{{/each}}',
    '{{#each cats as |cat index|}}{{#each cat.lives as |life|}}{{index}}: {{life}}{{/each}}{{/each}}',
    `
    <MyComponent @model={{this.model}} as |param|>
      {{! template-lint-disable }}
        <MyOtherComponent .... @param={{param}} />
      {{! template-lint-enable }}
    </MyComponent>
    `,
    `
    <MyComponent @model={{this.model}} as |param|>
      {{! template-lint-disable }}
        {{foo-bar param}}
      {{! template-lint-enable }}
    </MyComponent>
    `,
    `
    <MyComponent @model={{this.model}} as |param|>
      {{! template-lint-disable }}
        {{param}}
      {{! template-lint-enable }}
    </MyComponent>
    `,
    `
    <MyComponent @model={{this.model}} as |param|>
      {{! template-lint-disable }}
        {{foo-bar prop=param}}
      {{! template-lint-enable }}
    </MyComponent>
    `,
    `
    {{#my-component as |param|}}
      {{! template-lint-disable }}
        <MyOtherComponent .... @param={{param}} />
      {{! template-lint-enable }}
    {{/my-component}}
    `,
    `
    {{#my-component as |param|}}
      {{! template-lint-disable }}
        {{foo-bar param}}
      {{! template-lint-enable }}
    {{/my-component}}
    `,
    `
    {{#my-component as |param|}}
      {{! template-lint-disable }}
        {{param}}
      {{! template-lint-enable }}
    {{/my-component}}
    `,
    `
    {{#my-component as |param bar baz|}}
      {{! template-lint-disable }}
        {{foo-bar prop=param}}
      {{! template-lint-enable }}
      {{bar}}
      {{! template-lint-disable }}
        {{foo-bar prop=baz}}
      {{! template-lint-enable }}
    {{/my-component}}
    `,
    '{{#each cats as |cat|}}{{#meow-meow cat as |cat|}}{{cat}}{{/meow-meow}}{{/each}}',
    '{{#with (component "foo-bar") as |FooBar|}}<FooBar />{{/with}}',
    '<BurgerMenu as |menu|><header>Something</header><menu.item>Text</menu.item></BurgerMenu>',
    '{{#burger-menu as |menu|}}<header>Something</header>{{#menu.item}}Text{{/menu.item}}{{/burger-menu}}',
  ],
  invalid: [
    {
      code: '{{#each cats as |cat|}}Dogs{{/each}}',
      output: null,
      errors: [{ message: 'Block param "cat" is unused' }],
    },
    {
      code: '{{#each cats as |cat index|}}{{cat}}{{/each}}',
      output: null,
      errors: [{ message: 'Block param "index" is unused' }],
    },
    {
      // Outer `index` is shadowed by inner `index`, so outer `index` is unused
      code: '{{#each cats as |cat index|}}{{#each cat.lives as |life index|}}{{index}}: {{life}}{{/each}}{{/each}}',
      output: null,
      errors: [{ message: 'Block param "index" is unused' }],
    },
    {
      // `partial` marks outer params as used, but inner `life` is unused
      code: '{{#each cats as |cat index|}}{{partial "cat"}}{{#each cat.lives as |life|}}Life{{/each}}{{/each}}',
      output: null,
      errors: [{ message: 'Block param "life" is unused' }],
    },
  ],
});
