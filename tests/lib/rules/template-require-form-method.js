const rule = require('../../../lib/rules/template-require-form-method');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-form-method', rule, {
  valid: [
    '<template><form method="POST"></form></template>',
    '<template><form method="post"></form></template>',
    '<template><form method="GET"></form></template>',
    '<template><form method="get"></form></template>',
    '<template><form method="DIALOG"></form></template>',
    '<template><form method="dialog"></form></template>',
    '<template><form method="{{formMethod}}"></form></template>',
    '<template><form method={{formMethod}}></form></template>',
    '<template><div method="randomType"></div></template>',
    {
      code: '<template><form method="GET"></form></template>',
      output: null,
      options: [{ allowedMethods: ['get'] }],
    },
  
    // Test cases ported from ember-template-lint
    '<template><div/></template>',
    '<template><div></div></template>',
  ],
  invalid: [
    {
      code: '<template><form></form></template>',
      output: null,
      errors: [
        {
          message:
            'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`',
        },
      ],
    },
    {
      code: '<template><form method="POST"></form></template>',
      output: null,
      options: [{ allowedMethods: ['GET'] }],
      errors: [
        {
          message: 'All `<form>` elements should have `method` attribute with value of `GET`',
        },
      ],
    },
    {
      code: '<template><form method="GET"></form></template>',
      output: null,
      options: [{ allowedMethods: ['POST'] }],
      errors: [
        {
          message: 'All `<form>` elements should have `method` attribute with value of `POST`',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><form method=""></form></template>',
      output: null,
      errors: [{ message: 'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`' }],
    },
    {
      code: '<template><form method=42></form></template>',
      output: null,
      errors: [{ message: 'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`' }],
    },
    {
      code: '<template><form method=" ge t "></form></template>',
      output: null,
      errors: [{ message: 'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`' }],
    },
    {
      code: '<template><form method=" pos t "></form></template>',
      output: null,
      errors: [{ message: 'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`' }],
    },
  ],
});
