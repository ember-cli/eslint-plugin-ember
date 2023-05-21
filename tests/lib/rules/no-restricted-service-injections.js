const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-restricted-service-injections');

const { DEFAULT_ERROR_MESSAGE } = rule;

const EMBER_IMPORT = "import Ember from 'ember';";
const INJECT_IMPORT = "import {inject} from '@ember/service';";
const SERVICE_IMPORT = "import {inject as service} from '@ember/service';";
const NEW_SERVICE_IMPORT = "import {service} from '@ember/service';";

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-restricted-service-injections', rule, {
  valid: [
    {
      // Service name doesn't match (with property name):
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
    },
    {
      // Service name doesn't match (with property name):
      filename: 'app/components/path.js',
      code: `${INJECT_IMPORT} Component.extend({ myService: inject() })`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
    },
    {
      // Service name doesn't match (with property name):
      filename: 'app/components/path.js',
      code: `${EMBER_IMPORT} Component.extend({ myService: Ember.inject.service() })`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
    },
    {
      // Service name doesn't match (with string argument):
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('myService') })`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
    },
    {
      // Service name doesn't match (with string argument):
      filename: 'app/components/path.js',
      code: `${EMBER_IMPORT} Component.extend({ randomName: Ember.inject.service('myService') })`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
    },
    {
      // Service name doesn't match (with decorator)
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service('myService') randomName }`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
    },
    {
      // Service name doesn't match (with decorator and new import)
      filename: 'app/components/path.js',
      code: `${NEW_SERVICE_IMPORT} class MyComponent extends Component { @service('myService') randomName }`,
      options: [{ paths: ['app/components'], services: ['abc'] }],
    },
    {
      // Service scope doesn't match:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('scope/myService') })`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
    },
    {
      // File path doesn't match:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      options: [{ paths: ['other/path'], services: ['my-service'] }],
    },
    {
      // Not the service decorator:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ myService: otherDecorator() })`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
    },
    {
      // Ignores injection due to dynamic variable usage:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ myService: service(SOME_VARIABLE) })`,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
    },
  ],
  invalid: [
    {
      // Without service name argument:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // Without service name argument and new import:
      filename: 'app/components/path.js',
      code: `${NEW_SERVICE_IMPORT} Component.extend({ myService: service() })`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // Without service name argument (property name as string literal):
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ 'myService': service() })`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With camelized service name argument:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('myService') })`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With dasherized service name argument:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('my-service') })`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With nested, camelized service name:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('scope/myService') })`,
      output: null,
      options: [{ paths: ['app/components'], services: ['scope/my-service'] }],
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With nested, dasherized service name:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ randomName: service('scope/my-service') })`,
      output: null,
      options: [{ paths: ['app/components'], services: ['scope/my-service'] }],
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With decorator with camelized service name argument:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service('myService') randomName }`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [
        {
          message: DEFAULT_ERROR_MESSAGE,
          // type could be ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8)
        },
      ],
    },
    {
      // With decorator with camelized service name argument (inject):
      filename: 'app/components/path.js',
      code: `${INJECT_IMPORT} class MyComponent extends Component { @inject('myService') randomName }`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [
        {
          message: DEFAULT_ERROR_MESSAGE,
          // type could be ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8)
        },
      ],
    },
    {
      // With decorator with dasherized service name argument:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service('my-service') randomName }`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [
        {
          message: DEFAULT_ERROR_MESSAGE,
          // type could be ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8)
        },
      ],
    },
    {
      // With decorator without service name argument (without parentheses):
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service myService }`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [
        {
          message: DEFAULT_ERROR_MESSAGE,
          // type could be ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8)
        },
      ],
    },
    {
      // With decorator without service name argument (with parentheses):
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service() myService }`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [
        {
          message: DEFAULT_ERROR_MESSAGE,
          // type could be ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8)
        },
      ],
    },
    {
      // With decorator without service name argument (with parentheses) (with property name as string literal):
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} class MyComponent extends Component { @service() 'myService' }`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [
        {
          message: DEFAULT_ERROR_MESSAGE,
          // type could be ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8)
        },
      ],
    },
    {
      // With chained decorator
      filename: 'app/components/path.js',
      code: `${EMBER_IMPORT} class MyComponent extends Component { @Ember.inject.service('myService') randomName }`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [
        {
          message: DEFAULT_ERROR_MESSAGE,
          // type could be ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8)
        },
      ],
    },
    {
      // With custom error message:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      output: null,
      options: [
        {
          paths: ['app/components'],
          services: ['my-service'],
          message: 'my-service is deprecated, please do not use it.',
        },
      ],
      errors: [{ message: 'my-service is deprecated, please do not use it.', type: 'Property' }],
    },
    {
      // With multiple violations:
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      output: null,
      options: [
        { paths: ['app/components'], services: ['my-service'], message: 'Error 1' },
        { paths: ['app/components'], services: ['my-service'], message: 'Error 2' },
      ],
      errors: [
        { message: 'Error 1', type: 'Property' },
        { message: 'Error 2', type: 'Property' },
      ],
    },
    {
      // Without specifying any paths (should match any path):
      filename: 'app/components/path.js',
      code: `${SERVICE_IMPORT} Component.extend({ myService: service() })`,
      output: null,
      options: [{ services: ['my-service'] }],
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },

    {
      // TypeScript annotated injection (TypeScript).
      code: `
      import Route from '@ember/routing/route';
      ${INJECT_IMPORT}
      import type Store from '@ember-data/store';
      export default class ApplicationRoute extends Route {
        @inject declare store: Store;
      }
      `,
      output: null,
      options: [{ services: ['store'] }],
      parser: require.resolve('@typescript-eslint/parser'),
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'PropertyDefinition' }],
    },
    {
      // inject.service() decorator
      filename: 'app/components/path.js',
      code: `${INJECT_IMPORT} class MyComponent extends Component { @inject.service('myService') randomName }`,
      output: null,
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'PropertyDefinition' }],
    },
  ],
});
