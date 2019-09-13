const path = require('path');

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-ember-get-and-set');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('use-ember-get-and-set', rule, {
  valid: [
    'get(this, "test")',
    'get(controller, "test")',
    'set(this, "test", someValue)',
    'set(controller, "test", someValue)',
    'getProperties(this, name, email, password)',
    'getProperties(controller, name, email, password)',
    'setProperties(this, {name: "Jon", email: "jon@snow.com"})',
    'setProperties(controller, {name: "Jon", email: "jon@snow.com"})',
    'getWithDefault(this, "test", "default")',
    'getWithDefault(controller, "test", "default")',
    {
      code: 'this.get("myProperty")',
      filename: path.join('app', 'tests', 'unit', 'components', 'component-test.js'),
    },
    {
      code: 'this.set("myProperty", "value")',
      filename: path.join('app', 'tests', 'unit', 'components', 'component-test.js'),
    },
    {
      code: 'this.get("/resources")',
      filename: path.join('app', 'mirage', 'config.js'),
    },
    {
      code: 'import Ember from "ember"; Ember.get(this, "test")',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; Ember.set(this, "test", someValue)',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import EmberAlias from "ember"; EmberAlias.get(this, "test")',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    // Non-fixable errors
    {
      code: 'this.get("test")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'controller.get("test")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'model.get("test")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'this.foo.get("test")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'this.getWithDefault("test", "default")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'controller.getWithDefault("test", "default")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'this.set("test", "value")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'controller.set("test", "value")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'model.set("test", "value")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'this.getProperties("test", "test2")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'controller.getProperties("test", "test2")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'model.getProperties("test", "test2")',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'this.setProperties({test: "value"})',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'controller.setProperties({test: "value"})',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'model.setProperties({test: "value"})',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'controller.getProperties("test", "test2")',
      filename: 'app/tests/unit/controllers/controller-test.js',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'controller.setProperties({test: "value"})',
      filename: 'app/tests/unit/controllers/controller-test.js',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    {
      code: 'controller.getWithDefault("test", "default")',
      filename: 'app/tests/unit/controllers/controller-test.js',
      output: null,
      errors: [{ message: 'Use get/set' }],
    },
    // Fixable errors using local modules
    {
      code: 'import Ember from "ember"; const { get } = Ember; this.get("test")',
      output: 'import Ember from "ember"; const { get } = Ember; get(this, "test")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; const { get } = Ember; controller.get("test")',
      output: 'import Ember from "ember"; const { get } = Ember; get(controller, "test")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; const { get } = Ember; model.get("test")',
      output: 'import Ember from "ember"; const { get } = Ember; get(model, "test")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; const { get } = Ember; this.foo.get("test")',
      output: 'import Ember from "ember"; const { get } = Ember; get(this.foo, "test")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code:
        'import Ember from "ember"; const { getWithDefault } = Ember; this.getWithDefault("test", "default")',
      output:
        'import Ember from "ember"; const { getWithDefault } = Ember; getWithDefault(this, "test", "default")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code:
        'import Ember from "ember"; const { getWithDefault } = Ember; controller.getWithDefault("test", "default")',
      output:
        'import Ember from "ember"; const { getWithDefault } = Ember; getWithDefault(controller, "test", "default")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; const { set } = Ember; this.set("test", "value")',
      output: 'import Ember from "ember"; const { set } = Ember; set(this, "test", "value")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; const { set } = Ember; controller.set("test", "value")',
      output: 'import Ember from "ember"; const { set } = Ember; set(controller, "test", "value")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; const { set } = Ember; model.set("test", "value")',
      output: 'import Ember from "ember"; const { set } = Ember; set(model, "test", "value")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code:
        'import Ember from "ember"; const { getProperties } = Ember; this.getProperties("test", "test2")',
      output:
        'import Ember from "ember"; const { getProperties } = Ember; getProperties(this, "test", "test2")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code:
        'import Ember from "ember"; const { getProperties } = Ember; controller.getProperties("test", "test2")',
      output:
        'import Ember from "ember"; const { getProperties } = Ember; getProperties(controller, "test", "test2")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code:
        'import Ember from "ember"; const { getProperties } = Ember; model.getProperties("test", "test2")',
      output:
        'import Ember from "ember"; const { getProperties } = Ember; getProperties(model, "test", "test2")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code:
        'import Ember from "ember"; const { setProperties } = Ember; this.setProperties({test: "value"})',
      output:
        'import Ember from "ember"; const { setProperties } = Ember; setProperties(this, {test: "value"})',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code:
        'import Ember from "ember"; const { setProperties } = Ember; controller.setProperties({test: "value"})',
      output:
        'import Ember from "ember"; const { setProperties } = Ember; setProperties(controller, {test: "value"})',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code:
        'import Ember from "ember"; const { setProperties } = Ember; model.setProperties({test: "value"})',
      output:
        'import Ember from "ember"; const { setProperties } = Ember; setProperties(model, {test: "value"})',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code:
        'import Ember from "ember"; const { getProperties } = Ember; controller.getProperties("test", "test2")',
      filename: 'app/tests/unit/controllers/controller-test.js',
      output:
        'import Ember from "ember"; const { getProperties } = Ember; getProperties(controller, "test", "test2")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code:
        'import Ember from "ember"; const { setProperties } = Ember; controller.setProperties({test: "value"})',
      filename: 'app/tests/unit/controllers/controller-test.js',
      output:
        'import Ember from "ember"; const { setProperties } = Ember; setProperties(controller, {test: "value"})',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code:
        'import Ember from "ember"; const { getWithDefault } = Ember; controller.getWithDefault("test", "default")',
      filename: 'app/tests/unit/controllers/controller-test.js',
      output:
        'import Ember from "ember"; const { getWithDefault } = Ember; getWithDefault(controller, "test", "default")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    // Fixable errors using method on Ember
    {
      code: 'import Ember from "ember"; this.get("test")',
      output: 'import Ember from "ember"; Ember.get(this, "test")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; controller.get("test")',
      output: 'import Ember from "ember"; Ember.get(controller, "test")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; model.get("test")',
      output: 'import Ember from "ember"; Ember.get(model, "test")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; this.foo.get("test")',
      output: 'import Ember from "ember"; Ember.get(this.foo, "test")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; this.getWithDefault("test", "default")',
      output: 'import Ember from "ember"; Ember.getWithDefault(this, "test", "default")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; controller.getWithDefault("test", "default")',
      output: 'import Ember from "ember"; Ember.getWithDefault(controller, "test", "default")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; this.set("test", "value")',
      output: 'import Ember from "ember"; Ember.set(this, "test", "value")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; controller.set("test", "value")',
      output: 'import Ember from "ember"; Ember.set(controller, "test", "value")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; model.set("test", "value")',
      output: 'import Ember from "ember"; Ember.set(model, "test", "value")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; this.getProperties("test", "test2")',
      output: 'import Ember from "ember"; Ember.getProperties(this, "test", "test2")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; controller.getProperties("test", "test2")',
      output: 'import Ember from "ember"; Ember.getProperties(controller, "test", "test2")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; model.getProperties("test", "test2")',
      output: 'import Ember from "ember"; Ember.getProperties(model, "test", "test2")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; this.setProperties({test: "value"})',
      output: 'import Ember from "ember"; Ember.setProperties(this, {test: "value"})',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; controller.setProperties({test: "value"})',
      output: 'import Ember from "ember"; Ember.setProperties(controller, {test: "value"})',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; model.setProperties({test: "value"})',
      output: 'import Ember from "ember"; Ember.setProperties(model, {test: "value"})',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; controller.getProperties("test", "test2")',
      filename: 'app/tests/unit/controllers/controller-test.js',
      output: 'import Ember from "ember"; Ember.getProperties(controller, "test", "test2")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; controller.setProperties({test: "value"})',
      filename: 'app/tests/unit/controllers/controller-test.js',
      output: 'import Ember from "ember"; Ember.setProperties(controller, {test: "value"})',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; controller.getWithDefault("test", "default")',
      filename: 'app/tests/unit/controllers/controller-test.js',
      output: 'import Ember from "ember"; Ember.getWithDefault(controller, "test", "default")',
      errors: [{ message: 'Use get/set' }],
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
});
