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

    {
      code: '<template><form method=""></form></template>',
      output: null,
      errors: [
        {
          message:
            'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`',
        },
      ],
    },
    {
      code: '<template><form method=42></form></template>',
      output: null,
      errors: [
        {
          message:
            'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`',
        },
      ],
    },
    {
      code: '<template><form method=" ge t "></form></template>',
      output: null,
      errors: [
        {
          message:
            'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`',
        },
      ],
    },
    {
      code: '<template><form method=" pos t "></form></template>',
      output: null,
      errors: [
        {
          message:
            'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`',
        },
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

hbsRuleTester.run('template-require-form-method', rule, {
  valid: [
    '<form method="POST"></form>',
    '<form method="post"></form>',
    '<form method="GET"></form>',
    '<form method="get"></form>',
    '<form method="DIALOG"></form>',
    '<form method="dialog"></form>',
    '<form method="{{formMethod}}"></form>',
    '<form method={{formMethod}}></form>',
    '<div/>',
    '<div></div>',
    '<div method="randomType"></div>',
  ],
  invalid: [
    {
      code: '<form></form>',
      output: null,
      errors: [
        {
          message:
            'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`',
        },
      ],
    },
    {
      code: '<form method=""></form>',
      output: null,
      errors: [
        {
          message:
            'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`',
        },
      ],
    },
    {
      code: '<form method=42></form>',
      output: null,
      errors: [
        {
          message:
            'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`',
        },
      ],
    },
    {
      code: '<form method=" ge t "></form>',
      output: null,
      errors: [
        {
          message:
            'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`',
        },
      ],
    },
    {
      code: '<form method=" pos t "></form>',
      output: null,
      errors: [
        {
          message:
            'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`',
        },
      ],
    },
  ],
});
