'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/order-in-components');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('order-in-components', rule, {
  valid: [
    {
      code: 'export default Component.extend({role: "sloth", vehicle: alias("car"), levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({role: "sloth", levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({role: "sloth", abc: Ember.inject.service(), def: inject.service(), ghi: service(), levelOfHappiness: computed("attitude", "health", () => {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({role: "sloth", abc: [], def: {}, ghi: service()});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({levelOfHappiness: computed("attitude", "health", () => {\n}), abc: Ember.observer("aaaa", function () {\n}), def: observer("aaaa", function () {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({abc: observer("aaaa", () => {\n}), init: function () {\n}, actions: {}, customFunction() {\n}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({abc: [], def: true, igh: service(), singleComp: alias("abc"), multiComp: computed(() => {\n}), obs: observer("aaa", function () {\n}), init: function () {\n}, actions: {}, customFunc: function() {\n}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend(TestMixin, {levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend(TestMixin, TestMixin2, {levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    }
  ],
  invalid: [
    {
      code: 'export default Component.extend({actions: {}, role: "sloth", vehicle: alias("car"), levelOfHappiness: computed("attitude", "health", () => {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend({vehicle: alias("car"), role: "sloth", levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend({levelOfHappiness: computed("attitude", "health", () => {\n}), vehicle: alias("car"), role: "sloth", actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend(TestMixin, {levelOfHappiness: computed("attitude", "health", () => {\n}), vehicle: alias("car"), role: "sloth", actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend(TestMixin, TestMixin2, {levelOfHappiness: computed("attitude", "health", () => {\n}), vehicle: alias("car"), role: "sloth", actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend({i18n: service(), abc: true});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend({vehicle: alias("car"), i18n: service()});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend({levelOfHappiness: observer("attitude", "health", () => {\n}), vehicle: alias("car")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend({levelOfHappiness: observer("attitude", "health", () => {\n}), aaa: computed("attitude", "health", () => {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend({init() {\n}, levelOfHappiness: observer("attitude", "health", () => {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend({actions: {}, init() {\n}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend({customFunc() {\n}, actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
  ]
});
