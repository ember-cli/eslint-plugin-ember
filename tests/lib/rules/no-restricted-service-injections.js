const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-restricted-service-injections');

const { DEFAULT_ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-restricted-service-injections', rule, {
  valid: [
    {
      // Service name doesn't match (with property name):
      code: 'Component.extend({ myService: service() })',
      options: [{ paths: ['app/components'], services: ['abc'] }],
      filename: 'app/components/path.js',
    },
    {
      // Service name doesn't match (with string argument):
      code: "Component.extend({ randomName: service('myService') })",
      options: [{ paths: ['app/components'], services: ['abc'] }],
      filename: 'app/components/path.js',
    },
    {
      // Service name doesn't match (with decorator)
      code: "class MyComponent extends Component { @service('myService') randomName }",
      options: [{ paths: ['app/components'], services: ['abc'] }],
      filename: 'app/components/path.js',
    },
    {
      // Service scope doesn't match:
      code: "Component.extend({ randomName: service('scope/myService') })",
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      filename: 'app/components/path.js',
    },
    {
      // File path doesn't match:
      code: 'Component.extend({ myService: service() })',
      options: [{ paths: ['other/path'], services: ['my-service'] }],
      filename: 'app/components/path.js',
    },
    {
      // Not the service decorator:
      code: 'Component.extend({ myService: otherDecorator() })',
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      filename: 'app/components/path.js',
    },
    {
      // Ignores injection due to dynamic variable usage:
      code: 'Component.extend({ myService: service(SOME_VARIABLE) })',
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      filename: 'app/components/path.js',
    },
  ],
  invalid: [
    {
      // Without service name argument:
      code: 'Component.extend({ myService: service() })',
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With camelized service name argument:
      code: "Component.extend({ randomName: service('myService') })",
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With dasherized service name argument:
      code: "Component.extend({ randomName: service('my-service') })",
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With nested, camelized service name:
      code: "Component.extend({ randomName: service('scope/myService') })",
      options: [{ paths: ['app/components'], services: ['scope/my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With nested, dasherized service name:
      code: "Component.extend({ randomName: service('scope/my-service') })",
      options: [{ paths: ['app/components'], services: ['scope/my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
    {
      // With decorator with camelized service name argument:
      code: "class MyComponent extends Component { @service('myService') randomName }",
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'ClassProperty' }],
    },
    {
      // With decorator with dasherized service name argument:
      code: "class MyComponent extends Component { @service('my-service') randomName }",
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'ClassProperty' }],
    },
    {
      // With decorator without service name argument (without parentheses):
      code: 'class MyComponent extends Component { @service myService }',
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'ClassProperty' }],
    },
    {
      // With decorator without service name argument (with parentheses):
      code: 'class MyComponent extends Component { @service() myService }',
      options: [{ paths: ['app/components'], services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'ClassProperty' }],
    },
    {
      // With custom error message:
      code: 'Component.extend({ myService: service() })',
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
      code: 'Component.extend({ myService: service() })',
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
      code: 'Component.extend({ myService: service() })',
      options: [{ services: ['my-service'] }],
      output: null,
      filename: 'app/components/path.js',
      errors: [{ message: DEFAULT_ERROR_MESSAGE, type: 'Property' }],
    },
  ],
});
