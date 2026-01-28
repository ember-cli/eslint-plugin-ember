const eslint = require('eslint');
const rule = require('../../../lib/rules/template-require-input-label');

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-input-label', rule, {
  valid: [
    // Input with id (can be associated with label)
    '<template><input id="name" type="text" /></template>',

    // Input with aria-label
    '<template><input aria-label="Name" type="text" /></template>',

    // Input with aria-labelledby
    '<template><input aria-labelledby="label-id" type="text" /></template>',

    // Hidden input doesn't need label
    '<template><input type="hidden" /></template>',

    // Textarea with id
    '<template><textarea id="comment"></textarea></template>',

    // Select with id
    '<template><select id="country"><option>US</option></select></template>',
  ],
  invalid: [
    {
      code: '<template><input type="text" /></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><textarea></textarea></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
    {
      code: '<template><select><option>Value</option></select></template>',
      output: null,
      errors: [{ messageId: 'requireLabel' }],
    },
  ],
});
