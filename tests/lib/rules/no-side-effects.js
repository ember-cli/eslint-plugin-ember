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
  parser: require.resolve('@babel/eslint-parser'),
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
      parser: require.resolve('@babel/eslint-parser'),
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
      parser: require.resolve('@babel/eslint-parser'),
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

    // Events (but `catchEvents` option off):
    { code: 'computed(function() { this.send(); })', options: [{ catchEvents: false }] },
    { code: 'computed(function() { this.sendAction(); })', options: [{ catchEvents: false }] },
    { code: 'computed(function() { this.sendEvent(); })', options: [{ catchEvents: false }] },
    { code: 'computed(function() { this.trigger(); })', options: [{ catchEvents: false }] },
    {
      code: 'import { sendEvent } from "@ember/object/events"; computed(function() { sendEvent(); })',
      options: [{ catchEvents: false }],
    },

    // Not in a computed property (events):
    'this.send()',
    'this.sendAction()',
    'this.sendEvent()',
    'this.trigger()',
    'import { sendEvent } from "@ember/object/events"; sendEvent();',

    // checkPlainGetters = false
    {
      code: 'import Component from "@ember/component"; class Foo extends Component { get foo() { this.x = 123; } }',
      options: [{ checkPlainGetters: false }],
    },

    // checkPlainGetters = true
    {
      code: 'import Component from "@ember/component"; class Foo extends Component { get foo() { return 123; } }',
      options: [{ checkPlainGetters: true }],
    },
    {
      code: 'import Component from "@ember/component"; class Foo extends Component { set foo(x) { this.x = x; } }',
      options: [{ checkPlainGetters: true }],
    },
    {
      // Not Ember class:
      code: 'class Foo { get foo() { this.x = x; } }',
      options: [{ checkPlainGetters: true }],
    },
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
      code: 'import { setProperties } from "@ember/object"; computed(function() { setProperties(this, "foo", 123); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'import { setProperties } from "@ember/object"; computed(function() { setProperties(this.foo, 123); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },

    // Ember.set
    {
      code: 'import Ember from "ember"; computed(function() { Ember.set(this, "testAmount", test.length); return ""; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'import Ember from "ember"; computed(function() { Ember.set(this.foo, "testAmount", test.length); return ""; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'import Ember from "ember"; computed(function() { Ember.set(this.foo?.bar, "testAmount", test.length); return ""; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'import Ember from "ember"; computed(function() { Ember.setProperties(this, "testAmount", test.length); return ""; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },

    // Renamed Ember import
    {
      code: 'import E from "ember"; computed(function() { E.set(this, "testAmount", test.length); return ""; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'import E from "ember"; computed(function() { E.setProperties(this, "testAmount", test.length); return ""; })',
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
      parser: require.resolve('@babel/eslint-parser'),
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
      parser: require.resolve('@babel/eslint-parser'),
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
      parser: require.resolve('@babel/eslint-parser'),
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

    // Events (from this):
    {
      code: 'computed(function() { this.send(); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'computed(function() { this.sendAction(); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'computed(function() { this.sendEvent(); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'computed(function() { this.trigger(); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },

    // Events (from Ember):
    {
      code: 'import Ember from "ember"; computed(function() { Ember.send(); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'import Ember from "ember"; computed(function() { Ember.sendAction(); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'import Ember from "ember"; computed(function() { Ember.sendEvent(); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'import Ember from "ember"; computed(function() { Ember.trigger(); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },

    {
      // Imported sendEvent function:
      code: 'import { sendEvent as se } from "@ember/object/events"; computed(function() { se(); })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },

    {
      // checkPlainGetters = true (default)
      code: 'import Component from "@ember/component"; class Foo extends Component { get foo() { this.x = 123; } }',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // checkPlainGetters = true
      code: 'import Component from "@ember/component"; class Foo extends Component { get foo() { this.x = 123; } }',
      output: null,
      options: [{ checkPlainGetters: true }],
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
  ].map(addComputedImport),
});
