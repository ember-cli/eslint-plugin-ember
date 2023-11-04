// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/order-in-routes');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  parser: require.resolve('@babel/eslint-parser'),
});

eslintTester.run('order-in-routes', rule, {
  valid: [
    'export default Route.extend();',
    'export default Route.extend({ ...foo });',
    `import {inject as service} from '@ember/service';
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
    `import {inject} from '@ember/service';
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
    `export default Route.extend({
        levelOfHappiness: computed("attitude", "health", () => {
        }),
        model() {},
        actions: {
          test() { return this._customAction() }
        },
        _customAction() { const foo = 'bar'; }
      });`,
    `export default Route.extend({
        init() {},
        model() {},
        render() {},
      });`,
    `export default Route.extend({
        mergedProperties: {},
        vehicle: alias("car"),
        levelOfHappiness: computed("attitude", "health", () => {
        }),
        model() {},
        actions: {}
      });`,
    `export default Route.extend({
        mergedProperties: {},
        test: "asd",
        vehicle: alias("car"),
        model() {}
      });`,
    {
      code: `import {inject as service} from '@ember/service';
      export default Route.extend({
        model() {},
        beforeModel() {},
        currentUser: service(),
      });`,
      options: [
        {
          order: ['model', 'lifecycle-hook', 'service'],
        },
      ],
    },
    {
      code: `import {inject as service} from '@ember/service';
      export default Route.extend({
        deactivate() {},
        beforeModel() {},
        currentUser: service(),
        model() {}
      });`,
      options: [
        {
          order: ['lifecycle-hook', 'service', 'model'],
        },
      ],
    },
    {
      code: `import {inject as service} from '@ember/service';
      export default Route.extend({
        deactivate() {},
        setupController() {},
        beforeModel() {},
        currentUser: service(),
        model() {}
      });`,
      options: [
        {
          order: [['deactivate', 'setupController', 'beforeModel'], 'service', 'model'],
        },
      ],
    },
    `
      import {inject as service} from '@ember/service';
      export default Route.extend({
        foo: service(),
        init() {
          this._super(...arguments);
        },
        actions: {}
      });
    `,
    `
      import {inject as service} from '@ember/service';
      export default Route.extend({
        foo: service(),
        init() {
          this._super(...arguments);
        },
        customFoo() {}
      });
    `,
    {
      code: `export default Route.extend({
        prop: null,
        actions: {
          action: () => {}
        },
        customProp: { a: 1 }
      });`,
      options: [
        {
          order: ['property', 'actions', 'custom:customProp'],
        },
      ],
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: `import {inject as service} from '@ember/service';
      export default Route.extend({
        queryParams: {},
        currentUser: service(),
        customProp: "test",
        beforeModel() {},
        model() {},
        vehicle: alias("car"),
        actions: {},
        _customAction() {}
      });`,
      output: `import {inject as service} from '@ember/service';
      export default Route.extend({
        currentUser: service(),
        queryParams: {},
        customProp: "test",
        vehicle: alias("car"),
        beforeModel() {},
        model() {},
        actions: {},
        _customAction() {}
      });`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the inherited "queryParams" property on line 3',
          line: 4,
        },
        {
          message:
            'The "vehicle" single-line function should be above the "beforeModel" lifecycle hook on line 6',
          line: 8,
        },
      ],
    },
    {
      code: `import {inject} from '@ember/service';
      export default Route.extend({
        queryParams: {},
        currentUser: inject(),
        customProp: "test",
        beforeModel() {},
        model() {},
        vehicle: alias("car"),
        actions: {},
        _customAction() {}
      });`,
      output: `import {inject} from '@ember/service';
      export default Route.extend({
        currentUser: inject(),
        queryParams: {},
        customProp: "test",
        vehicle: alias("car"),
        beforeModel() {},
        model() {},
        actions: {},
        _customAction() {}
      });`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the inherited "queryParams" property on line 3',
          line: 4,
        },
        {
          message:
            'The "vehicle" single-line function should be above the "beforeModel" lifecycle hook on line 6',
          line: 8,
        },
      ],
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
      output: `export default Route.extend({
        queryParams: {},
        customProp: "test",
        beforeModel() {},
        model() {},
        actions: {},
        _customAction() {},
        levelOfHappiness: computed("attitude", "health", () => {
        })
      });`,
      errors: [
        {
          message:
            'The inherited "queryParams" property should be above the "customProp" property on line 2',
          line: 3,
        },
        {
          message:
            'The "levelOfHappiness" multi-line function should be above the "beforeModel" lifecycle hook on line 4',
          line: 8,
        },
      ],
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
      output: `export default Route.extend({
        queryParams: {},
        customProp: "test",
        model() {},
        beforeModel() {},
        actions: {},
        _customAction() {}
      });`,
      errors: [
        {
          message:
            'The inherited "queryParams" property should be above the "customProp" property on line 2',
          line: 3,
        },
        {
          message: 'The "beforeModel" lifecycle hook should be above the "model" hook on line 4',
          line: 5,
        },
      ],
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
      output: `export default Route.extend({
        queryParams: {},
        customProp: "test",
        vehicle: alias("car"),
        model() {},
        actions: {},
              _customAction() { const foo = 'bar'; },
});`,
      errors: [
        {
          message:
            'The "customProp" property should be above the "vehicle" single-line function on line 3',
          line: 4,
        },
        {
          message: 'The actions hash should be above the "_customAction" method on line 6',
          line: 7,
        },
      ],
    },
    {
      code: `export default Route.extend({
        model() {},
        customProp: "test",
        actions: {}
      });`,
      output: `export default Route.extend({
        customProp: "test",
        model() {},
        actions: {}
      });`,
      errors: [
        {
          message: 'The "customProp" property should be above the "model" hook on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `export default Route.extend({
        test: "asd",
        mergedProperties: {},
        model() {}
      });`,
      output: `export default Route.extend({
        mergedProperties: {},
        test: "asd",
        model() {}
      });`,
      errors: [
        {
          message:
            'The inherited "mergedProperties" property should be above the "test" property on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `import {inject as service} from '@ember/service';
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
      });`,
      output: `import {inject as service} from '@ember/service';
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
        redirect() {},
        setupController() {},
        serialize() {},
        activate() {},
        renderTemplate() {},
        deactivate() {},
        resetController() {},
        actions: {},
        _customAction() {},
        _customAction2: function() {},
        tSomeTask: task(function* () {})
      });`,
      errors: [
        {
          message:
            'The "redirect" lifecycle hook should be above the "setupController" lifecycle hook on line 12',
          line: 13,
        },
        {
          message:
            'The "serialize" lifecycle hook should be above the "setupController" lifecycle hook on line 12',
          line: 14,
        },
        {
          message:
            'The "activate" lifecycle hook should be above the "setupController" lifecycle hook on line 12',
          line: 15,
        },
        {
          message:
            'The "renderTemplate" lifecycle hook should be above the "deactivate" lifecycle hook on line 16',
          line: 17,
        },
        {
          message:
            'The "resetController" lifecycle hook should be above the "deactivate" lifecycle hook on line 16',
          line: 18,
        },
      ],
    },
    {
      code: `export default Route.extend({
        test: "asd",
        _test2() { const foo = 'bar'; },
        model() {}
      });`,
      output: `export default Route.extend({
        test: "asd",
        model() {},
              _test2() { const foo = 'bar'; },
});`,
      errors: [
        {
          message: 'The "model" hook should be above the "_test2" method on line 3',
          line: 4,
        },
      ],
    },
    {
      filename: 'example-app/routes/some-route.js',
      code: `export default CustomRoute.extend({
        model() {},
        test: "asd",
      });`,
      output: `export default CustomRoute.extend({
        test: "asd",
              model() {},
});`,
      errors: [
        {
          message: 'The "test" property should be above the "model" hook on line 2',
          line: 3,
        },
      ],
    },
    {
      filename: 'example-app/some-feature/route.js',
      code: `export default CustomRoute.extend({
        model() {},
        test: "asd",
      });`,
      output: `export default CustomRoute.extend({
        test: "asd",
              model() {},
});`,
      errors: [
        {
          message: 'The "test" property should be above the "model" hook on line 2',
          line: 3,
        },
      ],
    },
    {
      filename: 'example-app/twisted-path/some-file.js',
      code: `export default Route.extend({
        model() {},
        test: "asd",
      });`,
      output: `export default Route.extend({
        test: "asd",
              model() {},
});`,
      errors: [
        {
          message: 'The "test" property should be above the "model" hook on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `
        import {inject as service} from '@ember/service';
        export default Route.extend({
          foo: service(),
          actions: {},
          init() {
            this._super(...arguments);
          }
        });
      `,
      output: `
        import {inject as service} from '@ember/service';
        export default Route.extend({
          foo: service(),
          init() {
            this._super(...arguments);
          },
                  actions: {},
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
        import {inject as service} from '@ember/service';
        export default Route.extend({
          foo: service(),
          customFoo() {},
          init() {
            this._super(...arguments);
          },
        });
      `,
      output: `
        import {inject as service} from '@ember/service';
        export default Route.extend({
          foo: service(),
          init() {
            this._super(...arguments);
          },
                  customFoo() {},
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
        import {inject as service} from '@ember/service';
        export default Route.extend({
          init() {
            this._super(...arguments);
          },
          foo: service()
        });
      `,
      output: `
        import {inject as service} from '@ember/service';
        export default Route.extend({
          foo: service(),
                  init() {
            this._super(...arguments);
          },
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
        export default Route.extend({
          init() {
            this._super(...arguments);
          },
          someProp: null
        });
      `,
      output: `
        export default Route.extend({
          someProp: null,
                  init() {
            this._super(...arguments);
          },
});
      `,
      errors: [
        {
          message: 'The "someProp" property should be above the "init" lifecycle hook on line 3',
          line: 6,
        },
      ],
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
      errors: [
        {
          message:
            'The inherited "queryParams" property should be above the "customProp" property on line 2',
          line: 4,
        },
      ],
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
      errors: [
        {
          message: 'The "beforeModel" lifecycle hook should be above the "model" hook on line 3',
          line: 7,
        },
      ],
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
      output: `export default Route.extend({
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
          message: 'The "beforeModel" lifecycle hook should be above the actions hash on line 6',
          line: 10,
        },
      ],
    },
    {
      code:
        // whitespace is preserved inside `` and it's breaking the test
        `export default Route.extend({
  model() {},
  test: "asd"
});`,
      output: `export default Route.extend({
  test: "asd",
  model() {},
});`,
      errors: [
        {
          message: 'The "test" property should be above the "model" hook on line 2',
          line: 3,
        },
      ],
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
      errors: [
        {
          message: 'The "test" property should be above the "model" hook on line 3',
          line: 5,
        },
      ],
    },
    {
      code: `export default Route.extend({
        customProp: { a: 1 },
        aMethod() {
          console.log('not empty');
        }
      });`,
      output: `export default Route.extend({
        aMethod() {
          console.log('not empty');
        },
              customProp: { a: 1 },
});`,
      options: [
        {
          order: ['method', 'custom:customProp'],
        },
      ],
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      errors: [
        {
          message:
            'The "aMethod" method should be above the "customProp" custom property on line 2',
          line: 3,
        },
      ],
    },
  ],
});
