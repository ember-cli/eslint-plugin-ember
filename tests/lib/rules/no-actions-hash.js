//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-actions-hash');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
ruleTester.run('no-actions-hash', rule, {
  valid: [
    `
      import Component from '@ember/component';
      export default Component.extend({
        foo: action(function() {})
      });
    `,
    `
      import Component from '@ember/component';
      export default class MyComponent extends Component {
        @action
        foo() {}
      }
    `,
    `
      import Controller from '@ember/controller';
      export default Controller.extend({
        foo: action(function() {})
      });
    `,
    `
      import Controller from '@ember/controller';
      export default class MyController extends Controller {
        @action
        foo() {}
      }
    `,
    `
      import Route from '@ember/routing/route';
      export default Route.extend({
        foo: action(function() {})
      });
    `,
    `
      import Route from '@ember/routing/route';
      export default class MyRoute extends Route {
        @action
        foo() {}
      }
    `,
    `
      export default class MyLovelyClass extends LovelyClass {
        actions = {
          foo() {
          }
        }
      }
    `,
    `
      import Service from '@ember/service';
      export default Service.extend({
        actions: {
        },
      });
    `,
  ],

  invalid: [
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          actions: {
          },
        });
      `,
      errors: [{ type: 'Property', message: ERROR_MESSAGE }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default class MyComponent extends Component {
          actions = {
            foo() {
            }
          }
        }
      `,
      errors: [{ type: 'ClassProperty', message: ERROR_MESSAGE }],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend({
          actions: {
          },
        });
      `,
      errors: [{ type: 'Property', message: ERROR_MESSAGE }],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default class MyController extends Controller {
          actions = {
            foo() {
            }
          }
        }
      `,
      errors: [{ type: 'ClassProperty', message: ERROR_MESSAGE }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default Route.extend({
          actions: {
          },
        });
      `,
      errors: [{ type: 'Property', message: ERROR_MESSAGE }],
    },
    {
      code: `
        import Route from '@ember/routing/route';
        export default class MyRoute extends Route {
          actions = {
            foo() {
            }
          }
        }
      `,
      errors: [{ type: 'ClassProperty', message: ERROR_MESSAGE }],
    },
  ],
});
