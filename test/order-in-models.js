'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/order-in-models');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('order-in-models', rule, {
  valid: [
    {
      code: 'export default Model.extend();',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Model.extend({shape: attr("string"), behaviors: hasMany("behaviour"), test: computed.alias("qwerty"), mood: computed("health", "hunger", function() {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Model.extend({behaviors: hasMany("behaviour"), mood: computed("health", "hunger", function() {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Model.extend({mood: computed("health", "hunger", function() {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default DS.Model.extend({shape: DS.attr("string"), behaviors: hasMany("behaviour"), mood: computed("health", "hunger", function() {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default DS.Model.extend({behaviors: hasMany("behaviour"), mood: computed("health", "hunger", function() {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default DS.Model.extend({mood: computed("health", "hunger", function() {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default DS.Model.extend(TestMixin, {mood: computed("health", "hunger", function() {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default DS.Model.extend(TestMixin, TestMixin2, {mood: computed("health", "hunger", function() {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    }
  ],
  invalid: [
    {
      code: 'export default Model.extend({behaviors: hasMany("behaviour"), shape: attr("string"), mood: computed("health", "hunger", function() {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Model.extend({shape: attr("string"), mood: computed("health", "hunger", function() {\n}), behaviors: hasMany("behaviour")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Model.extend({mood: computed("health", "hunger", function() {\n}), shape: attr("string")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default DS.Model.extend({behaviors: hasMany("behaviour"), shape: DS.attr("string"), mood: Ember.computed("health", "hunger", function() {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default DS.Model.extend({shape: attr("string"), mood: computed("health", "hunger", function() {\n}), behaviors: hasMany("behaviour")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default DS.Model.extend({mood: computed("health", "hunger", function() {\n}), shape: attr("string")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default DS.Model.extend({mood: computed("health", "hunger", function() {\n}), test: computed.alias("qwerty")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default DS.Model.extend(TestMixin, {mood: computed("health", "hunger", function() {\n}), test: computed.alias("qwerty")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default DS.Model.extend(TestMixin, TestMixin2, {mood: computed("health", "hunger", function() {\n}), test: computed.alias("qwerty")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    }
  ]
});
