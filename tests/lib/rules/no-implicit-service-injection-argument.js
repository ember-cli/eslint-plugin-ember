//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-implicit-service-injection-argument');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

const EMBER_IMPORT = "import Ember from 'ember';";
const INJECT_IMPORT = "import {inject} from '@ember/service';";
const SERVICE_IMPORT = "import {inject as service} from '@ember/service';";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: { legacyDecorators: true },
  },
  parser: require.resolve('@babel/eslint-parser'),
});

ruleTester.run('no-implicit-service-injection-argument', rule, {
  valid: [
    // With argument (classic class):
    `${EMBER_IMPORT} export default Component.extend({ serviceName: Ember.inject.service('serviceName') });`,
    `${INJECT_IMPORT} export default Component.extend({ serviceName: inject('serviceName') });`,
    `${SERVICE_IMPORT} export default Component.extend({ serviceName: service('serviceName') });`,
    `${SERVICE_IMPORT} export default Component.extend({ serviceName: service('service-name') });`,
    `${SERVICE_IMPORT} export default Component.extend({ serviceName: service('random') });`,
    `${SERVICE_IMPORT} export default Component.extend({ serviceName: service(\`service-name\`) });`,

    // With argument (native class)
    `${SERVICE_IMPORT} class Test { @service('service-name') serviceName }`,

    // Not Ember's `service()` function (classic class):
    'export default Component.extend({ serviceName: otherFunction() });',
    `${SERVICE_IMPORT} export default Component.extend({ serviceName: service.foo() });`,

    // Not Ember's `service()` function (native class):
    `${SERVICE_IMPORT} class Test { @otherDecorator() name }`,
    `${SERVICE_IMPORT} class Test { @service.foo() name }`,
    `${SERVICE_IMPORT} class Test { @foo.service() name }`,

    // Spread syntax
    'export default Component.extend({ ...foo });',
  ],
  invalid: [
    // Classic class
    {
      // `service` import
      code: `${SERVICE_IMPORT} export default Component.extend({ serviceName: service() });`,
      output: `${SERVICE_IMPORT} export default Component.extend({ serviceName: service('service-name') });`,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      // `inject` import
      code: `${INJECT_IMPORT} export default Component.extend({ serviceName: inject() });`,
      output: `${INJECT_IMPORT} export default Component.extend({ serviceName: inject('service-name') });`,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      // Property name in string literal.
      code: `${SERVICE_IMPORT} export default Component.extend({ 'serviceName': service() });`,
      output: `${SERVICE_IMPORT} export default Component.extend({ 'serviceName': service('service-name') });`,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },

    // Decorator:
    {
      code: `${SERVICE_IMPORT} class Test { @service() serviceName }`,
      output: `${SERVICE_IMPORT} class Test { @service('service-name') serviceName }`,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      // Decorator with no parenthesis
      code: `${SERVICE_IMPORT} class Test { @service serviceName }`,
      output: `${SERVICE_IMPORT} class Test { @service('service-name') serviceName }`,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },
    {
      // No normalization needed.
      code: `${SERVICE_IMPORT} class Test { @service() foo }`,
      output: `${SERVICE_IMPORT} class Test { @service('foo') foo }`,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      // Scoped/nested service name with property name in string literal.
      code: `${SERVICE_IMPORT} class Test { @service() 'myScope/myService' }`,
      output: `${SERVICE_IMPORT} class Test { @service('my-scope/my-service') 'myScope/myService' }`,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ],
});
