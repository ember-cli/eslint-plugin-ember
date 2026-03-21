const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-unused-block-params');

const { RuleTester } = eslint;

const validHbs = [
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
];

const invalidHbs = [
  {
    code: '{{#each cats as |cat|}}Dogs{{/each}}',
    output: null,
    errors: [{ messageId: 'unusedBlockParam', data: { param: 'cat' } }],
  },
  {
    code: '{{#each cats as |cat index|}}{{cat}}{{/each}}',
    output: null,
    errors: [{ messageId: 'unusedBlockParam', data: { param: 'index' } }],
  },
  {
    code: '{{#each cats as |cat index|}}{{#each cat.lives as |life index|}}{{index}}: {{life}}{{/each}}{{/each}}',
    output: null,
    errors: [{ messageId: 'unusedBlockParam', data: { param: 'index' } }],
  },
  {
    code: '{{#each cats as |cat index|}}{{partial "cat"}}{{#each cat.lives as |life|}}Life{{/each}}{{/each}}',
    output: null,
    errors: [{ messageId: 'unusedBlockParam', data: { param: 'life' } }],
  },
];

function wrapTemplate(entry) {
  if (typeof entry === 'string') {
    return `<template>${entry}</template>`;
  }

  return {
    ...entry,
    code: `<template>${entry.code}</template>`,
    output: entry.output ? `<template>${entry.output}</template>` : entry.output,
  };
}

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-no-unused-block-params', rule, {
  valid: validHbs.map(wrapTemplate),
  invalid: invalidHbs.map(wrapTemplate),
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-unused-block-params', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
