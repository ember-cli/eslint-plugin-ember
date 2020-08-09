// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-side-effects');
const RuleTester = require('eslint').RuleTester;
const { addComputedImport } = require('../../helpers/test-case');

const { ERROR_MESSAGE } = rule;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('no-side-effects', rule, {
  valid: [
    'testAmount: alias("test.length")',
    'testAmount: computed("test.length", { get() { return ""; }, set() { set(this, "testAmount", test.length); }})',
    'let foo = computed("test", function() { someMap.set(this, "testAmount", test.length); return ""; })',
    'testAmount: computed("test.length", { get() { return ""; }, set() { setProperties(); }})',
    'let foo = computed("test", function() { someMap.setProperties(); return ""; })',
    'import Ember from "ember"; import Foo from "some-other-thing"; let foo = computed("test", function() { Foo.set(this, "testAmount", test.length); return ""; });',
    'import Ember from "ember"; import Foo from "some-other-thing"; let foo = computed("test", function() { Foo.setProperties(); return ""; });',
    'computed("test", function() { this.test; })',
    'computed("test", function() { this.myFunction(); })',
    'computed("test", function() { let x = 123; x = 456; someObject.x = 123; })',

    // Decorators:
    {
      code: `
        class Test {
          @computed('first', 'last')
          get fullName() { return this.first + ' ' + this.last; }
        }
      `,
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
    {
      code: `
        class Test {
          @computed
          get fullName() { return 'foo'; }
        }
      `,
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },

    // No computed property function body;
    'computed()',
    'computed("test")',
    'computed("test", function() {})',
    'computed',

    // Not in a computed property:
    "this.set('x', 123);",
    'this.setProperties({ x: 123 });',
    'this.x = 123;',
    'this.x.y = 123;',
  ].map(addComputedImport),
  invalid: [
    {
      code: 'prop: computed("test", function() {this.set("testAmount", test.length); return "";})',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'prop: computed("test", function() { this.setProperties("testAmount", test.length); return "";})',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'prop: computed("test", function() {if (get(this, "testAmount")) { set(this, "testAmount", test.length); } return "";})',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'prop: computed("test", function() {if (get(this, "testAmount")) { setProperties(this, "testAmount", test.length); } return "";})',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'testAmount: computed("test.length", { get() { set(this, "testAmount", test.length); }, set() { set(this, "testAmount", test.length); }})',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'testAmount: computed("test.length", { get() { setProperties(this, "testAmount", test.length); }, set() { setProperties(this, "testAmount", test.length); }})',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'testAmount: computed("test.length", function() { const setSomething = () => { set(this, "testAmount", test.length); }; setSomething(); })',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'testAmount: computed("test.length", function() { const setSomething = () => { setProperties(this, "testAmount", test.length); }; setSomething(); })',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'let foo = computed("test", function() { Ember.set(this, "testAmount", test.length); return ""; })',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'let foo = computed("test", function() { Ember.setProperties(this, "testAmount", test.length); return ""; })',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'import Foo from "ember"; let foo = computed("test", function() { Foo.set(this, "testAmount", test.length); return ""; })',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'import Foo from "ember"; let foo = computed("test", function() { Foo.setProperties(this, "testAmount", test.length); return ""; })',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'import EmberFoo from "ember"; import Foo from "some-other-thing"; let foo = computed("test", function() { EmberFoo.set(this, "testAmount", test.length); return ""; });',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code:
        'import EmberFoo from "ember"; import Foo from "some-other-thing"; let foo = computed("test", function() { EmberFoo.setProperties(this, "testAmount", test.length); return ""; });',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },

    // Decorator with getter inside object parameter:
    {
      code: `
        class Test {
          @computed('key', {
            get() {
              this.set('x', 123);
            },
            set(key, value) {}
          })
          someProp
        }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
    // Decorator with getter function:
    {
      code: `
        class Test {
          @computed()
          get someProp() { this.set('x', 123); }
        }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
    // Decorator without parentheses:
    {
      code: `
        class Test {
          @computed
          get someProp() { this.set('x', 123); }
        }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },

    {
      // ES5 setter:
      code: 'computed("test", function() { this.x = 123; })',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'AssignmentExpression',
        },
      ],
    },

    {
      // ES5 setter with nested path:
      code: 'computed("test", function() { this.x.y = 123; })',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'AssignmentExpression',
        },
      ],
    },
  ].map(addComputedImport),
});
