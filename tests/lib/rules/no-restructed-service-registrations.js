const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-restricted-service-registrations');

const { DEFAULT_ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-restricted-service-registrations', rule, {
  valid: [
    {
      // Service name doesn't match (with property name):
      code: `owner.register('service:foo')`,
      options: [{ services: ['abc'] }],
    },
    {
      // Namespace doesn't match
      code: `owner.register('model:abc')`,
      options: [{ services: ['abc'] }],
    },
  ],
  invalid: [
    // Basic test usage
    {
      code: `this.owner.register('service:router', null)`,
      output: null,
      errors: [{ message: `Cannot register the router service.` }],
    },
    // owner assigned to a variable
    {
      code: `let a = this.owner; a.register('service:router', null)`,
      output: null,
      errors: [{ message: `Cannot register the router service.` }],
    },
    // using getContext().owner
    {
      code: `import { getContext } from '@ember/test-helpers'; getContext().owner.register('service:router', null)`,
      output: null,
      errors: [{ message: `Cannot register the router service.` }],
    },
    // using getContext, but renamed
    {
      code: `import { getContext as a } from '@ember/test-helpers'; a().owner.register('service:router', null)`,
      output: null,
      errors: [{ message: `Cannot register the router service.` }],
    },
    // using { owner } = getContext()
    {
      code: `let { owner: a } = getContext(); a.register('service:router', null)`,
      output: null,
      errors: [{ message: `Cannot register the router service.` }],
    },
  ],
});
