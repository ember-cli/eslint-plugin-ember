//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-let-reference');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('../../../lib/parsers/gjs-gts-parser.js'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-let-reference', rule, {
  valid: [
    `
      const a = '';
      function create(d) {
      <template>
        <Abc as |x a|>
          {{x}}
          {{a}}
        </Abc>
      {{a}}
      {{d}}
      {{this.f}}
      </template>
      }
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
      errors: [{ type: 'VarHead', message: rule.meta.messages['no-let'] }],
    },
    {
      code: `
      var a = '';
      <template>
      <a></a>
      </template>
      `,
      output: null,
      errors: [{ type: 'GlimmerElementNodePart', message: rule.meta.messages['no-let'] }],
    },
  ],
});
