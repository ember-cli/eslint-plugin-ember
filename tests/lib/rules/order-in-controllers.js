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
  parser: require.resolve('@babel/eslint-parser'),
});

eslintTester.run('order-in-controllers', rule, {
  valid: [
    'export default Controller.extend();',
    'export default Controller.extend({ ...foo });',
    `
      import {inject as service} from '@ember/service';
      export default Controller.extend({
        application: controller(),
        currentUser: service(),
        queryParams: [],
        customProp: "test",
        actions: {},
        _customAction() { const foo = 'bar'; },
        _customAction2: function() { const foo = 'bar'; },
        tSomeTask: task(function* () {})
      });`,
    `
      import {inject} from '@ember/service';
      export default Controller.extend({
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
      code: `
        import {inject as service} from '@ember/service';
        export default Controller.extend({
          queryParams: [],
          currentUser: service(),
        });
      `,
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
      import {inject as service} from '@ember/service';
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
      import {inject as service} from '@ember/service';
      export default Controller.extend({
        foo: service(),
        init() {
          this._super(...arguments);
        },
        customFoo() {}
      });
    `,
    `
      import {inject as service} from '@ember/service';
      export default Controller.extend({
        foo: service(),
        init() {
          this._super(...arguments);
        }
      });
    `,
    {
      code: `export default Controller.extend({
        prop: null,
        actions: {
          action: () => {}
        },
        customProp: { a: 1 }
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [
        {
          order: ['property', 'actions', 'custom:customProp'],
        },
      ],
    },
  ],
  invalid: [
    {
      code: `import {inject as service} from '@ember/service';
      export default Controller.extend({
        queryParams: [],
        currentUser: service()
      });`,
      output: `import {inject as service} from '@ember/service';
      export default Controller.extend({
        currentUser: service(),
              queryParams: [],
});`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 3',
          line: 4,
        },
      ],
    },
    {
      code: `import {inject} from '@ember/service';
      export default Controller.extend({
        queryParams: [],
        currentUser: inject()
      });`,
      output: `import {inject} from '@ember/service';
      export default Controller.extend({
        currentUser: inject(),
              queryParams: [],
});`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 3',
          line: 4,
        },
      ],
    },
    {
      code: `import {inject as service} from '@ember/service';
      export default Controller.extend({
        currentUser: service(),
        customProp: "test",
        queryParams: []
      });`,
      output: `import {inject as service} from '@ember/service';
      export default Controller.extend({
        currentUser: service(),
        queryParams: [],
              customProp: "test",
});`,
      errors: [
        {
          message: 'The "queryParams" property should be above the "customProp" property on line 4',
          line: 5,
        },
      ],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        actions: {},
        customProp: "test"
      });`,
      output: `export default Controller.extend({
        queryParams: [],
        customProp: "test",
              actions: {},
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
      output: `export default Controller.extend({
        queryParams: [],
        actions: {},
              _customAction() { const foo = 'bar'; },
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
    {
      code: `import {inject as service} from '@ember/service';
      export default Controller.extend({
        currentUser: service(),
        application: controller()
      });`,
      output: `import {inject as service} from '@ember/service';
      export default Controller.extend({
        application: controller(),
              currentUser: service(),
});`,
      errors: [
        {
          message:
            'The "application" controller injection should be above the "currentUser" service injection on line 3',
          line: 4,
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
      output: `export default Controller.extend({
        test: "asd",
        comp: computed("asd", function() {}),
        obs: observer("asd", function() {}),
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
      code: `import {inject as service} from '@ember/service';
      export default CustomController.extend({
        queryParams: [],
        currentUser: service()
      });`,
      output: `import {inject as service} from '@ember/service';
      export default CustomController.extend({
        currentUser: service(),
              queryParams: [],
});`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 3',
          line: 4,
        },
      ],
    },
    {
      filename: 'example-app/some-feature/controller.js',
      code: `import {inject as service} from '@ember/service';
      export default CustomController.extend({
        queryParams: [],
        currentUser: service()
      });`,
      output: `import {inject as service} from '@ember/service';
      export default CustomController.extend({
        currentUser: service(),
              queryParams: [],
});`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 3',
          line: 4,
        },
      ],
    },
    {
      filename: 'example-app/twisted-path/some-controller.js',
      code: `import {inject as service} from '@ember/service';
      export default Controller.extend({
        queryParams: [],
        currentUser: service()
      });`,
      output: `import {inject as service} from '@ember/service';
      export default Controller.extend({
        currentUser: service(),
              queryParams: [],
});`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 3',
          line: 4,
        },
      ],
    },
    {
      code: `
        import {inject as service} from '@ember/service';
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
      output: `
        import {inject as service} from '@ember/service';
        export default Controller.extend({
          foo: service(),
          init() {
            this._super(...arguments);
          },
                  actions: {
            onKeyPress: function (event) {}
          },
});
      `,
      errors: [
        {
          message: 'The "init" lifecycle hook should be above the actions hash on line 5',
          line: 8,
        },
      ],
    },
    {
      code: `
        import {inject as service} from '@ember/service';
        export default Controller.extend({
          foo: service(),
          customFoo() {},
          init() {
            this._super(...arguments);
          }
        });
      `,
      output: `
        import {inject as service} from '@ember/service';
        export default Controller.extend({
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
        export default Controller.extend({
          init() {
            this._super(...arguments);
          },
          foo: service()
        });
      `,
      output: `
        import {inject as service} from '@ember/service';
        export default Controller.extend({
          foo: service(),
                  init() {
            this._super(...arguments);
          },
});
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
        export default Controller.extend({
          init() {
            this._super(...arguments);
          },
          someProp: null
        });
      `,
      output: `
        export default Controller.extend({
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
      code:
        // whitespace is preserved inside `` and it's breaking the test
        `import {inject as service} from '@ember/service';
        export default Controller.extend({
  queryParams: [],
  currentUser: service(),
});`,
      output: `import {inject as service} from '@ember/service';
        export default Controller.extend({
  currentUser: service(),
  queryParams: [],
});`,
      errors: [
        {
          message:
            'The "currentUser" service injection should be above the "queryParams" property on line 3',
          line: 4,
        },
      ],
    },
    {
      code: `export default Controller.extend({
        customProp: { a: 1 },
        aMethod() {
          console.log('not empty');
        }
      });`,
      output: `export default Controller.extend({
        aMethod() {
          console.log('not empty');
        },
              customProp: { a: 1 },
});`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      options: [
        {
          order: ['method', 'custom:customProp'],
        },
      ],
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
