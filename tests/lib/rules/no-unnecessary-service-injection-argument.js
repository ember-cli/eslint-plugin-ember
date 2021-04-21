//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unnecessary-service-injection-argument');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

const EMBER_IMPORT = "import Ember from 'ember';";
const SERVICE_IMPORT = "import {inject} from '@ember/service';";
const RENAMED_SERVICE_IMPORT = "import {inject as service} from '@ember/service';";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
  parser: require.resolve('babel-eslint'),
});

ruleTester.run('no-unnecessary-service-injection-argument', rule, {
  valid: [
    // No argument:
    `${EMBER_IMPORT} export default Component.extend({ serviceName: Ember.inject.service() });`,
    `${RENAMED_SERVICE_IMPORT} export default Component.extend({ serviceName: service() });`,
    `${SERVICE_IMPORT} export default Component.extend({ serviceName: inject() });`,
    `${RENAMED_SERVICE_IMPORT} const controller = Controller.extend({ serviceName: service() });`,
    {
      code: `${RENAMED_SERVICE_IMPORT} class Test { @service serviceName }`,
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
    {
      code: `${RENAMED_SERVICE_IMPORT} class Test { @service() serviceName }`,
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },

    // Property name matches service name but service name uses dashes
    // (allowed because it avoids needless runtime camelization <-> dasherization in the resolver):
    `${EMBER_IMPORT} export default Component.extend({ specialName: Ember.inject.service('service-name') });`,
    `${RENAMED_SERVICE_IMPORT} export default Component.extend({ specialName: service('service-name') });`,
    `${SERVICE_IMPORT} export default Component.extend({ specialName: inject('service-name') });`,
    `${RENAMED_SERVICE_IMPORT} const controller = Controller.extend({ serviceName: service('service-name') });`,
    {
      code: `${RENAMED_SERVICE_IMPORT} class Test { @service("service-name") serviceName }`,
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },

    // Property name does not match service name:
    `${EMBER_IMPORT} const controller = Controller.extend({ specialName: Ember.inject.service('service-name') });`,
    `${RENAMED_SERVICE_IMPORT} const controller = Controller.extend({ specialName: service('service-name') });`,
    {
      code: `${RENAMED_SERVICE_IMPORT} class Test { @service("specialName") serviceName }`,
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },

    // When usage is ignored because of additional arguments:
    `${EMBER_IMPORT} export default Component.extend({ serviceName: Ember.inject.service('serviceName', EXTRA_PROPERTY) });`,
    `${RENAMED_SERVICE_IMPORT} export default Component.extend({ serviceName: service('serviceName', EXTRA_PROPERTY) });`,
    `${SERVICE_IMPORT} export default Component.extend({ serviceName: inject('serviceName', EXTRA_PROPERTY) });`,

    // When usage is ignored because of template literal:
    `${EMBER_IMPORT} export default Component.extend({ serviceName: Ember.inject.service(\`serviceName\`) });`,
    `${SERVICE_IMPORT} export default Component.extend({ serviceName: service(\`serviceName\`) });`,
    {
      code: `${RENAMED_SERVICE_IMPORT} class Test { @service(\`specialName\`) serviceName }`,
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },

    // Not Ember's `service()` function:
    "export default Component.extend({ serviceName: otherFunction('serviceName') });",
    `${RENAMED_SERVICE_IMPORT} export default Component.extend({ serviceName: service.otherFunction('serviceName') });`,
    "export default Component.extend({ serviceName: inject.otherFunction('serviceName') });",
    {
      code: 'class Test { @otherDecorator("name") name }',
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },

    'export default Component.extend({ ...foo });',
  ],
  invalid: [
    // `Component` examples:
    {
      code: `${RENAMED_SERVICE_IMPORT} export default Component.extend({ serviceName: service('serviceName') });`,
      output: `${RENAMED_SERVICE_IMPORT} export default Component.extend({ serviceName: service() });`,
      errors: [{ message: ERROR_MESSAGE, type: 'Literal' }],
    },
    {
      code: `${SERVICE_IMPORT} export default Component.extend({ serviceName: inject('serviceName') });`,
      output: `${SERVICE_IMPORT} export default Component.extend({ serviceName: inject() });`,
      errors: [{ message: ERROR_MESSAGE, type: 'Literal' }],
    },

    // `Controller` examples:
    {
      code: `${RENAMED_SERVICE_IMPORT} const controller = Controller.extend({ serviceName: service('serviceName') });`,
      output: `${RENAMED_SERVICE_IMPORT} const controller = Controller.extend({ serviceName: service() });`,
      errors: [{ message: ERROR_MESSAGE, type: 'Literal' }],
    },
    {
      code: `${SERVICE_IMPORT} const controller = Controller.extend({ serviceName: inject('serviceName') });`,
      output: `${SERVICE_IMPORT} const controller = Controller.extend({ serviceName: inject() });`,
      errors: [{ message: ERROR_MESSAGE, type: 'Literal' }],
    },

    // Decorator:
    {
      code: `${RENAMED_SERVICE_IMPORT} class Test { @service("serviceName") serviceName }`,
      output: `${RENAMED_SERVICE_IMPORT} class Test { @service() serviceName }`,
      errors: [{ message: ERROR_MESSAGE, type: 'Literal' }],
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
  ],
});
