//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-computed-macros');
const RuleTester = require('eslint').RuleTester;

const {
  ERROR_MESSAGE_READS,
  ERROR_MESSAGE_AND,
  ERROR_MESSAGE_OR,
  ERROR_MESSAGE_GT,
  ERROR_MESSAGE_GTE,
  ERROR_MESSAGE_LT,
  ERROR_MESSAGE_LTE,
  ERROR_MESSAGE_NOT,
  ERROR_MESSAGE_EQUAL,
} = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run('require-computed-macros', rule, {
  valid: [
    'computed()',
    'computed(true)',
    'computed(function() {})',
    'computed(function() { someCall(); return this.x; })', // Multiple statements in function body.
    'computed(function() { return this.x; }, SOME_OTHER_ARG)', // Function isn't last arg.
    'other(function() { return this.x; })',

    // READS
    "reads('x')",
    'computed(function() { return this; })',
    'computed(function() { return SOME_VAR; })',
    'computed(function() { return this.prop[123]; })',
    'computed(function() { return this.someFunction(); })',
    'computed(function() { return this.prop.someFunction(); })',

    // AND
    "and('x', 'y')",
    'computed(function() { return SOME_VAR && OTHER_VAR; })',
    'computed(function() { return this.x && this.y || this.z; })', // Mixed operators.

    // OR
    "or('x', 'y')",
    'computed(function() { return SOME_VAR || OTHER_VAR; })',

    // GT
    "gt('x', 123)",
    'computed(function() { return SOME_VAR > OTHER_VAR; })',

    // GTE
    "gte('x', 123)",
    'computed(function() { return SOME_VAR >= OTHER_VAR; })',

    // LT
    "lt('x', 123)",
    'computed(function() { return SOME_VAR < OTHER_VAR; })',

    // LTE
    "lte('x', 123)",
    'computed(function() { return SOME_VAR <= OTHER_VAR; })',

    // NOT
    "not('x')",
    'computed(function() { return !SOME_VAR; })',

    // EQUAL
    "equal('x', 123)",
    'computed(function() { return SOME_VAR === 123; })',
    'computed(function() { return SOME_VAR === "Hello"; })',
    'computed(function() { return this.prop === MY_VAR; })',
  ],
  invalid: [
    // READS
    {
      code: 'computed(function() { return this.x; })',
      output: "computed.reads('x')",
      errors: [{ message: ERROR_MESSAGE_READS, type: 'CallExpression' }],
    },
    {
      code: 'computed(function() { return this.x.y; })', // Nested path.
      output: "computed.reads('x.y')",
      errors: [{ message: ERROR_MESSAGE_READS, type: 'CallExpression' }],
    },

    // AND
    {
      code: 'computed(function() { return this.x && this.y; })',
      output: "computed.and('x', 'y')",
      errors: [{ message: ERROR_MESSAGE_AND, type: 'CallExpression' }],
    },
    {
      code: 'computed(function() { return this.x && this.y && this.z; })', // Three parts.
      output: "computed.and('x', 'y', 'z')",
      errors: [{ message: ERROR_MESSAGE_AND, type: 'CallExpression' }],
    },
    {
      code: 'computed(function() { return this.x && this.y.z && this.w; })', // Three parts with a nested path.
      output: "computed.and('x', 'y.z', 'w')",
      errors: [{ message: ERROR_MESSAGE_AND, type: 'CallExpression' }],
    },

    // OR
    {
      code: 'computed(function() { return this.x || this.y; })',
      output: "computed.or('x', 'y')",
      errors: [{ message: ERROR_MESSAGE_OR, type: 'CallExpression' }],
    },

    // GT
    {
      code: 'computed(function() { return this.x > 123; })',
      output: "computed.gt('x', 123)",
      errors: [{ message: ERROR_MESSAGE_GT, type: 'CallExpression' }],
    },

    // GTE
    {
      code: 'computed(function() { return this.x >= 123; })',
      output: "computed.gte('x', 123)",
      errors: [{ message: ERROR_MESSAGE_GTE, type: 'CallExpression' }],
    },

    // LT
    {
      code: 'computed(function() { return this.x < 123; })',
      output: "computed.lt('x', 123)",
      errors: [{ message: ERROR_MESSAGE_LT, type: 'CallExpression' }],
    },

    // LTE
    {
      code: 'computed(function() { return this.x <= 123; })',
      output: "computed.lte('x', 123)",
      errors: [{ message: ERROR_MESSAGE_LTE, type: 'CallExpression' }],
    },

    // NOT
    {
      code: 'computed(function() { return !this.x; })',
      output: "computed.not('x')",
      errors: [{ message: ERROR_MESSAGE_NOT, type: 'CallExpression' }],
    },

    // EQUAL
    {
      code: 'computed(function() { return this.x === 123; })',
      output: "computed.equal('x', 123)",
      errors: [{ message: ERROR_MESSAGE_EQUAL, type: 'CallExpression' }],
    },
  ],
});
