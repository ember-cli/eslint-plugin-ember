//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unnecessary-index-route');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-unnecessary-index-route', rule, {
  valid: [
    'this.route("blog");',
    'this.route("blog", function() {});',
    'this.route("blog", { path: "" });',
    'this.route("blog", { path: "/" });',
    'this.route("blog", { path: "/:blog_id" });',
    'this.route("blog", { path: "/*path" });',
    'this.route("blog", { path: "blog-posts" });',
    'this.route("blog", { path: "blog-posts" }, function() {});',

    // Not Ember's route function:
    'test();',
    "test('index');",
    "test('index', { path: '/' });",
    "this.test('index');",
    "this.test('index', { path: '/' });",
    "MyClass.route('index');",
    "MyClass.route('index', { path: '/' });",
    "route.unrelatedFunction('index');",
    "route.unrelatedFunction('index', { path: '/' });",
    "this.route.unrelatedFunction('index');",
    "this.route.unrelatedFunction('index', { path: '/' });",
  ],
  invalid: [
    {
      code: 'this.route("index");',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'this.route("index", { path: "" });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'this.route("index", { path: "/" });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'this.route("index", { path: "/index" });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'this.route("index", { path: "/" }, function() {});',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ],
});
