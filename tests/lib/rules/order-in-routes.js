/* eslint eslint-plugin/consistent-output: "off" */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/order-in-routes');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('order-in-routes', rule, {
  valid: [
    `
      import Route from '@ember/routing/route';
      export default Route.extend();
    `,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        currentUser: service(),
        queryParams: {},
        customProp: "test",
        vehicle: alias("car"),
        levelOfHappiness: computed("attitude", "health", () => {
        }),
        beforeModel() {},
        model() {},
        afterModel() {},
        serialize() {},
        redirect() {},
        activate() {},
        setupController() {},
        renderTemplate() {},
        resetController() {},
        deactivate() {},
        actions: {},
        _customAction() { const foo = 'bar'; },
        _customAction2: function() { const foo = 'bar'; },
        tSomeTask: task(function* () {})
      });`,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        currentUser: inject(),
        queryParams: {},
        customProp: "test",
        vehicle: alias("car"),
        levelOfHappiness: computed("attitude", "health", () => {
        }),
        beforeModel() {},
        model() {},
        afterModel() {},
        actions: {},
        _customAction() {},
        _customAction2: function() {},
        tSomeTask: task(function* () {})
      });`,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        levelOfHappiness: computed("attitude", "health", () => {
        }),
        model() {},
        actions: {
          test() { return this._customAction() }
        },
        _customAction() { const foo = 'bar'; }
      });`,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        init() {},
        model() {},
        render() {},
      });`,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        mergedProperties: {},
        vehicle: alias("car"),
        levelOfHappiness: computed("attitude", "health", () => {
        }),
        model() {},
        actions: {}
      });`,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        mergedProperties: {},
        test: "asd",
        vehicle: alias("car"),
        model() {}
      });`,
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          model() {},
          beforeModel() {},
          currentUser: service(),
        });
      `,
      options: [
        {
          order: ['model', 'lifecycle-hook', 'service'],
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          deactivate() {},
          beforeModel() {},
          currentUser: service(),
          model() {}
        });
      `,
      options: [
        {
          order: ['lifecycle-hook', 'service', 'model'],
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          deactivate() {},
          setupController() {},
          beforeModel() {},
          currentUser: service(),
          model() {}
        });
      `,
      options: [
        {
          order: [['deactivate', 'setupController', 'beforeModel'], 'service', 'model'],
        },
      ],
    },
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        foo: service(),
        init() {
          this._super(...arguments);
        },
        actions: {}
      });
    `,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        foo: service(),
        init() {
          this._super(...arguments);
        },
        customFoo() {}
      });
    `,
  ],
  invalid: [
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          queryParams: {},
          currentUser: service(),
          customProp: "test",
          beforeModel() {},
          model() {},
          vehicle: alias("car"),
          actions: {},
          _customAction() {}
        });
      `,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the inherited "queryParams" property on line 4',
          line: 5,
        },
        {
          message:
            'The "vehicle" single-line function should be above the "beforeModel" lifecycle hook on line 7',
          line: 9,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          queryParams: {},
          currentUser: inject(),
          customProp: "test",
          beforeModel() {},
          model() {},
          vehicle: alias("car"),
          actions: {},
          _customAction() {}
        });
      `,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the inherited "queryParams" property on line 4',
          line: 5,
        },
        {
          message:
            'The "vehicle" single-line function should be above the "beforeModel" lifecycle hook on line 7',
          line: 9,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          customProp: "test",
          queryParams: {},
          beforeModel() {},
          model() {},
          actions: {},
          _customAction() {},
          levelOfHappiness: computed("attitude", "health", () => {
          })
        });
      `,
      errors: [
        {
          message:
            'The inherited "queryParams" property should be above the "customProp" property on line 4',
          line: 5,
        },
        {
          message:
            'The "levelOfHappiness" multi-line function should be above the "beforeModel" lifecycle hook on line 6',
          line: 10,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          customProp: "test",
          queryParams: {},
          model() {},
          beforeModel() {},
          actions: {},
          _customAction() {}
        });
      `,
      errors: [
        {
          message:
            'The inherited "queryParams" property should be above the "customProp" property on line 4',
          line: 5,
        },
        {
          message: 'The "beforeModel" lifecycle hook should be above the "model" hook on line 6',
          line: 7,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          queryParams: {},
          vehicle: alias("car"),
          customProp: "test",
          model() {},
          _customAction() { const foo = 'bar'; },
          actions: {}
        });
      `,
      errors: [
        {
          message:
            'The "customProp" property should be above the "vehicle" single-line function on line 5',
          line: 6,
        },
        {
          message: 'The actions hash should be above the "_customAction" method on line 8',
          line: 9,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          model() {},
          customProp: "test",
          actions: {}
        });
      `,
      errors: [
        {
          message: 'The "customProp" property should be above the "model" hook on line 4',
          line: 5,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          test: "asd",
          mergedProperties: {},
          model() {}
        });
      `,
      errors: [
        {
          message:
            'The inherited "mergedProperties" property should be above the "test" property on line 4',
          line: 5,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          currentUser: service(),
          queryParams: {},
          customProp: "test",
          vehicle: alias("car"),
          levelOfHappiness: computed("attitude", "health", () => {
          }),
          beforeModel() {},
          model() {},
          afterModel() {},
          setupController() {},
          redirect() {},
          serialize() {},
          activate() {},
          deactivate() {},
          renderTemplate() {},
          resetController() {},
          actions: {},
          _customAction() {},
          _customAction2: function() {},
          tSomeTask: task(function* () {})
        });
      `,
      errors: [
        {
          message:
            'The "redirect" lifecycle hook should be above the "setupController" lifecycle hook on line 13',
          line: 14,
        },
        {
          message:
            'The "serialize" lifecycle hook should be above the "setupController" lifecycle hook on line 13',
          line: 15,
        },
        {
          message:
            'The "activate" lifecycle hook should be above the "setupController" lifecycle hook on line 13',
          line: 16,
        },
        {
          message:
            'The "renderTemplate" lifecycle hook should be above the "deactivate" lifecycle hook on line 17',
          line: 18,
        },
        {
          message:
            'The "resetController" lifecycle hook should be above the "deactivate" lifecycle hook on line 17',
          line: 19,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          test: "asd",
          _test2() { const foo = 'bar'; },
          model() {}
        });
      `,
      errors: [
        {
          message: 'The "model" hook should be above the "_test2" method on line 5',
          line: 6,
        },
      ],
    },
    {
      filename: 'example-app/routes/some-route.js',
      code: `
        import CustomRoute from '@ember/routing/route';
        export default CustomRoute.extend({
          model() {},
          test: "asd",
        });
      `,
      errors: [
        {
          message: 'The "test" property should be above the "model" hook on line 4',
          line: 5,
        },
      ],
    },
    {
      filename: 'example-app/some-feature/route.js',
      code: `
        import CustomRoute from '@ember/routing/route';
        export default CustomRoute.extend({
          model() {},
          test: "asd",
        });
      `,
      errors: [
        {
          message: 'The "test" property should be above the "model" hook on line 4',
          line: 5,
        },
      ],
    },
    {
      filename: 'example-app/twisted-path/some-file.js',
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          model() {},
          test: "asd",
        });
      `,
      errors: [
        {
          message: 'The "test" property should be above the "model" hook on line 4',
          line: 5,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          foo: service(),
          actions: {},
          init() {
            this._super(...arguments);
          }
        });
      `,
      errors: [
        {
          message: 'The "init" lifecycle hook should be above the actions hash on line 5',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          foo: service(),
          customFoo() {},
          init() {
            this._super(...arguments);
          },
        });
      `,
      errors: [
        {
          message:
            'The "init" lifecycle hook should be above the "customFoo" empty method on line 5',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          init() {
            this._super(...arguments);
          },
          foo: service()
        });
      `,
      errors: [
        {
          message:
            'The "foo" service injection should be above the "init" lifecycle hook on line 4',
          line: 7,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          init() {
            this._super(...arguments);
          },
          someProp: null
        });
      `,
      errors: [
        {
          message: 'The "someProp" property should be above the "init" lifecycle hook on line 4',
          line: 7,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          queryParams: {},
          currentUser: service(),
          customProp: "test",
          beforeModel() {},
          model() {},
          vehicle: alias("car"),
          actions: {},
          _customAction() {}
        });
      `,
      output: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          currentUser: service(),
          queryParams: {},
          customProp: "test",
          vehicle: alias("car"),
          beforeModel() {},
          model() {},
          actions: {},
          _customAction() {}
        });
      `,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the inherited "queryParams" property on line 4',
          line: 5,
        },
        {
          message:
            'The "vehicle" single-line function should be above the "beforeModel" lifecycle hook on line 7',
          line: 9,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          customProp: "test",
          // queryParams line comment
          queryParams: {},
          model() {},
          /**
          * actions block comment
          */
          actions: {},
          _customAction() {}
        });
      `,
      output: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          // queryParams line comment
          queryParams: {},
          customProp: "test",
          model() {},
          /**
          * actions block comment
          */
          actions: {},
          _customAction() {}
        });
      `,
      errors: [
        {
          message:
            'The inherited "queryParams" property should be above the "customProp" property on line 4',
          line: 6,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          customProp: "test",
          model() {},
          /**
          * beforeModel block comment
          */
          beforeModel() {},
          /**
          * actions block comment
          */
          actions: {},
          _customAction() {}
        });
      `,
      output: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          customProp: "test",
          /**
          * beforeModel block comment
          */
          beforeModel() {},
          model() {},
          /**
          * actions block comment
          */
          actions: {},
          _customAction() {}
        });
      `,
      errors: [
        {
          message: 'The "beforeModel" lifecycle hook should be above the "model" hook on line 5',
          line: 9,
        },
      ],
    },
    {
      code:
        // whitespace is preserved inside `` and it's breaking the test
        `import Route from '@ember/routing/route';
