//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-shadow-route-definition');
const RuleTester = require('eslint').RuleTester;

const { buildErrorMessage } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
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
    `this.route('post', { path: '/:post' });
    this.route('edit', { path: '/:post/edit' });`,

    // With dynamic/variable route or path name:
    'this.route(someVariable);',
    "this.route('views', { path: someVariable })",
    `this.route(someVariable, function () {
      this.route('route');
    });
    `,
    `this.route('first', { path: foo });
    this.route('second', { path: 'foo' });
    `,
    `this.route(foo);
    this.route('foo');
    `,
    'this.route(null)',
    'this.route(true)',
    // Test not crashing on unexpected values, we bail out
    'this.route({})',
    `this.route(getRouteName(), function () {
      this.route('route');
    });`,
    `this.route("my-route", { path: getRoutePath() }, function () {
      this.route('route');
    });`,

    // Test if else conditions for route definitions
    `if (this.options.getTreatmentIsEnabled('test-key')) {
      this.route('new-route', { path: '/test' });
    } else {
      this.route('old-route', { path: '/test' });
    }`,

    `if (this.options.getTreatmentIsEnabled('test-key')) {
      this.route('new-route', { path: '/test' });
    } else {
      if (false) {
        this.route('old-route', { path: '/test' });
      } else {
        this.route('old-route-v2', { path: '/test' });
      }
    }`,

    `if (this.options.getTreatmentIsEnabled('test-key')) {
      if (true) {
        this.route('new-route', { path: '/test' });
      } else {
        this.route('new-route-v2', { path: '/test' });
      }
    } else {
      if (false) {
        this.route('old-route', { path: '/test' });
      } else {
        this.route('old-route-v2', { path: '/test' });
      }
    }`,

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
        this.route('post', { path: '' });
        this.route('edit', { path: '/' });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'edit',
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
              name: 'post',
              fullPath: '',
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
        this.route('post', { path: ' ' });
        this.route('edit', { path: ' / ' });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'edit',
              fullPath: ' / ',
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
              name: 'post',
              fullPath: ' ',
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
        this.route("blog");
        this.route("blog");
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'blog',
              fullPath: 'blog',
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
              fullPath: 'blog',
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
              fullPath: 'post',
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
              fullPath: 'post',
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
              fullPath: 'post',
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
              fullPath: '*blog',
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
        this.route("main", { path: " / " }, function() {
          this.route("blog", { path: " *blog " });
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
              fullPath: ' /  *blog ',
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
              fullPath: ':blog',
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
              fullPath: ':blog',
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
              fullPath: 'someVariable/',
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
              fullPath: 'someVariable/',
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
              fullPath: 'someVariable',
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
              fullPath: 'someVariable',
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
              fullPath: 'someVariable',
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
              fullPath: 'someVariable',
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
        this.route(null, { path: someVariable });
        this.route(null, { path: someVariable });
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'null',
              fullPath: 'someVariable',
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
              name: 'null',
              fullPath: 'someVariable',
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
        const options1 = { path: '/' }; this.route('post', options1);
        const options2 = { path: '/' }; this.route('edit', options2);
      `,
      output: null,
      errors: [
        {
          message: buildErrorMessage({
            leftRoute: {
              name: 'edit',
              fullPath: '/',
              source: {
                loc: {
                  start: {
                    line: 3,
                    column: 40,
                  },
                },
              },
            },
            rightRoute: {
              name: 'post',
              fullPath: '/',
              source: {
                loc: {
                  start: {
                    line: 2,
                    column: 40,
                  },
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

    expect(message).toBe(
      'Route "second" ("main/", 4L:10C) is shadowing route "first" ("main/", 3L:10C)'
    );
  });
});
