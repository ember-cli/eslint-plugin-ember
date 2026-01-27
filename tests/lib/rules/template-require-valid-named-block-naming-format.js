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

    {
      code: '<template>{{if (has-block "foo-bar")}}</template>',
      output: null,
      errors: [
        { message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".' },
      ],
    },
    {
      code: '<template>{{has-block-params "foo-bar"}}</template>',
      output: null,
      errors: [
        { message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".' },
      ],
    },
    {
      code: '<template>{{if (has-block-params "foo-bar")}}</template>',
      output: null,
      errors: [
        { message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".' },
      ],
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

hbsRuleTester.run('template-require-valid-named-block-naming-format', rule, {
  valid: [
    // Default config (camelCase).
    '{{yield}}',
    '{{yield to="fooBar"}}',
    '{{has-block}}',
    '{{has-block "fooBar"}}',
    '{{if (has-block)}}',
    '{{if (has-block "fooBar")}}',
    '{{has-block-params}}',
    '{{has-block-params "fooBar"}}',
    '{{if (has-block-params)}}',
    '{{if (has-block-params "fooBar")}}',

    // Explicit config: camelCase.
    {
      code: '{{yield to="fooBar"}}',
      options: ['camelCase'],
    },
    {
      code: '{{has-block "fooBar"}}',
      options: ['camelCase'],
    },
    {
      code: '{{if (has-block "fooBar")}}',
      options: ['camelCase'],
    },
    {
      code: '{{has-block-params "fooBar"}}',
      options: ['camelCase'],
    },
    {
      code: '{{if (has-block-params "fooBar")}}',
      options: ['camelCase'],
    },

    // Explicit config: kebab-case.
    {
      code: '{{yield to="foo-bar"}}',
      options: ['kebab-case'],
    },
    {
      code: '{{has-block "foo-bar"}}',
      options: ['kebab-case'],
    },
    {
      code: '{{if (has-block "foo-bar")}}',
      options: ['kebab-case'],
    },
    {
      code: '{{has-block-params "foo-bar"}}',
      options: ['kebab-case'],
    },
    {
      code: '{{if (has-block-params "foo-bar")}}',
      options: ['kebab-case'],
    },
  ],
  invalid: [
    // Default config (camelCase).
    {
      code: '{{yield to="foo-bar"}}',
      output: null,
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },
    {
      code: '{{has-block "foo-bar"}}',
      output: null,
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },
    {
      code: '{{if (has-block "foo-bar")}}',
      output: null,
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },
    {
      code: '{{has-block-params "foo-bar"}}',
      output: null,
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },
    {
      code: '{{if (has-block-params "foo-bar")}}',
      output: null,
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },

    // Explicit config: camelCase.
    {
      code: '{{yield to="foo-bar"}}',
      output: null,
      options: ['camelCase'],
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },
    {
      code: '{{has-block "foo-bar"}}',
      output: null,
      options: ['camelCase'],
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },
    {
      code: '{{if (has-block "foo-bar")}}',
      output: null,
      options: ['camelCase'],
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },
    {
      code: '{{has-block-params "foo-bar"}}',
      output: null,
      options: ['camelCase'],
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },
    {
      code: '{{if (has-block-params "foo-bar")}}',
      output: null,
      options: ['camelCase'],
      errors: [
        {
          message: 'Named block should be in camelCase format. Change "foo-bar" to "fooBar".',
        },
      ],
    },

    // Explicit config: kebab-case.
    {
      code: '{{yield to="fooBar"}}',
      output: null,
      options: ['kebab-case'],
      errors: [
        {
          message: 'Named block should be in kebab-case format. Change "fooBar" to "foo-bar".',
        },
      ],
    },
    {
      code: '{{has-block "fooBar"}}',
      output: null,
      options: ['kebab-case'],
      errors: [
        {
          message: 'Named block should be in kebab-case format. Change "fooBar" to "foo-bar".',
        },
      ],
    },
    {
      code: '{{if (has-block "fooBar")}}',
      output: null,
      options: ['kebab-case'],
      errors: [
        {
          message: 'Named block should be in kebab-case format. Change "fooBar" to "foo-bar".',
        },
      ],
    },
    {
      code: '{{has-block-params "fooBar"}}',
      output: null,
      options: ['kebab-case'],
      errors: [
        {
          message: 'Named block should be in kebab-case format. Change "fooBar" to "foo-bar".',
        },
      ],
    },
    {
      code: '{{if (has-block-params "fooBar")}}',
      output: null,
      options: ['kebab-case'],
      errors: [
        {
          message: 'Named block should be in kebab-case format. Change "fooBar" to "foo-bar".',
        },
      ],
    },
  ],
});
