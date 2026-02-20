//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-table-groups');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-table-groups', rule, {
  valid: [
    `<template>
      <table>
        <thead>
          <tr><th>Header</th></tr>
        </thead>
        <tbody>
          <tr><td>Data</td></tr>
        </tbody>
      </table>
    </template>`,
    `<template>
      <table>
        <tbody>
          <tr><td>Data</td></tr>
        </tbody>
      </table>
    </template>`,
    `<template>
      <table>
        <caption>My Table</caption>
      </table>
    </template>`,
    `<template>
      <div>Not a table</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <table>
          <tr><td>Data</td></tr>
        </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },
    {
      code: `<template>
        <table>
          <tr><th>Header</th></tr>
          <tr><td>Data</td></tr>
        </table>
      </template>`,
      output: null,
      errors: [{ messageId: 'missing' }],
    },
  ],
});
