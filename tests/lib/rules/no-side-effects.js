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
    'alias("test.length")',
    'computed(function() { this.test; })',
    'computed(function() { this.myFunction(); })',

    // set
    'computed(function() { foo.set(this, "testAmount", test.length); return ""; });',
    "computed(function() { foo1.foo2.set('bar', 123); })",
    'import { set } from "@ember/object"; computed(function() { set(foo, 123); });', // imported set
    'import Ember from "ember"; computed(function() { Ember.set(foo, 123); });', // Ember.set
    'computed(function() { let x = 123; x = 456; someObject.x = 123; })', // ES5 setter

    // Inside setter
    'import { set } from "@ember/object"; computed({ get() { return ""; }, set() { set(this, "testAmount", test.length); }})',
    'computed({ get() { return ""; }, set() { setProperties(); }})',

    // setProperties
    'computed(function() { foo.setProperties("bar", 123); return ""; });',
    'import { setProperties } from "@ember/object"; computed(function() { setProperties(foo, 123); return ""; });', // imported setProperties
    'import Ember from "ember"; computed(function() { Ember.setProperties(foo, 123); });', // Ember.setProperties

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
    'computed(function() {})',
    'computed',

    // Not in a computed property:
    "this.set('x', 123);",
    "import { set } from '@ember/object'; set(this, 'x', 123);",
    'this.setProperties({ x: 123 });',
    "import { setProperties } from '@ember/object'; setProperties(this, 'x', 123);",
    "import Ember from 'ember'; Ember.set(this, 'x', 123);",
    "import Ember from 'ember'; Ember.setProperties(this, 'x', 123);",
    'this.x = 123;',
    'this.x.y = 123;',
  ].map(addComputedImport),
  invalid: [
    // this.set
    {
      code: 'computed(function() {this.set("testAmount", test.length); return "";})',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'computed(function() { this.setProperties("testAmount", test.length); return "";})',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },

    // imported set
    {
      code: 'import { set } from "@ember/object"; computed(function() { set(this, 123); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'import { set } from "@ember/object"; computed(function() { set(this.foo, 123); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code:
        'import { setProperties } from "@ember/object"; computed(function() { setProperties(this, "foo", 123); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code:
        'import { setProperties } from "@ember/object"; computed(function() { setProperties(this.foo, 123); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },

    // Ember.set
    {
      code:
        'import Ember from "ember"; computed(function() { Ember.set(this, "testAmount", test.length); return ""; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code:
        'import Ember from "ember"; computed(function() { Ember.set(this.foo, "testAmount", test.length); return ""; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code:
        'import Ember from "ember"; computed(function() { Ember.setProperties(this, "testAmount", test.length); return ""; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },

    // Renamed Ember import
    {
      code:
        'import E from "ember"; computed(function() { E.set(this, "testAmount", test.length); return ""; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code:
        'import E from "ember"; computed(function() { E.setProperties(this, "testAmount", test.length); return ""; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
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
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
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
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
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
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },

    {
      // ES5 setter:
      code: 'computed(function() { this.x = 123; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },

    {
      // ES5 setter with nested path:
      code: 'computed(function() { this.x.y = 123; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
  ].map(addComputedImport),
});