export default Route.extend({
  customProp: "test",
  /**
   * actions block comment
   */
  actions: {},
  /**
   * beforeModel block comment
   */
  beforeModel() {}
});`,
      output: `import Route from '@ember/routing/route';
export default Route.extend({
  customProp: "test",
  /**
   * beforeModel block comment
   */
  beforeModel() {},
  /**
   * actions block comment
   */
  actions: {},
});`,
      errors: [
        {
          message: 'The "beforeModel" lifecycle hook should be above the actions hash on line 7',
          line: 11,
        },
      ],
    },
    {
      code:
        // whitespace is preserved inside `` and it's breaking the test
        `import Route from '@ember/routing/route';
export default Route.extend({
  model() {},
  test: "asd"
});`,
      output: `import Route from '@ember/routing/route';
export default Route.extend({
  test: "asd",
  model() {},
});`,
      errors: [
        {
          message: 'The "test" property should be above the "model" hook on line 3',
          line: 4,
        },
      ],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({

          model() {},

          test: "asd",

          actions: {}

        });
      `,
      output: `
        import Route from '@ember/routing/route';
        export default Route.extend({

          test: "asd",

          model() {},

          actions: {}

        });
      `,
      errors: [
        {
          message: 'The "test" property should be above the "model" hook on line 5',
          line: 7,
        },
      ],
    },
  ],
});
