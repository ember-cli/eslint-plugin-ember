'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/routes-segments-snake-case');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('routes-segments-snake-case', rule, {
  valid: [
    'this.route("tree", { path: ":tree_id"});',
    'this.route("tree", { path: "/test/:tree_id"});',
    'this.route("email");',
    'this.route("facebook-messages", { path: "fb-messages" });',
    'this.route("summary", { path: "/" });',
    'this.route("reset-password", function() {this.route("update");});',
  ],
  invalid: [
    {
      code: 'this.route("tree", { path: ":treeId"});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Use snake case in dynamic segments of routes',
      }],
    },
    {
      code: 'this.route("tree", { path: ":tree-id" });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Use snake case in dynamic segments of routes',
      }],
    },
    {
      code: 'this.route("tree", { path: "/test/:treeId"});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Use snake case in dynamic segments of routes',
      }],
    },
  ]
});
