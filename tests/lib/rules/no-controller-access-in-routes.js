//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-controller-access-in-routes');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

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

ruleTester.run('no-controller-access-in-routes', rule, {
  valid: [
    `
      import Route from '@ember/routing/route';
      export default class MyRoute extends Route {
        setupController(controller, ...args) {
          super.setupController(controller, ...args);
          const foo = controller.foo;
        }
      }
    `,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        setupController(controller, ...args) {
          this._super(controller, ...args);
          const foo = controller.foo;
        }
      });
    `,
    `
      import Route from '@ember/routing/route';
      export default class MyRoute extends Route {
        resetController(controller, ...args) {
          super.resetController(controller, ...args);
          const foo = controller.foo;
        }
      }
    `,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        resetController(controller, ...args) {
          this._super(controller, ...args);
          const foo = controller.foo;
        }
      });
    `,

    `
      import Component from '@ember/component';
      import { action, get } from '@ember/object';
      export default class MyComponent extends Component {
        @action
        myAction() {
          const controller = this.controller;
        }
      }
    `,
    `
      import Route from '@ember/routing/route';
      export default class MyRoute extends Route {}
      this.controller;
      this.controllerFor('my');
    `,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({});
      this.controller;
      this.controllerFor('my');
    `,
    {
      code: `
        import Route from '@ember/routing/route';
        import { action } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const controller = this.controllerFor('my');
          }
        }
      `,
      options: [{ allowControllerFor: true }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          actions: {
            myAction() {
              const controller = this.controllerFor('my');
            },
          },
        });
      `,
      options: [{ allowControllerFor: true }],
    },
  ],
  invalid: [
    {
      code: `
        import Route from '@ember/routing/route';
        import { action } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const controller = this.controller;
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          actions: {
            myAction() {
              const controller = this.controller;
            },
          },
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        import { action } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const controller = this.controllerFor('my');
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        import { action } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const controller = this.controllerFor('my');
          }
        }
      `,
      options: [{ allowControllerFor: false }],
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        import { action } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const controller = this.get('controller');
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        import { action, get } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const controller = get(this, 'controller');
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        import { action, get as g } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const controller = g(this, 'controller');
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        import { action } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const { foo, controller } = this.getProperties('foo', 'controller');
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        import { action } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const { foo, controller } = this.getProperties(['foo', 'controller']);
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        import { action, getProperties } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const { foo, controller } = getProperties(this, 'foo', 'controller');
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        import { action, getProperties } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const { foo, controller } = getProperties(this, ['foo', 'controller']);
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        import { action, getProperties as gp } from '@ember/object';
        export default class MyRoute extends Route {
          @action
          myAction() {
            const { controller } = gp(this, 'controller');
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ],
});
