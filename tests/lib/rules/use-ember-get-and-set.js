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
    'set(this, "test")',
    'set(controller, "test")',
    'getProperties(this, name, email, password)',
    'getProperties(controller, name, email, password)',
    'setProperties(this, {name: "Jon", email: "jon@snow.com"})',
    'setProperties(controller, {name: "Jon", email: "jon@snow.com"})',
    'getWithDefault(this, "test", "default")',
    'getWithDefault(controller, "test", "default")',
  ],
  invalid: [
    {
      code: 'this.get("test")',
      output: 'get(this, "test")',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'controller.get("test")',
      output: 'get(controller, "test")',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'model.get("test")',
      output: 'get(model, "test")',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'this.getWithDefault("test", "default")',
      output: 'getWithDefault(this, "test", "default")',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'controller.getWithDefault("test", "default")',
      output: 'getWithDefault(controller, "test", "default")',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'this.set("test", "value")',
      output: 'set(this, "test", "value")',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'controller.set("test", "value")',
      output: 'set(controller, "test", "value")',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'model.set("test", "value")',
      output: 'set(model, "test", "value")',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'this.getProperties("test", "test2")',
      output: 'getProperties(this, "test", "test2")',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'controller.getProperties("test", "test2")',
      output: 'getProperties(controller, "test", "test2")',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'model.getProperties("test", "test2")',
      output: 'getProperties(model, "test", "test2")',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'this.setProperties({test: "value"})',
      output: 'setProperties(this, {test: "value"})',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'controller.setProperties({test: "value"})',
      output: 'setProperties(controller, {test: "value"})',
      errors: [{
        message: 'Use get/set',
      }],
    },
    {
      code: 'model.setProperties({test: "value"})',
      output: 'setProperties(model, {test: "value"})',
      errors: [{
        message: 'Use get/set',
      }],
    },
  ],
});
