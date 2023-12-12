//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-computed-macros');
const RuleTester = require('eslint').RuleTester;
const { addComputedImport } = require('../../helpers/test-case');

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
  ERROR_MESSAGE_FILTER_BY,
  ERROR_MESSAGE_MAP_BY,
} = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { legacyDecorators: true },
  },
});

ruleTester.run('require-computed-macros', rule, {
  valid: [
    'computed()',
    'computed(true)',
    'computed(function() {})',
    'computed(function() { return; })',
    'computed(function() { someCall(); return this.x; })', // Multiple statements in function body.
    'computed(function() { return this.x; }, SOME_OTHER_ARG)', // Function isn't last arg.
    'computed(function() { notAReturnStatement(); })',
    'other(function() { return this.x; })',

    // READS
    "reads('x')",
    'computed(function() { return this; })',
    'computed(function() { return SOME_VAR; })',
    'computed(function() { return this.get(SOME_VAR); })',
    'computed(function() { return this.prop[123]; })',
    'computed(function() { return this.prop[i]; })',
    'computed(function() { return this.someFunction(); })',
    'computed(function() { return this.prop.someFunction(); })',

    // AND
    "and('x', 'y')",
    'computed(function() { return SOME_VAR && OTHER_VAR; })',
    'computed(function() { return this.x && this.y || this.z; })', // Mixed operators.
    'computed(function() { return 123 && this.x; })', // With a Literal.
    'computed(function() { return this.x && 123; })', // With a Literal.
    'computed(function() { return this.get("x") && this.get("y") || this.get("z"); })', // Mixed operators (and this.get)

    // OR
    "or('x', 'y')",
    'computed(function() { return SOME_VAR || OTHER_VAR; })',

    // GT
    "gt('x', 123)",
    'computed(function() { return SOME_VAR > OTHER_VAR; })',
    'computed(function() { return this.x > this.y; })',

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
    "computed(function() { return this.get('prop') === MY_VAR; })",
    'computed(function() { return this.prop === this.otherProp; })',

    // FILTERBY
    "filterBy('chores', 'done', true)",
    'computed(function() { return this.chores.filterBy(this.otherProp, true); })', // Ignored because value depends on function's `this`.
    "computed(function() { return this.chores.filterBy('done', this.otherProp); })", // Ignored because value depends on function's `this`.

    // MAPBY
    "mapBy('children', 'age')",
    "computed(function() { return this.children?.mapBy('age'); })", // Ignored because function might not exist.
    "computed(function() { return this.nested?.children.mapBy('age'); })", // Ignored because function might not exist.
    'computed(function() { return this.children.mapBy(this.otherProp); })', // Ignored because value depends on function's `this`.
    'computed(function() { return this.children.mapBy(someFunction(this.otherProp)); })', // Ignored because value depends on function's `this`.

    // Decorator (these are ignored when the `includeNativeGetters` option is off):
    "class Test { @computed('x') get someProp() { return this.x; } }",
    'class Test { @computed() get someProp() { return this.x && this.y; } }',
    'class Test { @computed() get someProp() { return this.x > 123; } }',
    "class Test { @computed() get someProp() { return this.children.mapBy('age'); } }",
  ],
  invalid: [
    // READS
    {
      code: 'computed(function() { return this.x; })',
      output: "computed.reads('x')",
      errors: [{ message: ERROR_MESSAGE_READS, type: 'CallExpression' }],
    },
    {
      code: "import Ember from 'ember'; Ember.computed(function() { return this.x; })",
      output: "import Ember from 'ember'; computed.reads('x')",
      errors: [{ message: ERROR_MESSAGE_READS, type: 'CallExpression' }],
    },
    {
      code: 'computed(function() { return this.x.y; })', // Nested path.
      output: "computed.reads('x.y')",
      errors: [{ message: ERROR_MESSAGE_READS, type: 'CallExpression' }],
    },
    {
      code: "computed(function() { return this.get('x.y'); })", // this.get()
      output: "computed.reads('x.y')",
      errors: [{ message: ERROR_MESSAGE_READS, type: 'CallExpression' }],
    },
    {
      code: "computed('x', function() { return this.x; })", // With dependent key.
      output: "computed.reads('x')",
      errors: [{ message: ERROR_MESSAGE_READS, type: 'CallExpression' }],
    },
    {
      // Optional chaining.
      code: 'computed(function() { return this.x?.y?.z; })',
      output: "computed.reads('x.y.z')",
      errors: [{ message: ERROR_MESSAGE_READS, type: 'CallExpression' }],
    },
    {
      // Optional chaining unnecessarily used on `this`.
      code: 'computed(function() { return this?.x?.y?.z; })',
      output: "computed.reads('x.y.z')",
      errors: [{ message: ERROR_MESSAGE_READS, type: 'CallExpression' }],
    },
    {
      // Decorator:
      code: "class Test { @computed('x') get someProp() { return this.x; } }",
      options: [{ includeNativeGetters: true }],
      output: "class Test { @computed.reads('x') someProp }",
      errors: [{ message: ERROR_MESSAGE_READS, type: 'MethodDefinition' }],
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
    {
      code: "computed(function() { return this.get('x') && this.get('y.z') && this.w; })", // Three parts with a nested path (and this.get).
      output: "computed.and('x', 'y.z', 'w')",
      errors: [{ message: ERROR_MESSAGE_AND, type: 'CallExpression' }],
    },
    {
      // Optional chaining.
      code: 'computed(function() { return this.x?.y && this.z; })',
      output: "computed.and('x.y', 'z')",
      errors: [{ message: ERROR_MESSAGE_AND, type: 'CallExpression' }],
    },
    {
      // Decorator:
      code: 'class Test { @computed() get someProp() { return this.x && this.y; } }',
      options: [{ includeNativeGetters: true }],
      output: "class Test { @computed.and('x', 'y') someProp }",
      errors: [{ message: ERROR_MESSAGE_AND, type: 'MethodDefinition' }],
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
    {
      // Optional chaining:
      code: 'computed(function() { return this.x?.y > 123; })',
      output: "computed.gt('x.y', 123)",
      errors: [{ message: ERROR_MESSAGE_GT, type: 'CallExpression' }],
    },
    {
      // Decorator:
      code: 'class Test { @computed() get someProp() { return this.x > 123; } }',
      options: [{ includeNativeGetters: true }],
      output: "class Test { @computed.gt('x', 123) someProp }",
      errors: [{ message: ERROR_MESSAGE_GT, type: 'MethodDefinition' }],
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
    {
      code: "computed(function() { return this.get('x') === 123; })", // this.get()
      output: "computed.equal('x', 123)",
      errors: [{ message: ERROR_MESSAGE_EQUAL, type: 'CallExpression' }],
    },

    // FILTERBY
    {
      code: "computed(function() { return this.chores.filterBy('done', true); })",
      output: "computed.filterBy('chores', 'done', true)",
      errors: [{ message: ERROR_MESSAGE_FILTER_BY, type: 'CallExpression' }],
    },

    // MAPBY
    {
      code: "computed(function() { return this.children.mapBy('age'); })",
      output: "computed.mapBy('children', 'age')",
      errors: [{ message: ERROR_MESSAGE_MAP_BY, type: 'CallExpression' }],
    },
    {
      code: "computed(function() { return this.nested.children.mapBy('age'); })",
      output: "computed.mapBy('nested.children', 'age')",
      errors: [{ message: ERROR_MESSAGE_MAP_BY, type: 'CallExpression' }],
    },
    {
      // Decorator:
      code: "class Test { @computed() get someProp() { return this.children.mapBy('age'); } }",
      options: [{ includeNativeGetters: true }],
      output: "class Test { @computed.mapBy('children', 'age') someProp }",
      errors: [{ message: ERROR_MESSAGE_MAP_BY, type: 'MethodDefinition' }],
    },
  ].map(addComputedImport),
});
