// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/order-in-controllers');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('order-in-controllers', rule, {
  valid: [
    {
      code: 'export default Controller.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Controller.extend({
        application: controller(),
        currentUser: service(),
        queryParams: [],
        customProp: "test",
        actions: {},
        _customAction() { const foo = 'bar'; },
        _customAction2: function() { const foo = 'bar'; },
        tSomeTask: task(function* () {})
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Controller.extend({
        currentUser: inject(),
        queryParams: [],
        customProp: "test",
        actions: {},
        _customAction() {},
        _customAction2: function() {},
        tSomeTask: task(function* () {})
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        customProp: "test",
        comp: computed("test", function() {}),
        obs: observer("asd", function() {}),
        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Controller.extend({
        customProp: "test",
        comp: computed("test", function() {}),
        comp2: computed("test", function() {
        }),
        actions: {},
        _customAction() { const foo = 'bar'; }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `export default Controller.extend({
        actions: {},
        comp: computed("test", function() {}),
        customProp: "test",
        comp2: computed("test", function() {
        }),
        _customAction() { const foo = 'bar'; }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [{
        order: [
          'actions',
          'single-line-function',
        ],
      }],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        currentUser: service(),
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [{
        order: [
          'query-params',
          'service',
        ],
      }],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        application: controller(),
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [{
        order: [
          'query-params',
          'controller',
        ],
      }],
    },
    {
      code: `
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      code: `
        export default Controller.extend({
          foo: service(),
          init() {
            this._super(...arguments);
          },
          customFoo() {}
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      code: `
        export default Controller.extend({
          foo: service(),
          init() {
            this._super(...arguments);
          }
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    }
  ],
  invalid: [
    {
      code: `export default Controller.extend({
        queryParams: [],
        currentUser: service()
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "currentUser" service injection should be above the "queryParams" property on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        currentUser: inject()
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "currentUser" service injection should be above the "queryParams" property on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Controller.extend({
        currentUser: service(),
        customProp: "test",
        queryParams: []
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "queryParams" property should be above the "customProp" property on line 3',
        line: 4,
      }],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        actions: {},
        customProp: "test"
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "customProp" property should be above the actions hash on line 3',
        line: 4,
      }],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        _customAction() { const foo = 'bar'; },
        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The actions hash should be above the "_customAction" method on line 3',
        line: 4,
      }],
    },
    {
      code: `export default Controller.extend({
        test: "asd",
        queryParams: [],
        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "queryParams" property should be above the "test" property on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        currentUser: service()
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "currentUser" service injection should be above the "queryParams" property on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Controller.extend({
        currentUser: service(),
        application: controller()
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "application" controller injection should be above the "currentUser" service injection on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Controller.extend({
        test: "asd",
        obs: observer("asd", function() {}),
        comp: computed("asd", function() {}),
        actions: {}
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "comp" single-line function should be above the "obs" observer on line 3',
        line: 4,
      }],
    },
    {
      filename: 'example-app/controllers/some-controller.js',
      code: `export default CustomController.extend({
        queryParams: [],
        currentUser: service()
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "currentUser" service injection should be above the "queryParams" property on line 2',
        line: 3,
      }],
    },
    {
      filename: 'example-app/some-feature/controller.js',
      code: `export default CustomController.extend({
        queryParams: [],
        currentUser: service()
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "currentUser" service injection should be above the "queryParams" property on line 2',
        line: 3,
      }],
    },
    {
      filename: 'example-app/twised-path/some-controller.js',
      code: `export default Controller.extend({
        queryParams: [],
        currentUser: service()
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "currentUser" service injection should be above the "queryParams" property on line 2',
        line: 3,
      }],
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "init" lifecycle hook should be above the actions hash on line 4',
        line: 7
      }]
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "init" lifecycle hook should be above the "customFoo" empty method on line 4',
        line: 5
      }]
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "foo" service injection should be above the "init" lifecycle hook on line 3',
        line: 6
      }]
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'The "someProp" property should be above the "init" lifecycle hook on line 3',
        line: 6
      }]
    },
  ],
});
