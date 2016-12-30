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
      code: 'export default Component.extend();',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
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
      code: 'export default Component.extend(TestMixin, {levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend(TestMixin, TestMixin2, {levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({abc: Ember.inject.service(), def: inject.service(), ghi: service(), role: "sloth", levelOfHappiness: computed("attitude", "health", () => {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({role: "sloth", abc: [], def: {}, ghi: alias("def")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({levelOfHappiness: computed("attitude", "health", () => {\n}), abc: Ember.observer("aaaa", () => {\n}), def: observer("aaaa", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({abc: observer("aaaa", () => {\n}), init() {\n}, actions: {}, customFunction() {\n}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({igh: service(), abc: [], def: true, singleComp: alias("abc"), multiComp: computed(() => {\n}), obs: observer("aaa", () => {\n}), init() {\n}, actions: {}, customFunc() {\n}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({init() {\n}, didReceiveAttrs() {\n}, willRender() {\n}, didInsertElement() {\n}, didRender() {\n}, didUpdateAttrs() {\n}, willUpdate() {\n}, didUpdate() {\n}, willDestroyElement() {\n}, willClearRender() {\n}, didDestroyElement() {\n}, actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({test: service(), didReceiveAttrs() {\n}, tSomeAction: task(function* (url) {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({test: service(), test2: computed.equal("asd", "qwe"), didReceiveAttrs() {\n}, tSomeAction: task(function* (url) {\n}).restartable()});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({test: service(), didReceiveAttrs() {\n}, tSomeAction: task(function* (url) {\n}), _anotherPrivateFnc() {\n}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({classNameBindings: ["filterDateSelectClass"], content: [], currentMonthEndDate: null, currentMonthStartDate: null, optionValuePath: "value", optionLabelPath: "label", typeOfDate: null, action: K});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({ role: "sloth", levelOfHappiness: computed.or("asd", "qwe"), actions: {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({ role: "sloth", levelOfHappiness: computed(function() {}), actions: {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({ role: "sloth", levelOfHappiness: computed(function() {\n}), actions: {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
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
      code: 'export default Component.extend({abc: true, i18n: service()});',
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
    {
      code: 'export default Component.extend({tAction: test(function() {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
  ]
});
