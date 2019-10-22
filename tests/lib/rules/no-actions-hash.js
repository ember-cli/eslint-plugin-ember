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
  ],

  invalid: [
    {
      code: `
        export default Component.extend({
          actions: {
          },
        });
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        export default class MyComponent extends Component {
          actions = {
            foo() {
            }
          }
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        export default Controller.extend({
          actions: {
          },
        });
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        export default class MyController extends Controller {
          actions = {
            foo() {
            }
          }
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        export default Route.extend({
          actions: {
          },
        });
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        export default class MyRoute extends Route {
          actions = {
            foo() {
            }
          }
        }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
  ],
});
