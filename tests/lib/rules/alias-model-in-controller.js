// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/alias-model-in-controller');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('alias-model-in-controller', rule, {
  valid: [
    // direct alias

    'export default Ember.Controller.extend({nail: alias("model")});',
    'export default Ember.Controller.extend({nail: computed.alias("model")});',
    'export default Ember.Controller.extend({nail: Ember.computed.alias("model")});',
    'export default Ember.Controller.extend({nail: readOnly("model")});',
    'export default Ember.Controller.extend({nail: computed.readOnly("model")});',
    'export default Ember.Controller.extend({nail: Ember.computed.readOnly("model")});',
    'export default Ember.Controller.extend({nail: reads("model")});',
    'export default Ember.Controller.extend({nail: computed.reads("model")});',
    'export default Ember.Controller.extend({nail: Ember.computed.reads("model")});',
    'export default Ember.Controller.extend(TestMixin, {nail: Ember.computed.alias("model")});',
    'const body = {nail: Ember.computed.alias("model")}; export default Ember.Controller.extend(TestMixin, body);', // With object variable.
    'export default Ember.Controller.extend(TestMixin, TestMixin2, {nail: Ember.computed.alias("model")});',
    {
      filename: 'example-app/controllers/path/to/some-feature.js',
      code: 'export default CustomController.extend({nail: alias("model")});',
    },

    // nested alias

    'export default Ember.Controller.extend({nail: alias("model.nail")});',
    'export default Ember.Controller.extend({nail: computed.alias("model.nail")});',
    'export default Ember.Controller.extend({nail: Ember.computed.alias("model.nail")});',
    'export default Ember.Controller.extend({nail: readOnly("model.nail")});',
    'export default Ember.Controller.extend({nail: computed.readOnly("model.nail")});',
    'export default Ember.Controller.extend({nail: Ember.computed.readOnly("model.nail")});',
    'export default Ember.Controller.extend({nail: reads("model.nail")});',
    'export default Ember.Controller.extend({nail: computed.reads("model.nail")});',
    'export default Ember.Controller.extend({nail: Ember.computed.reads("model.nail")});',
    'export default Ember.Controller.extend(TestMixin, {nail: Ember.computed.alias("model.nail")});',
    'export default Ember.Controller.extend(TestMixin, TestMixin2, {nail: Ember.computed.alias("model.nail")});',
    {
      filename: 'example-app/controllers/path/to/some-feature.js',
      code: 'export default CustomController.extend({nail: alias("model.nail")});',
    },
  ],
  invalid: [
    {
      code: 'export default Ember.Controller.extend({});',
      output: null,
      errors: [
        {
          message: 'Alias your model',
        },
      ],
    },
    {
      code: 'export default Ember.Controller.extend({resetPassword: service()});',
      output: null,
      errors: [
        {
          message: 'Alias your model',
        },
      ],
    },
    {
      code: 'export default Ember.Controller.extend({resetPassword: inject.service()});',
      output: null,
      errors: [
        {
          message: 'Alias your model',
        },
      ],
    },
    {
      code: 'export default Ember.Controller.extend({resetPassword: Ember.inject.service()});',
      output: null,
      errors: [
        {
          message: 'Alias your model',
        },
      ],
    },
    {
      code: 'export default Ember.Controller.extend(TestMixin, {});',
      output: null,
      errors: [
        {
          message: 'Alias your model',
        },
      ],
    },
    {
      code: 'export default Ember.Controller.extend(TestMixin, TestMixin2, {});',
      output: null,
      errors: [
        {
          message: 'Alias your model',
        },
      ],
    },
    {
      filename: 'example-app/controllers/path/to/some-feature.js',
      code: 'export default CustomController.extend({});',
      output: null,
      errors: [
        {
          message: 'Alias your model',
        },
      ],
    },
    {
      filename: 'example-app/some-feature/controller.js',
      code: 'export default CustomController.extend({});',
      output: null,
      errors: [
        {
          message: 'Alias your model',
        },
      ],
    },
    {
      filename: 'example-app/twisted-path/some-file.js',
      code: 'export default Controller.extend({});',
      output: null,
      errors: [
        {
          message: 'Alias your model',
        },
      ],
    },
  ],
});
