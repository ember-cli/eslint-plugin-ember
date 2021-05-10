//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unnecessary-route-path-option');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parser: require.resolve('@babel/eslint-parser') });
ruleTester.run('no-unnecessary-route-path-option', rule, {
  valid: [
    'this.route("blog");',
    'this.route("blog", function() {});',
    'this.route("blog", { ...foo });',
    'this.route("blog", { path: undefined });',
    'this.route("blog", { path: "" });',
    'this.route("blog", { path: "/" });',
    'this.route("blog", { path: "blog-posts" });',
    'this.route("blog", { path: "blog-posts" }, function() {});',
    'this.route("blog", { path: "/blog-posts" });',
    'this.route("blog", { path: "blog-posts", otherOption: true });',

    // With dynamic segment:
    'this.route("blog", { path: ":blog" });',
    'this.route("blog", { path: "/:blog" });',
    'this.route("blog", { path: "blog/:blog_id" });',

    // With wildcard segment:
    'this.route("blog", { path: "*blog" });',
    'this.route("blog", { path: "/*blog" });',
    'this.route("blog", { path: "blog/*blog" });',

    // Not Ember's route function:
    'test();',
    "test('blog');",
    "test('blog', { path: 'blog' });",
    "test('blog', { path: '/blog' });",
    "this.test('blog');",
    "this.test('blog', { path: 'blog' });",
    "this.test('blog', { path: '/blog' });",
    "MyClass.route('blog');",
    "MyClass.route('blog', { path: 'blog' });",
    "MyClass.route('blog', { path: '/blog' });",
    "route.unrelatedFunction('blog', { path: 'blog' });",
    "this.route.unrelatedFunction('blog', { path: 'blog' });",
  ],
  invalid: [
    {
      code: 'this.route("blog", { path: "blog" });',
      output: 'this.route("blog" );',
      errors: [{ message: ERROR_MESSAGE, type: 'Property' }],
    },
    {
      code: 'this.route("blog", { path: "blog" }, function() {});',
      output: 'this.route("blog",  function() {});',
      errors: [{ message: ERROR_MESSAGE, type: 'Property' }],
    },
    {
      code: 'this.route("blog", { path: "/blog" });',
      output: 'this.route("blog" );',
      errors: [{ message: ERROR_MESSAGE, type: 'Property' }],
    },
    {
      code: 'this.route("blog", { path: "/blog", otherOption: true });',
      output: 'this.route("blog", {  otherOption: true });',
      errors: [{ message: ERROR_MESSAGE, type: 'Property' }],
    },
    {
      code: 'this.route("blog", { otherOption: true, path: "/blog" });',
      output: 'this.route("blog", { otherOption: true  });',
      errors: [{ message: ERROR_MESSAGE, type: 'Property' }],
    },
    {
      code: 'this.route("blog", { firstOption: true, path: "/blog", lastOption: true });',
      output: 'this.route("blog", { firstOption: true,  lastOption: true });',
      errors: [{ message: ERROR_MESSAGE, type: 'Property' }],
    },

    {
      // With object variable: single option.
      code: 'const options = { path: "blog" }; this.route("blog", options);',
      output: 'const options = {  }; this.route("blog", options);',
      errors: [{ message: ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With object variable: first option.
      code: 'const options = { path: "blog", somethingElse: true }; this.route("blog", options);',
      output: 'const options = {  somethingElse: true }; this.route("blog", options);',
      errors: [{ message: ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With object variable: last option.
      code: 'const options = { somethingElse: true, path: "blog" }; this.route("blog", options);',
      output: 'const options = { somethingElse: true  }; this.route("blog", options);',
      errors: [{ message: ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With object variable: middle option.
      code: 'const options = { firstOption: true, path: "blog", lastOption: true }; this.route("blog", options);',
      output:
        'const options = { firstOption: true,  lastOption: true }; this.route("blog", options);',
      errors: [{ message: ERROR_MESSAGE, type: 'Property' }],
    },
  ],
});
