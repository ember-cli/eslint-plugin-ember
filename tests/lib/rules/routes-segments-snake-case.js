// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/routes-segments-snake-case');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('routes-segments-snake-case', rule, {
  valid: [
    'this.route("tree", { path: ":tree_id"});',
    'this.route("tree", { path: "/test/:tree_id"});',
    'this.route("email");',
    'this.route("facebook-messages", { path: "fb-messages" });',
    'this.route("summary", { path: "/" });',
    'this.route("reset-password", function() {this.route("update");});',
    'this.test()',
    'this.route("tree", { path: ":tree_id/:tree_child_id"});',
    'this.route("tree", { path: "/test/:tree_id/:tree_child_id"});',
    'this.route("tree", { path: "/test/:tree_id/test/:tree_child_id"});',
    'this.route("tree", { path: "/test/:tree_id/test_test/:tree_child_id"});',
    'this.route("tree", { path: "/test/:tree_id/test-test/:tree_child_id"});',
    'this.route("tree", { path: "/test/:tree_id/testTest/:tree_child_id"});',
  ],
  invalid: [
    {
      code: 'this.route("tree", { path: ":treeId"});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Use snake case in dynamic segments of routes',
      }],
    },
    {
      code: 'this.route("tree", { path: ":tree-id" });',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Use snake case in dynamic segments of routes',
      }],
    },
    {
      code: 'this.route("tree", { path: "/test/:treeId"});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Use snake case in dynamic segments of routes',
      }],
    },
    {
      code: 'this.route("tree", { path: "/test/treeId/:treeChildId"});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Use snake case in dynamic segments of routes',
      }],
    },
    {
      code: 'this.route("tree", { path: "/test/tree-id/:tree-child-id"});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Use snake case in dynamic segments of routes',
      }],
    },
  ],
});
