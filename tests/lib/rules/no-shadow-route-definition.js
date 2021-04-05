//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-shadow-route-definition');
const RuleTester = require('eslint').RuleTester;

const { buildErrorMessage, buildUnsupportedArgumentsErrorMessage } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run('no-shadow-route-definition', rule, {
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
    `this.route("blog", { path: "/" }, function() {
      this.route("sub-blog", { path: "/" });
    });`,
    `this.route("blog", function() {
      this.route("post");
    });`,
    `this.route("blog", { path: "/" }, function() {
      this.route("post");
    });`,
    `this.route("blog", { path: "/" }, function() {
      this.route("post", { path: "hero" });
    });`,
    `this.route("blog", function() {
      this.route("post", { path: "hero" });
    });`,
    `this.route("blog", { path: "/blog/post" }, function() {
      this.route("post", { path: "/" });
    });
    this.route("post")`,
    `this.route("blog", function() {
      this.route("post", { path: "/" });
    });
    this.route("post")`,

    // With dynamic segment:
    'this.route("blog", { path: ":blog" });',
    'this.route("blog", { path: "/:blog" });',
    'this.route("blog", { path: "blog/:blog_id" });',

    // With dynamic segment, nested:
    `this.route("blog", { path: "blog/:blog_id" }, function() {
      this.route("post");
    });
    this.route("post");`,
    `this.route("blog", { path: "/:blog" }, function() {
      this.route("post");
    });
    this.route("post");`,
    `this.route("blog", { path: ":blog" }, function() {
      this.route("post");
    });
    this.route("post");`,

    // With wildcard segment:
    'this.route("blog", { path: "*blog" });',
    'this.route("blog", { path: "/*blog" });',
    'this.route("blog", { path: "blog/*blog" });',

    // With wildcard segment, nested:
    `this.route("blog", { path: "*blog" }, function() {
      this.route("post");
    });
    this.route("post");`,
    `this.route("blog", { path: "/*blog" }, function() {
      this.route("post");
    });
    this.route("post");`,
    `this.route("blog", { path: "blog/*blog" }, function() {
      this.route("post");
    });
    this.route("post");`,
    // Test nested routes without leading slash (/) in path configuration.
    `this.route('edit', { path: ':experienceId' }, function () {
      this.route('views', { path: 'views/:viewId' });
      this.route('viewcollections', { path: 'viewcollections/:viewCollectionId' });
    });`,

    // With dynamic/variable route or path name:
    'this.route(someVariable);',
    "this.route('views', { path: someVariable })",
    `this.route(someVariable, function () {
      this.route('route');
    });
    `,

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
    {
      filename: 'my-test.js',
      code: `
        this.route("blog");
        this.route("blog");
      `,
    },
  ],
  invalid: [
    {
      code: `
        this.route("blog");
        this.route("blog");
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'blog',
              fullPath: '/blog',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'blog',
              fullPath: '/blog',
              source: {
                loc: {
                  start: {
                    line: 2,
                    column: 8,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("blog", { path: "/" }, function() {
          this.route("post");
        });
        this.route("post");
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'post',
              fullPath: '/post',
              source: {
                loc: {
                  start: {
                    line: 5,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'post',
              fullPath: '/post',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 10,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("blog", { path: "/" }, function() {
          this.route("post", function() {
            this.route("author");
          });
        });
        this.route("post");
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'post',
              fullPath: '/post',
              source: {
                loc: {
                  start: {
                    line: 7,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'post',
              fullPath: '/post',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 10,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("blog", { path: "/" }, function() {
          this.route("sub-blog", { path: "/" }, function() {
            this.route("post");
          });
        });
        this.route("post");
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'post',
              fullPath: '/post',
              source: {
                loc: {
                  start: {
                    line: 7,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'post',
              fullPath: '/post',
              source: {
                loc: {
                  start: {
                    line: 4,
                    column: 12,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("blog", { path: "/" }, function() {
          this.route("sub-blog", { path: "/" }, function() {
            this.route("post");
          });
        });
        this.route("sub-blog", { path: "/" });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'sub-blog',
              fullPath: '/',
              source: {
                loc: {
                  start: {
                    line: 7,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'blog',
              fullPath: '/',
              source: {
                loc: {
                  start: {
                    line: 2,
                    column: 8,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("blog", { path: "/" }, function() {
          this.route("sub-blog", { path: "/" }, function() {
            this.route("post");
          });
        });
        this.route("sub-blog", { path: "/" }, function() {
          this.route("post");
        });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'sub-blog',
              fullPath: '/',
              source: {
                loc: {
                  start: {
                    line: 7,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'blog',
              fullPath: '/',
              source: {
                loc: {
                  start: {
                    line: 2,
                    column: 8,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'post',
              fullPath: '/post',
              source: {
                loc: {
                  start: {
                    line: 8,
                    column: 10,
                  },
                },
              },
            },
            rightRoute: {
              name: 'post',
              fullPath: '/post',
              source: {
                loc: {
                  start: {
                    line: 4,
                    column: 12,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("blog", { path: "*blog" });
        this.route("blog", { path: "/*blog" });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'blog',
              fullPath: '/*blog',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'blog',
              fullPath: '/*blog',
              source: {
                loc: {
                  start: {
                    line: 2,
                    column: 8,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("main", { path: "/" }, function() {
          this.route("blog", { path: "*blog" });
        });
        this.route("blog", { path: "/*blog" });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'blog',
              fullPath: '/*blog',
              source: {
                loc: {
                  start: {
                    line: 5,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'blog',
              fullPath: '/*blog',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 10,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("main", { path: "/" }, function() {
          this.route("blog", { path: "*blog" });
        });
        this.route("blog", { path: "/*anotherWildcard" });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'blog',
              fullPath: '/*anotherWildcard',
              source: {
                loc: {
                  start: {
                    line: 5,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'blog',
              fullPath: '/*blog',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 10,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("blog", { path: ":blog" });
        this.route("blog", { path: "/:blog" });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'blog',
              fullPath: '/:blog',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'blog',
              fullPath: '/:blog',
              source: {
                loc: {
                  start: {
                    line: 2,
                    column: 8,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("blog", { path: ":blog" });
        this.route("blog", { path: "/:anotherParamName" });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'blog',
              fullPath: '/:anotherParamName',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'blog',
              fullPath: '/:blog',
              source: {
                loc: {
                  start: {
                    line: 2,
                    column: 8,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("main", { path: "/" }, function() {
          this.route("blog", { path: ":blog" });
        });
        this.route("blog", { path: "/:blog" });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'blog',
              fullPath: '/:blog',
              source: {
                loc: {
                  start: {
                    line: 5,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'blog',
              fullPath: '/:blog',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 10,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("first", { path: "/" });
        this.route("second", { path: "/" });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'second',
              fullPath: '/',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'first',
              fullPath: '/',
              source: {
                loc: {
                  start: {
                    line: 2,
                    column: 8,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route("main", function() {
          this.route("first", { path: "/" });
          this.route("second", { path: "/" });
        });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'second',
              fullPath: '/main/',
              source: {
                loc: {
                  start: {
                    line: 4,
                    column: 10,
                  },
                },
              },
            },
            rightRoute: {
              name: 'first',
              fullPath: '/main/',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 10,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route(someVariable, function() {
          this.route("first", { path: "/" });
          this.route("second", { path: "/" });
        });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'second',
              fullPath: '/someVariable/',
              source: {
                loc: {
                  start: {
                    line: 4,
                    column: 10,
                  },
                },
              },
            },
            rightRoute: {
              name: 'first',
              fullPath: '/someVariable/',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 10,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route(someVariable);
        this.route(someVariable);
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'someVariable',
              fullPath: '/someVariable',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'someVariable',
              fullPath: '/someVariable',
              source: {
                loc: {
                  start: {
                    line: 2,
                    column: 8,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        this.route('first', { path: someVariable });
        this.route('second', { path: someVariable });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'second',
              fullPath: '/someVariable',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 8,
                  },
                },
              },
            },
            rightRoute: {
              name: 'first',
              fullPath: '/someVariable',
              source: {
                loc: {
                  start: {
                    line: 2,
                    column: 8,
                  },
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 'this.route(true);',
      output: null,
      errors: [
        {
          message: buildUnsupportedArgumentsErrorMessage({
            source: {
              loc: {
                start: {
                  line: 1,
                  column: 0,
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 'this.route("first", { path: true });',
      output: null,
      errors: [
        {
          message: buildUnsupportedArgumentsErrorMessage({
            source: {
              loc: {
                start: {
                  line: 1,
                  column: 0,
                },
              },
            },
          }),
          type: 'CallExpression',
        },
      ],
    },
  ],
});

describe('no-shadow-route-definition', () => {
  it('builds error message string', () => {
    const message = buildErrorMessage({
      leftRoute: {
        name: 'second',
        fullPath: 'main/',
        source: {
          loc: {
            start: {
              line: 4,
              column: 10,
            },
          },
        },
      },
      rightRoute: {
        name: 'first',
        fullPath: 'main/',
        source: {
          loc: {
            start: {
              line: 3,
              column: 10,
            },
          },
        },
      },
    });

    expect(message).toStrictEqual(
      'Route "second" (main/, 4L:10C) is shadowing route "first" (main/, 3L:10C)'
    );
  });
});
