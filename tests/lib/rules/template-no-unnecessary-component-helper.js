const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-unnecessary-component-helper');

const { RuleTester } = eslint;

const validHbs = [
  '{{component SOME_COMPONENT_NAME}}',
  '{{component SOME_COMPONENT_NAME SOME_ARG}}',
  '{{component SOME_COMPONENT_NAME "Hello World"}}',
  '{{my-component}}',
  '{{my-component "Hello world"}}',
  '{{my-component "Hello world" 123}}',
  '{{#component SOME_COMPONENT_NAME}}{{/component}}',
  '{{#component SOME_COMPONENT_NAME SOME_ARG}}{{/component}}',
  '{{#component SOME_COMPONENT_NAME "Hello World"}}{{/component}}',
  '{{#my-component}}{{/my-component}}',
  '{{#my-component "Hello world"}}{{/my-component}}',
  '{{#my-component "Hello world" 123}}{{/my-component}}',
  '(component SOME_COMPONENT_NAME)',
  '(component "my-component")',
  '<Foo @bar={{component SOME_COMPONENT_NAME}} />',
  '<Foo @bar={{component "my-component"}} />',
  '<Foo @bar={{component SOME_COMPONENT_NAME}}></Foo>',
  '<Foo @bar={{component "my-component"}}></Foo>',
  '<Foo @arg="foo" />',
  '<Foo class="foo" />',
  '<Foo data-test-bar="foo" />',
  '<Foo @arg={{if this.user.isAdmin "admin"}} />',
  '<Foo @arg={{if this.user.isAdmin (component "my-component")}} />',
  "{{component 'addon-name@component-name'}}",
  "{{#component 'addon-name@component-name'}}{{/component}}",
];

const invalidHbs = [
  {
    code: '{{component "my-component-name" foo=123 bar=456}}',
    output: '{{my-component-name foo=123 bar=456}}',
    errors: [{ message: 'Invoke component directly instead of using `component` helper' }],
  },
  {
    code: '{{#component "my-component-name" foo=123 bar=456}}{{/component}}',
    output: '{{#my-component-name foo=123 bar=456}}{{/my-component-name}}',
    errors: [{ message: 'Invoke component directly instead of using `component` helper' }],
  },
  {
    code: '<Foo @arg={{component "allowed-component"}}>{{component "forbidden-component"}}</Foo>',
    output: '<Foo @arg={{component "allowed-component"}}>{{forbidden-component}}</Foo>',
    errors: [{ message: 'Invoke component directly instead of using `component` helper' }],
  },
];

const validGjs = [
  '<template>{{component SOME_COMPONENT_NAME}}</template>',
  '<template>{{component SOME_COMPONENT_NAME SOME_ARG}}</template>',
  '<template>{{component SOME_COMPONENT_NAME "Hello World"}}</template>',
  '<template>{{my-component}}</template>',
  '<template>{{my-component "Hello world"}}</template>',
  '<template>{{my-component "Hello world" 123}}</template>',
  '<template>{{#component SOME_COMPONENT_NAME}}{{/component}}</template>',
  '<template>{{#component SOME_COMPONENT_NAME SOME_ARG}}{{/component}}</template>',
  '<template>{{#component SOME_COMPONENT_NAME "Hello World"}}{{/component}}</template>',
  '<template>{{#my-component}}{{/my-component}}</template>',
  '<template>{{#my-component "Hello world"}}{{/my-component}}</template>',
  '<template>{{#my-component "Hello world" 123}}{{/my-component}}</template>',
  '<template><Foo @bar={{component SOME_COMPONENT_NAME}} /></template>',
  '<template><Foo @bar={{component "my-component"}} /></template>',
  '<template><Foo @bar={{component SOME_COMPONENT_NAME}}></Foo></template>',
  '<template><Foo @bar={{component "my-component"}}></Foo></template>',
  '<template><Foo @arg="foo" /></template>',
  '<template><Foo class="foo" /></template>',
  '<template><Foo data-test-bar="foo" /></template>',
  '<template><Foo @arg={{if this.user.isAdmin "admin"}} /></template>',
  '<template><Foo @arg={{if this.user.isAdmin (component "my-component")}} /></template>',
  "<template>{{component 'addon-name@component-name'}}</template>",
  "<template>{{#component 'addon-name@component-name'}}{{/component}}</template>",
];

function wrapTemplate(entry) {
  return {
    ...entry,
    code: `<template>${entry.code}</template>`,
    output: entry.output ? `<template>${entry.output}</template>` : entry.output,
    errors: entry.errors.map(() => ({ messageId: 'noUnnecessaryComponent' })),
  };
}

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-no-unnecessary-component-helper', rule, {
  valid: validGjs,
  invalid: invalidHbs.map(wrapTemplate),
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-unnecessary-component-helper', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
