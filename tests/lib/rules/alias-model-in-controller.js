// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/alias-model-in-controller');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('alias-model-in-controller', rule, {
  valid: [

    // direct alias

    {
      code: 'export default Ember.Controller.extend({nail: alias("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: computed.alias("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: Ember.computed.alias("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: readOnly("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: computed.readOnly("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: Ember.computed.readOnly("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: reads("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: computed.reads("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: Ember.computed.reads("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend(TestMixin, {nail: Ember.computed.alias("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend(TestMixin, TestMixin2, {nail: Ember.computed.alias("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      filename: 'example-app/controllers/path/to/some-feature.js',
      code: 'export default CustomController.extend({nail: alias("model")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },

    // nested alias

    {
      code: 'export default Ember.Controller.extend({nail: alias("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: computed.alias("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: Ember.computed.alias("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: readOnly("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: computed.readOnly("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: Ember.computed.readOnly("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: reads("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: computed.reads("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend({nail: Ember.computed.reads("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend(TestMixin, {nail: Ember.computed.alias("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Ember.Controller.extend(TestMixin, TestMixin2, {nail: Ember.computed.alias("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      filename: 'example-app/controllers/path/to/some-feature.js',
      code: 'export default CustomController.extend({nail: alias("model.nail")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: 'export default Ember.Controller.extend({});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Alias your model',
      }],
    },
    {
      code: 'export default Ember.Controller.extend({resetPassword: service()});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Alias your model',
      }],
    },
    {
      code: 'export default Ember.Controller.extend({resetPassword: inject.service()});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Alias your model',
      }],
    },
    {
      code: 'export default Ember.Controller.extend({resetPassword: Ember.inject.service()});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Alias your model',
      }],
    },
    {
      code: 'export default Ember.Controller.extend(TestMixin, {});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Alias your model',
      }],
    },
    {
      code: 'export default Ember.Controller.extend(TestMixin, TestMixin2, {});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Alias your model',
      }],
    },
    {
      filename: 'example-app/controllers/path/to/some-feature.js',
      code: 'export default CustomController.extend({});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Alias your model',
      }],
    },
    {
      filename: 'example-app/some-feature/controller.js',
      code: 'export default CustomController.extend({});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Alias your model',
      }],
    },
    {
      filename: 'example-app/twisted-path/some-file.js',
      code: 'export default Controller.extend({});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Alias your model',
      }],
    },
  ],
});
