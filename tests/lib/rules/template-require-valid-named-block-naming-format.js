const rule = require('../../../lib/rules/template-require-valid-named-block-naming-format');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-valid-named-block-naming-format', rule, {
  valid: [
    '<template>{{yield}}</template>',
    '<template>{{yield to="fooBar"}}</template>',
    '<template>{{has-block}}</template>',
    '<template>{{has-block "fooBar"}}</template>',
    {
      code: '<template>{{yield to="foo-bar"}}</template>',
      output: null,
      options: ['kebab-case'],
    },
    {
      code: '<template>{{has-block "foo-bar"}}</template>',
      output: null,
      options: ['kebab-case'],
    },
  
    // Test cases ported from ember-template-lint
    '<template>{{if (has-block)}}</template>',
    '<template>{{if (has-block "fooBar")}}</template>',
    '<template>{{has-block-params}}</template>',
    '<template>{{has-block-params "fooBar"}}</template>',
    '<template>{{if (has-block-params)}}</template>',
    '<template>{{if (has-block-params "fooBar")}}</template>',
    '<template>camelCase</template>',
    '<template>kebab-case</template>',
  ],
  invalid: [
    {
      code: '<template>{{yield to="foo-bar"}}</template>',
      output: null,
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },
    {
      code: '<template>{{has-block "foo-bar"}}</template>',
      output: null,
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },
    {
      code: '<template>{{yield to="fooBar"}}</template>',
      output: null,
      options: ['kebab-case'],
      errors: [
        {
          message: 'Named block should be in kebab-case format. Change "fooBar" to "foo-bar".',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{if (has-block "foo-bar")}}</template>',
      output: null,
      errors: [{ message: 'Named block should be in camelCase format. Change ' }],
    },
    {
      code: '<template>{{has-block-params "foo-bar"}}</template>',
      output: null,
      errors: [{ message: 'Named block should be in camelCase format. Change ' }],
    },
    {
      code: '<template>{{if (has-block-params "foo-bar")}}</template>',
      output: null,
      errors: [{ message: 'Named block should be in camelCase format. Change ' }],
    },
  ],
});
