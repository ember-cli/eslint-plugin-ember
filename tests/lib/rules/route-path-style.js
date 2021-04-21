//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/route-path-style');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: require.resolve('babel-eslint'),
});
ruleTester.run('route-path-style', rule, {
  valid: [
    // Implicit path:
    'this.route("blog");',
    'this.route("blog-posts");',

    // Explicit path:
    'this.route("blog", { path: "" });',
    'this.route("blog", { path: "/" });',
    'this.route("blog", { path: "*:" });',
    'this.route("blog", { path: "/blog" });',
    'this.route("blog", { path: "/blog/blog" });',
    'this.route("blog", { path: "/blog/blog-posts" });',
    'this.route("blog-posts", { path: "/blog-posts" });',
    'this.route("blog_posts", { path: "/blog-posts" });',
    'this.route("blogPosts", { path: "/blog-posts" });',

    // With dynamic segments:
    'this.route("blog", { path: "/blog/blog-posts/:blog_id" });',
    'this.route("blog", { path: ":blog_id" });',
    'this.route("blog", { path: "blog/:blog_id" });',
    'this.route("blog", { path: "/blog/:blog_id" });',
    'this.route("blog", { path: ":blog_id/:other_id" });',
    'this.route("blog", { path: "/blog/:blog_id/test/:other_id" });',

    // With wildcard segment:
    'this.route("blog", { path: "*path" });',
    'this.route("blog", { path: "*path_name" });',
    'this.route("blog", { path: "*pathName" });',
    'this.route("blog", { path: "/*path" });',
    'this.route("blog", { path: "/*path_name" });',
    'this.route("blog", { path: "/*pathName" });',
    'this.route("blog", { path: "/blog/*path" });',
    'this.route("blog", { path: "/blog/*path_name" });',
    'this.route("blog", { path: "/blog/*pathName" });',

    // With function:
    'this.route("blog", function() { this.route("update"); });',
    'this.route("blog", { path: "/blog-posts" }, function() { this.route("update"); });',

    // With other field in object:
    'this.route("blog", { otherField: "/blog_posts" });',
    'this.route("blog", { otherField: "/blog_posts", path: "/blog" });',
    'this.route("blog-posts", { otherField: "/blog_posts" });',
    'this.route("blog-posts", { ...foo });',

    // Not Ember's route function:
    'test();',
    "test('blog');",
    "test('blog_posts');",
    "test('blogPosts');",
    "test('blog-posts', { path: '/blog_posts' });",
    'this.test();',
    "this.test('blog');",
    "this.test('blog_posts');",
    "this.test('blogPosts');",
    "this.test('blog-posts', { path: '/blog_posts' });",
    'MyClass.route();',
    "MyClass.route('blog');",
    "MyClass.route('blog_posts');",
    "MyClass.route('blogPosts');",
    "MyClass.route('blog-posts', { path: '/blog_posts' });",
    "route.unrelatedFunction('blog_posts');",
    "this.route.unrelatedFunction('blog_posts');",

    // Incorrect usage:
    'this.route();',

    // With variable:
    "this.route('team', { path: myPath });",
    "this.route('team', { path: `part-${some-variable}` });", // eslint-disable-line no-template-curly-in-string
  ],
  invalid: [
    {
      code: 'this.route("blog_posts");',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Literal',
          suggestions: [{ messageId: 'convertToKebabCase', output: 'this.route("blog-posts");' }],
        },
      ],
    },
    {
      code: 'this.route("blogPosts");',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Literal',
          suggestions: [{ messageId: 'convertToKebabCase', output: 'this.route("blog-posts");' }],
        },
      ],
    },
    {
      code: 'this.route("blogPosts", function() {});',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Literal',
          suggestions: [
            { messageId: 'convertToKebabCase', output: 'this.route("blog-posts", function() {});' },
          ],
        },
      ],
    },
    {
      code: 'this.route("blog-posts", { path: "/blog_posts" });',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Literal',
          suggestions: [
            {
              messageId: 'convertToKebabCase',
              output: 'this.route("blog-posts", { path: "/blog-posts" });',
            },
          ],
        },
      ],
    },
    {
      code: 'this.route("blog-posts", { path: "/blogPosts" });',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Literal',
          suggestions: [
            {
              messageId: 'convertToKebabCase',
              output: 'this.route("blog-posts", { path: "/blog-posts" });',
            },
          ],
        },
      ],
    },
    {
      // With object variable.
      code: 'const options = { path: "/blogPosts" }; this.route("blog-posts", options);',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Literal',
          suggestions: [
            {
              messageId: 'convertToKebabCase',
              output: 'const options = { path: "/blog-posts" }; this.route("blog-posts", options);',
            },
          ],
        },
      ],
    },
    {
      code: 'this.route("blog-posts", { path: "/blogPosts/:blog_id" });',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Literal',
          suggestions: [
            {
              messageId: 'convertToKebabCase',
              output: 'this.route("blog-posts", { path: "/blog-posts/:blog_id" });',
            },
          ],
        },
      ],
    },
    {
      code: 'this.route("blog-posts", { path: "/blog-posts/:blog_id/otherPart" });',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Literal',
          suggestions: [
            {
              messageId: 'convertToKebabCase',
              output: 'this.route("blog-posts", { path: "/blog-posts/:blog_id/other-part" });',
            },
          ],
        },
      ],
    },
    {
      code: 'this.route("blog-posts", { path: "/blogPosts/*path" });',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Literal',
          suggestions: [
            {
              messageId: 'convertToKebabCase',
              output: 'this.route("blog-posts", { path: "/blog-posts/*path" });',
            },
          ],
        },
      ],
    },
    {
      code: 'this.route("blog-posts", { path: "/blogPosts" }, function() {});',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Literal',
          suggestions: [
            {
              messageId: 'convertToKebabCase',
              output: 'this.route("blog-posts", { path: "/blog-posts" }, function() {});',
            },
          ],
        },
      ],
    },
  ],
});
