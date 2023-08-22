//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-let-reference');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('../../../lib/parsers/gjs-gts-parser.js'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
});
ruleTester.run('template-no-let-reference', rule, {
  valid: [
    `
      const a = '';
      <template>
      {{a}}
      </template>
    `,
    `
      const a = '';
      <template>
      <a></a>
      </template>
    `,
    // make sure rule does not error out on missing references
    `
      const a = '';
      <template>
      {{ab}}
      <ab></ab>
      </template>
    `,
  ],

  invalid: [
    {
      code: `
      let a = '';
      <template>
      {{a}}
      </template>
      `,
      output: null,
      errors: [{ type: 'VarHead', message: ERROR_MESSAGE }],
    },
    {
      code: `
      var a = '';
      <template>
      <a></a>
      </template>
      `,
      output: null,
      errors: [{ type: 'GlimmerElementNode', message: ERROR_MESSAGE }],
    },
  ],
});
