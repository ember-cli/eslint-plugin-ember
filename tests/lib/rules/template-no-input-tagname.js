const rule = require('../../../lib/rules/template-no-input-tagname');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-input-tagname', rule, {
  valid: [
    '<template>{{input value=this.foo}}</template>',
    '<template>{{input type="text"}}</template>',
    '<template>{{component "input" type="text"}}</template>',
    '<template>{{yield (component "input" type="text")}}</template>',
    // Rule is disabled in GJS/GTS: `input` is a user-imported binding, not the classic helper
    { filename: 'test.gjs', code: '<template>{{input tagName="span"}}</template>' },
    { filename: 'test.gts', code: '<template>{{input tagName="foo"}}</template>' },
    // GJS/GTS angle-bracket: without an import from @ember/component, <Input> is a user binding
    { filename: 'test.gjs', code: '<template><Input @tagName="button" /></template>' },
    {
      filename: 'test.gjs',
      code: 'const Input = <template>hi</template>;\n<template><Input @tagName="button" /></template>',
    },
  ],
  invalid: [
    {
      filename: 'test.gjs',
      code: 'import { Input } from \'@ember/component\';\n<template><Input @tagName="button" /></template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.gts',
      code: 'import { Input as Field } from \'@ember/component\';\n<template><Field @tagName="span" /></template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{input tagName="span"}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },

    {
      code: '<template>{{input tagName="foo"}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{input tagName=bar}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{component "input" tagName="foo"}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{component "input" tagName=bar}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{yield (component "input" tagName="foo")}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{yield (component "input" tagName=bar)}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
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

hbsRuleTester.run('template-no-input-tagname', rule, {
  valid: [
    '{{input value=foo}}',
    '{{input type="text"}}',
    '{{component "input" type="text"}}',
    '{{yield (component "input" type="text")}}',
    '<Input />',
    '<Input @value={{this.foo}} />',
  ],
  invalid: [
    {
      code: '<Input @tagName="button" />',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '{{input tagName="span"}}',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '{{input tagName="foo"}}',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '{{input tagName=bar}}',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '{{component "input" tagName="foo"}}',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '{{component "input" tagName=bar}}',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '{{yield (component "input" tagName="foo")}}',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '{{yield (component "input" tagName=bar)}}',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
  ],
});
