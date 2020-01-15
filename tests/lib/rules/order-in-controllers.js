/* eslint eslint-plugin/consistent-output: "off" */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/order-in-controllers');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('order-in-controllers', rule, {
  valid: [
    'export default Controller.extend();',
    `export default Controller.extend({
        application: controller(),
        currentUser: service(),
        queryParams: [],
        customProp: "test",
        actions: {},
        _customAction() { const foo = 'bar'; },
        _customAction2: function() { const foo = 'bar'; },
        tSomeTask: task(function* () {})
      });`,
    `export default Controller.extend({
        currentUser: inject(),
        queryParams: [],
        customProp: "test",
        actions: {},
        _customAction() {},
        _customAction2: function() {},
        tSomeTask: task(function* () {})
      });`,
    `export default Controller.extend({
        queryParams: [],
        customProp: "test",
        comp: computed("test", function() {}),
        obs: observer("asd", function() {}),
        actions: {}
      });`,
    `export default Controller.extend({
        customProp: "test",
        comp: computed("test", function() {}),
        comp2: computed("test", function() {
        }),
        actions: {},
        _customAction() { const foo = 'bar'; }
      });`,
    {
      code: `export default Controller.extend({
        actions: {},
        comp: computed("test", function() {}),
        customProp: "test",
        comp2: computed("test", function() {
        }),
        _customAction() { const foo = 'bar'; }
      });`,
      options: [
        {
          order: ['actions', 'single-line-function'],
        },
      ],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        currentUser: service(),
      });`,
      options: [
        {
          order: ['query-params', 'service'],
        },
      ],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        application: controller(),
      });`,
      options: [
        {
          order: ['query-params', 'controller'],
        },
      ],
    },
    `
        export default Controller.extend({
          foo: service(),
          someProp: null,
          init() {
            this._super(...arguments);
          },
          actions: {
            onKeyPress: function (event) {}
          }
        });
      `,
    `
        export default Controller.extend({
          foo: service(),
          init() {
            this._super(...arguments);
          },
          customFoo() {}
        });
      `,
    `
        export default Controller.extend({
          foo: service(),
          init() {
            this._super(...arguments);
          }
        });
      `,
  ],
  invalid: [
    {
      code: `export default Controller.extend({
        queryParams: [],
        currentUser: service()
      });`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        currentUser: inject()
      });`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `export default Controller.extend({
        currentUser: service(),
        customProp: "test",
        queryParams: []
      });`,
      errors: [
        {
          message: 'The "queryParams" property should be above the "customProp" property on line 3',
          line: 4,
        },
      ],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        actions: {},
        customProp: "test"
      });`,
      errors: [
        {
          message: 'The "customProp" property should be above the actions hash on line 3',
          line: 4,
        },
      ],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        _customAction() { const foo = 'bar'; },
        actions: {}
      });`,
      errors: [
        {
          message: 'The actions hash should be above the "_customAction" method on line 3',
          line: 4,
        },
      ],
    },
    {
      code: `export default Controller.extend({
        test: "asd",
        queryParams: [],
        actions: {}
      });`,
      errors: [
        {
          message: 'The "queryParams" property should be above the "test" property on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `export default Controller.extend({
        currentUser: service(),
        application: controller()
      });`,
      errors: [
        {
          message:
            'The "application" controller injection should be above the "currentUser" service injection on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `export default Controller.extend({
        test: "asd",
        obs: observer("asd", function() {}),
        comp: computed("asd", function() {}),
        actions: {}
      });`,
      errors: [
        {
          message: 'The "comp" single-line function should be above the "obs" observer on line 3',
          line: 4,
        },
      ],
    },
    {
      filename: 'example-app/controllers/some-controller.js',
      code: `export default CustomController.extend({
        queryParams: [],
        currentUser: service()
      });`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 2',
          line: 3,
        },
      ],
    },
    {
      filename: 'example-app/some-feature/controller.js',
      code: `export default CustomController.extend({
        queryParams: [],
        currentUser: service()
      });`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 2',
          line: 3,
        },
      ],
    },
    {
      filename: 'example-app/twisted-path/some-controller.js',
      code: `export default Controller.extend({
        queryParams: [],
        currentUser: service()
      });`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `
        export default Controller.extend({
          foo: service(),
          actions: {
            onKeyPress: function (event) {}
          },
          init() {
            this._super(...arguments);
          }
        });
      `,
      errors: [
        {
          message: 'The "init" lifecycle hook should be above the actions hash on line 4',
          line: 7,
        },
      ],
    },
    {
      code: `
        export default Controller.extend({
          foo: service(),
          customFoo() {},
          init() {
            this._super(...arguments);
          }
        });
      `,
      errors: [
        {
          message:
            'The "init" lifecycle hook should be above the "customFoo" empty method on line 4',
          line: 5,
        },
      ],
    },
    {
      code: `
        export default Controller.extend({
          init() {
            this._super(...arguments);
          },
          foo: service()
        });
      `,
      errors: [
        {
          message:
            'The "foo" service injection should be above the "init" lifecycle hook on line 3',
          line: 6,
        },
      ],
    },
    {
      code: `
        export default Controller.extend({
          init() {
            this._super(...arguments);
          },
          someProp: null
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
      code:
        // whitespace is preserved inside `` and it's breaking the test
        `export default Controller.extend({
  queryParams: [],
  currentUser: service(),
});`,
      output: `export default Controller.extend({
  currentUser: service(),
  queryParams: [],
});`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 2',
          line: 3,
        },
      ],
    },
    {
      code: `export default Controller.extend({
        test: "asd",
        queryParams: [],
        actions: {}
      });`,
      output: `export default Controller.extend({
        queryParams: [],
        test: "asd",
        actions: {}
      });`,
      errors: [
        {
          message: 'The "queryParams" property should be above the "test" property on line 2',
          line: 3,
        },
      ],
    },
  ],
});
