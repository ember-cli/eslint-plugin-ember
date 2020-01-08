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
      export default Component.extend({
        foo: action(function() {})
      });
    `,
    `
      export default class MyComponent extends Component {
        @action
        foo() {}
      }
    `,
    `
      export default Controller.extend({
        foo: action(function() {})
      });
    `,
    `
      export default class MyController extends Controller {
        @action
        foo() {}
      }
    `,
    `
      export default Route.extend({
        foo: action(function() {})
      });
    `,
    `
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
      export default Service.extend({
        actions: {
        },
      });
    `,
  ],

  invalid: [
    {
      code: `
        export default Component.extend({
          actions: {
          },
        });
      `,
      output: null,
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
      output: null,
      errors: [{ type: 'ClassProperty', message: ERROR_MESSAGE }],
    },
    {
      code: `
        export default Controller.extend({
          actions: {
          },
        });
      `,
      output: null,
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
      output: null,
      errors: [{ type: 'ClassProperty', message: ERROR_MESSAGE }],
    },
    {
      code: `
        export default Route.extend({
          actions: {
          },
        });
      `,
      output: null,
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
      output: null,
      errors: [{ type: 'ClassProperty', message: ERROR_MESSAGE }],
    },
  ],
});
