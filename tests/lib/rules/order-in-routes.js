// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/order-in-routes');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('order-in-routes', rule, {
  valid: [
    {
      code: 'export default Route.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      code: `export default Route.extend({
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      code: `export default Route.extend({
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      code: `export default Route.extend({
        levelOfHappiness: computed("attitude", "health", () => {
        }),
        model() {},
        actions: {
          test() { return this._customAction() }
        },
        _customAction() { const foo = 'bar'; }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      code: `export default Route.extend({
        init() {},
        model() {},
        render() {},
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      code: `export default Route.extend({
        mergedProperties: {},
        vehicle: alias("car"),
        levelOfHappiness: computed("attitude", "health", () => {
        }),
        model() {},
        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      code: `export default Route.extend({
        mergedProperties: {},
        test: "asd",
        vehicle: alias("car"),
        model() {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      code: `export default Route.extend({
        model() {},
        beforeModel() {},
        currentUser: service(),
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [{
        order: [
          'model',
          'lifecycle-hook',
          'service'
        ]
      }]
    },
    {
      code: `export default Route.extend({
        deactivate() {},
        beforeModel() {},
        currentUser: service(),
        model() {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [{
        order: [
          'lifecycle-hook',
          'service',
          'model'
        ]
      }]
    },
    {
      code: `export default Route.extend({
        deactivate() {},
        setupController() {},
        beforeModel() {},
        currentUser: service(),
        model() {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [{
        order: [
          [
            'deactivate',
            'setupController',
            'beforeModel'
          ],
          'service',
          'model'
        ]
      }]
    },
    {
      code: `
        export default Route.extend({
          foo: service(),
          init() {
            this._super(...arguments);
          },
          actions: {}
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      code: `
        export default Route.extend({
          foo: service(),
          init() {
            this._super(...arguments);
          },
          customFoo() {}
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
  ],
  invalid: [
    {
      code: `export default Route.extend({
        queryParams: {},
        currentUser: service(),
        customProp: "test",
        beforeModel() {},
        model() {},
        vehicle: alias("car"),
        actions: {},
        _customAction() {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "currentUser" service injection should be above the inherited "queryParams" property on line 2',
        line: 3
      }, {
        message: 'The "vehicle" single-line function should be above the "beforeModel" lifecycle hook on line 5',
        line: 7
      }]
    },
    {
      code: `export default Route.extend({
        queryParams: {},
        currentUser: inject(),
        customProp: "test",
        beforeModel() {},
        model() {},
        vehicle: alias("car"),
        actions: {},
        _customAction() {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "currentUser" service injection should be above the inherited "queryParams" property on line 2',
        line: 3
      }, {
        message: 'The "vehicle" single-line function should be above the "beforeModel" lifecycle hook on line 5',
        line: 7
      }]
    },
    {
      code: `export default Route.extend({
        customProp: "test",
        queryParams: {},
        beforeModel() {},
        model() {},
        actions: {},
        _customAction() {},
        levelOfHappiness: computed("attitude", "health", () => {
        })
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The inherited "queryParams" property should be above the "customProp" property on line 2',
        line: 3
      }, {
        message: 'The "levelOfHappiness" multi-line function should be above the "beforeModel" lifecycle hook on line 4',
        line: 8
      }]
    },
    {
      code: `export default Route.extend({
        customProp: "test",
        queryParams: {},
        model() {},
        beforeModel() {},
        actions: {},
        _customAction() {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The inherited "queryParams" property should be above the "customProp" property on line 2',
        line: 3
      }, {
        message: 'The "beforeModel" lifecycle hook should be above the "model" hook on line 4',
        line: 5
      }]
    },
    {
      code: `export default Route.extend({
        queryParams: {},
        vehicle: alias("car"),
        customProp: "test",
        model() {},
        _customAction() { const foo = 'bar'; },
        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "customProp" property should be above the "vehicle" single-line function on line 3',
        line: 4
      }, {
        message: 'The actions hash should be above the "_customAction" method on line 6',
        line: 7
      }]
    },
    {
      code: `export default Route.extend({
        model() {},
        customProp: "test",
        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "customProp" property should be above the "model" hook on line 2',
        line: 3
      }]
    },
    {
      code: `export default Route.extend({
        test: "asd",
        mergedProperties: {},
        model() {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The inherited "mergedProperties" property should be above the "test" property on line 2',
        line: 3
      }]
    },
    {
      code: `export default Route.extend({
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
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "redirect" lifecycle hook should be above the "setupController" lifecycle hook on line 11',
        line: 12
      }, {
        message: 'The "serialize" lifecycle hook should be above the "setupController" lifecycle hook on line 11',
        line: 13
      }, {
        message: 'The "activate" lifecycle hook should be above the "setupController" lifecycle hook on line 11',
        line: 14
      }, {
        message: 'The "renderTemplate" lifecycle hook should be above the "deactivate" lifecycle hook on line 15',
        line: 16
      }, {
        message: 'The "resetController" lifecycle hook should be above the "deactivate" lifecycle hook on line 15',
        line: 17
      }]
    },
    {
      code: `export default Route.extend({
        test: "asd",
        _test2() { const foo = 'bar'; },
        model() {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "model" hook should be above the "_test2" method on line 3',
        line: 4
      }]
    },
    {
      filename: 'example-app/routes/some-route.js',
      code: `export default CustomRoute.extend({
        model() {},
        test: "asd",
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "test" property should be above the "model" hook on line 2',
        line: 3
      }]
    },
    {
      filename: 'example-app/some-feature/route.js',
      code: `export default CustomRoute.extend({
        model() {},
        test: "asd",
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "test" property should be above the "model" hook on line 2',
        line: 3
      }]
    },
    {
      filename: 'example-app/twisted-path/some-file.js',
      code: `export default Route.extend({
        model() {},
        test: "asd",
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "test" property should be above the "model" hook on line 2',
        line: 3
      }]
    },
    {
      code: `
        export default Route.extend({
          foo: service(),
          actions: {},
          init() {
            this._super(...arguments);
          }
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "init" lifecycle hook should be above the actions hash on line 4',
        line: 5
      }]
    },
    {
      code: `
        export default Route.extend({
          foo: service(),
          customFoo() {},
          init() {
            this._super(...arguments);
          },
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "init" lifecycle hook should be above the "customFoo" empty method on line 4',
        line: 5
      }]
    },
    {
      code: `
        export default Route.extend({
          init() {
            this._super(...arguments);
          },
          foo: service()
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "foo" service injection should be above the "init" lifecycle hook on line 3',
        line: 6
      }]
    },
    {
      code: `
        export default Route.extend({
          init() {
            this._super(...arguments);
          },
          someProp: null
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "someProp" property should be above the "init" lifecycle hook on line 3',
        line: 6
      }]
    },
    {
      code: `export default Route.extend({
        queryParams: {},
        currentUser: service(),
        customProp: "test",
        beforeModel() {},
        model() {},
        vehicle: alias("car"),
        actions: {},
        _customAction() {}
      });`,
      output: `export default Route.extend({
        currentUser: service(),
        queryParams: {},
        customProp: "test",
        vehicle: alias("car"),
        beforeModel() {},
        model() {},
        actions: {},
        _customAction() {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "currentUser" service injection should be above the inherited "queryParams" property on line 2',
        line: 3
      }, {
        message: 'The "vehicle" single-line function should be above the "beforeModel" lifecycle hook on line 5',
        line: 7
      }]
    },
    {
      code: `export default Route.extend({
        customProp: "test",
        // queryParams line comment
        queryParams: {},
        model() {},
        /**
         * actions block comment
         */
        actions: {},
        _customAction() {}
      });`,
      output: `export default Route.extend({
        // queryParams line comment
        queryParams: {},
        customProp: "test",
        model() {},
        /**
         * actions block comment
         */
        actions: {},
        _customAction() {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The inherited "queryParams" property should be above the "customProp" property on line 2',
        line: 4
      }]
    },
    {
      code: `export default Route.extend({
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
      });`,
      output: `export default Route.extend({
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
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "beforeModel" lifecycle hook should be above the "model" hook on line 3',
        line: 7
      }]
    },
    {
      code:
// whitespace is preserved inside `` and it's breaking the test
`export default Route.extend({
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
      output:
`export default Route.extend({
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "beforeModel" lifecycle hook should be above the actions hash on line 6',
        line: 10
      }]
    },
    {
      code:
// whitespace is preserved inside `` and it's breaking the test
`export default Route.extend({
  model() {},
  test: "asd"
});`,
      output:
`export default Route.extend({
  test: "asd",
  model() {},
});`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "test" property should be above the "model" hook on line 2',
        line: 3
      }]
    },
    {
      code: `export default Route.extend({

        model() {},

        test: "asd",

        actions: {}

      });`,
      output: `export default Route.extend({

        test: "asd",

        model() {},

        actions: {}

      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "test" property should be above the "model" hook on line 3',
        line: 5
      }]
    }
  ]
});
