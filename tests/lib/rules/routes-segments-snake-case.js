// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/routes-segments-snake-case');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({ parser: require.resolve('babel-eslint') });
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
    'this.route("tree", { path: "*:"});',
    'this.route("tree", { ...foo });',
  ],
  invalid: [
    {
      code: 'this.route("tree", { path: ":treeId"});',
      output: null,
      errors: [
        {
          message: 'Use snake case in dynamic segments of routes',
        },
      ],
    },
    {
      // With object variable.
      code: 'const options = { path: ":treeId"}; this.route("tree", options);',
      output: null,
      errors: [{ message: 'Use snake case in dynamic segments of routes', type: 'Literal' }],
    },
    {
      code: 'this.route("tree", { path: ":tree-id" });',
      output: null,
      errors: [
        {
          message: 'Use snake case in dynamic segments of routes',
        },
      ],
    },
    {
      code: 'this.route("tree", { path: "/test/:treeId"});',
      output: null,
      errors: [
        {
          message: 'Use snake case in dynamic segments of routes',
        },
      ],
    },
    {
      code: 'this.route("tree", { path: "/test/treeId/:treeChildId"});',
      output: null,
      errors: [
        {
          message: 'Use snake case in dynamic segments of routes',
        },
      ],
    },
    {
      code: 'this.route("tree", { path: "/test/tree-id/:tree-child-id"});',
      output: null,
      errors: [
        {
          message: 'Use snake case in dynamic segments of routes',
        },
      ],
    },
  ],
});
