const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-restricted-service-injections');

const { DEFAULT_ERROR_MESSAGE } = rule;

const EMBER_IMPORT = "import Ember from 'ember';";
const SERVICE_IMPORT = "import {inject as service} from '@ember/service';";

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-restricted-service-injections', rule, {
  valid: [
    {
      // Service name doesn't match (with property name):
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
      filename: 'app/components/path.js',
    },
    {
      // Service name doesn't match (with property name):
      code: `${EMBER_IMPORT} Component.extend({ myService: Ember.inject.service() })`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
      filename: 'app/components/path.js',
    },
    {
      // Service name doesn't match (with string argument):
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('myService') })`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
      filename: 'app/components/path.js',
    },
    {
      // Service name doesn't match (with string argument):
      code: `${EMBER_IMPORT} Component.extend({ randomName: Ember.inject.service('myService') })`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
      filename: 'app/components/path.js',
    },
    {
      // Service name doesn't match (with decorator)
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service('myService') randomName }`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
      filename: 'app/components/path.js',
    },
    {
      // Service scope doesn't match:
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('scope/myService') })`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      filename: 'app/components/path.js',
    },
    {
      // File path doesn't match:
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      options: [{ paths: ['other/path'], services: ['my-service'] }],
      filename: 'app/components/path.js',
    },
    {
      // Not the service decorator:
      code: `${SERVICE_IMPORT} Component.extend({ myService: otherDecorator() })`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      filename: 'app/components/path.js',
    },
    {
      // Ignores injection due to dynamic variable usage:
      code: `${SERVICE_IMPORT} Component.extend({ myService: service(SOME_VARIABLE) })`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      filename: 'app/components/path.js',
    },
  ],
  invalid: [
    {
      // Without service name argument:
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // Without service name argument (property name as string literal):
      code: `${SERVICE_IMPORT} Component.extend({ 'myService': service() })`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With camelized service name argument:
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('myService') })`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With dasherized service name argument:
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('my-service') })`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With nested, camelized service name:
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('scope/myService') })`,
      options: [{ paths: ['app/components'], services: ['scope/my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With nested, dasherized service name:
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('scope/my-service') })`,
      options: [{ paths: ['app/components'], services: ['scope/my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With decorator with camelized service name argument:
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service('myService') randomName }`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'ClassProperty' }],
    },
    {
      // With decorator with dasherized service name argument:
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service('my-service') randomName }`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'ClassProperty' }],
    },
    {
      // With decorator without service name argument (without parentheses):
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service myService }`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'ClassProperty' }],
    },
    {
      // With decorator without service name argument (with parentheses):
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service() myService }`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'ClassProperty' }],
    },
    {
      // With decorator without service name argument (with parentheses) (with property name as string literal):
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service() 'myService' }`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'ClassProperty' }],
    },
    {
      // With custom error message:
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      options: [
        {
          paths: ['app/components'],
          services: ['my-service'],
          message: 'my-service is deprecated, please do not use it.',
        },
      ],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: 'my-service is deprecated, please do not use it.', type: 'Property' }],
    },
    {
      // With multiple violations:
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      options: [
        { paths: ['app/components'], services: ['my-service'], message: 'Error 1' },
        { paths: ['app/components'], services: ['my-service'], message: 'Error 2' },
      ],
      output: null,
      filename: 'app/components/path.js',
      errors: [
        { message: 'Error 1', type: 'Property' },
        { message: 'Error 2', type: 'Property' },
      ],
    },
    {
      // Without specifying any paths (should match any path):
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      options: [{ services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
  ],
});
