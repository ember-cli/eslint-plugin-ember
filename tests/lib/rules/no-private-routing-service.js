//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-private-routing-service');
const RuleTester = require('eslint').RuleTester;

const {
  PRIVATE_ROUTING_SERVICE_ERROR_MESSAGE,
  ROUTER_MICROLIB_ERROR_MESSAGE,
  ROUTER_MAIN_ERROR_MESSAGE,
} = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-private-routing-service', rule, {
  valid: [
    // Classic
    "export default Component.extend({ someService: service('routing') });",
    "export default Component.extend({ someService: service('-router') });",
    "export default Component.extend({ '-routing': service('routing') });",
    "export default Component.extend({ '-routing': service('-router') });",
    "Component.extend({ routing: someOtherFunction('-routing') });",
    'export default Component.extend({ someService: service() });',
    'export default Component.extend({ notAService: "a value" });',
    'export default Component.extend({ anInt: 25 });',

    // Octane
    'export default class MyComponent extends Component { @service router; }',
    "export default class MyComponent extends Component { @service('router') routing; }",
    'export default class MyComponent extends Component { @service routing; }',
    "export default class MyComponent extends Component { @service('routing') routing; }",
    `
    export default class MyComponent extends Component {
      @computed('-routing', 'lastName')
        get fullName() {
        return \`${this.firstName} ${this.lastName}\`;
      }
    }
    `,
    'class MyComponent extends Component { @service() routing; }',
    'class MyComponent extends Component { @service() notRouting; }',
    'class MyComponent extends Component { aProp="routing"; }',
    'class MyComponent extends Component { aProp="-routing"; }',
    'class MyComponent extends Component { aProp="another value"; }',
    'class MyComponent extends Component { anIntProp=25; }',

    // _routerMicrolib
    "get(this, 'router._routerMicrolib');",
    'this.router._routerMicrolib;',
    { code: "get(this, 'router.somethingElse');", options: [{ catchRouterMicrolib: true }] },
    { code: 'this.router.somethingElse;', options: [{ catchRouterMicrolib: true }] },

    // router:main
    "getOwner(this).lookup('router:main');",
    "owner.lookup('router:main');",
    "this.owner.lookup('router:main');",
    {
      code: "getOwner(this).lookup('router:somethingElse');",
      options: [{ catchRouterMicrolib: true }],
    },
    {
      code: "owner.lookup('router:somethingElse');",
      options: [{ catchRouterMicrolib: true }],
    },
    {
      code: "this.owner.lookup('router:somethingElse');",
      options: [{ catchRouterMicrolib: true }],
    },
  ],
  invalid: [
    // Classic
    {
      code: "export default Component.extend({ routing: service('-routing') });",
      output: null,
      errors: [{ message: PRIVATE_ROUTING_SERVICE_ERROR_MESSAGE, type: 'Property' }],
    },

    // Octane
    {
      code: "export default class MyComponent extends Component { @service('-routing') routing; }",
      output: null,
      errors: [{ message: PRIVATE_ROUTING_SERVICE_ERROR_MESSAGE, type: 'ClassProperty' }],
    },

    // _routerMicrolib (`catchRouterMicrolib` option on)
    {
      code: "get(this, 'router._routerMicrolib');",
      output: null,
      options: [{ catchRouterMicrolib: true }],
      errors: [{ message: ROUTER_MICROLIB_ERROR_MESSAGE, type: 'Literal' }],
    },
    {
      code: "get(this, 'router._router._routerMicrolib');",
      output: null,
      options: [{ catchRouterMicrolib: true }],
      errors: [{ message: ROUTER_MICROLIB_ERROR_MESSAGE, type: 'Literal' }],
    },
    {
      code: 'this.router._routerMicrolib;',
      output: null,
      options: [{ catchRouterMicrolib: true }],
      errors: [{ message: ROUTER_MICROLIB_ERROR_MESSAGE, type: 'Identifier' }],
    },
    {
      code: 'this.router._router._routerMicrolib;',
      output: null,
      options: [{ catchRouterMicrolib: true }],
      errors: [{ message: ROUTER_MICROLIB_ERROR_MESSAGE, type: 'Identifier' }],
    },

    // router:main (`catchRouterMain` option on)
    {
      code: "getOwner(this).lookup('router:main');",
      output: null,
      options: [{ catchRouterMain: true }],
      errors: [{ message: ROUTER_MAIN_ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "owner.lookup('router:main');",
      output: null,
      options: [{ catchRouterMain: true }],
      errors: [{ message: ROUTER_MAIN_ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "this.owner.lookup('router:main');",
      output: null,
      options: [{ catchRouterMain: true }],
      errors: [{ message: ROUTER_MAIN_ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      // Optional chaining.
      code: "this?.owner?.lookup?.('router:main');",
      output: null,
      options: [{ catchRouterMain: true }],
      errors: [{ message: ROUTER_MAIN_ERROR_MESSAGE, type: 'OptionalCallExpression' }],
    },
  ],
});
