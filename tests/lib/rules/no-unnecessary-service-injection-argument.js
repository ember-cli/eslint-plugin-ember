//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unnecessary-service-injection-argument');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-unnecessary-service-injection-argument', rule, {
  valid: [
    // No argument:
    'export default Component.extend({ serviceName: service() });',
    'export default Component.extend({ serviceName: inject() });',
    'const controller = Controller.extend({ serviceName: service() });',

    // Property name matches service name but service name uses dashes
    // (allowed because it avoids needless runtime camelization <-> dasherization in the resolver):
    "export default Component.extend({ specialName: service('service-name') });",
    "export default Component.extend({ specialName: inject('service-name') });",
    "const controller = Controller.extend({ serviceName: service('service-name') });",

    // Property name does not match service name:
    "export default Component.extend({ specialName: service('service-name') });",
    "export default Component.extend({ specialName: inject('service-name') });",
    "const controller = Controller.extend({ specialName: service('service-name') });",

    // When usage is ignored because of additional arguments:
    "export default Component.extend({ serviceName: service('serviceName', EXTRA_PROPERTY) });",
    "export default Component.extend({ serviceName: inject('serviceName', EXTRA_PROPERTY) });",

    // Not Ember's `service()` function:
    "export default Component.extend({ serviceName: otherFunction('serviceName') });",
    "export default Component.extend({ serviceName: service.otherFunction('serviceName') });",
    "export default Component.extend({ serviceName: inject.otherFunction('serviceName') });",
  ],
  invalid: [
    // `Component` examples:
    {
      code: "export default Component.extend({ serviceName: service('serviceName') });",
      output: 'export default Component.extend({ serviceName: service() });',
      errors: [{ message: ERROR_MESSAGE, type: 'Literal' }],
    },
    {
      code: "export default Component.extend({ serviceName: inject('serviceName') });",
      output: 'export default Component.extend({ serviceName: inject() });',
      errors: [{ message: ERROR_MESSAGE, type: 'Literal' }],
    },

    // `Controller` examples:
    {
      code: "const controller = Controller.extend({ serviceName: service('serviceName') });",
      output: 'const controller = Controller.extend({ serviceName: service() });',
      errors: [{ message: ERROR_MESSAGE, type: 'Literal' }],
    },
    {
      code: "const controller = Controller.extend({ serviceName: inject('serviceName') });",
      output: 'const controller = Controller.extend({ serviceName: inject() });',
      errors: [{ message: ERROR_MESSAGE, type: 'Literal' }],
    },
  ],
});
