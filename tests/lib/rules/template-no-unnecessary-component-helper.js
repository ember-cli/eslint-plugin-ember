const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-unnecessary-component-helper');

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unnecessary-component-helper', rule, {
  valid: [
    // Angle bracket invocation
    '<template><MyComponent /></template>',

    // Dynamic component names (necessary use)
    '<template>{{component this.componentName}}</template>',
    '<template>{{component @componentName}}</template>',

    // No component helper
    '<template>{{my-helper}}</template>',

    // Dynamic component with extra args (MustacheStatement)
    '<template>{{component SOME_COMPONENT_NAME}}</template>',
    '<template>{{component SOME_COMPONENT_NAME SOME_ARG}}</template>',
    '<template>{{component SOME_COMPONENT_NAME "Hello World"}}</template>',

    // Regular component invocations (not using component helper)
    '<template>{{my-component "Hello world"}}</template>',
    '<template>{{my-component "Hello world" 123}}</template>',

    // Block statements with dynamic component name
    '<template>{{#component SOME_COMPONENT_NAME}}{{/component}}</template>',
    '<template>{{#component SOME_COMPONENT_NAME SOME_ARG}}{{/component}}</template>',
    '<template>{{#component SOME_COMPONENT_NAME "Hello World"}}{{/component}}</template>',

    // Regular block components (no component helper)
    '<template>{{#my-component}}{{/my-component}}</template>',
    '<template>{{#my-component "Hello world"}}{{/my-component}}</template>',
    '<template>{{#my-component "Hello world" 123}}{{/my-component}}</template>',

    // Dynamic in angle bracket attribute (valid - first param not string)
    '<template><Foo @bar={{component SOME_COMPONENT_NAME}} /></template>',
    '<template><Foo @bar={{component SOME_COMPONENT_NAME}}></Foo></template>',

    // Static args on angle bracket (no component helper)
    '<template><Foo @arg="foo" /></template>',

    // If expressions without (component) - should not trigger
    '<template><Foo @arg={{if this.user.isAdmin "admin"}} /></template>',
  ],
  invalid: [
    {
      code: '<template>{{component "my-component"}}</template>',
      output: '<template>{{my-component}}</template>',
      errors: [{ messageId: 'noUnnecessaryComponent' }],
    },
    {
      code: '<template>{{component "MyComponent"}}</template>',
      output: '<template>{{MyComponent}}</template>',
      errors: [{ messageId: 'noUnnecessaryComponent' }],
    },

    {
      code: '<template>{{component "my-component-name" foo=123 bar=456}}</template>',
      output: '<template>{{my-component-name foo=123 bar=456}}</template>',
      errors: [{ messageId: 'noUnnecessaryComponent' }],
    },
    {
      code: '<template>{{#component "my-component-name" foo=123 bar=456}}{{/component}}</template>',
      output: null,
      errors: [{ messageId: 'noUnnecessaryComponent' }],
    },
    {
      code: '<template><Foo @arg={{component "allowed-component"}}>{{component "forbidden-component"}}</Foo></template>',
      output: '<template><Foo @arg={{allowed-component}}>{{forbidden-component}}</Foo></template>',
      errors: [{ messageId: 'noUnnecessaryComponent' }, { messageId: 'noUnnecessaryComponent' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-unnecessary-component-helper', rule, {
  valid: [
    '{{component SOME_COMPONENT_NAME}}',
    '{{component SOME_COMPONENT_NAME SOME_ARG}}',
    '{{component SOME_COMPONENT_NAME "Hello World"}}',
    '{{my-component}}',
    '{{my-component "Hello world"}}',
    '{{my-component "Hello world" 123}}',
    '{{#component SOME_COMPONENT_NAME}}{{/component}}',
    '{{#component SOME_COMPONENT_NAME SOME_ARG}}{{/component}}',
    '{{#component SOME_COMPONENT_NAME "Hello World"}}{{/component}}',
    '{{#my-component}}{{/my-component}}',
    '{{#my-component "Hello world"}}{{/my-component}}',
    '{{#my-component "Hello world" 123}}{{/my-component}}',
    '(component SOME_COMPONENT_NAME)',
    '(component "my-component")',
    '<Foo @bar={{component SOME_COMPONENT_NAME}} />',
    '<Foo @bar={{component SOME_COMPONENT_NAME}}></Foo>',
    '<Foo @arg="foo" />',
    '<Foo class="foo" />',
    '<Foo data-test-bar="foo" />',
    '<Foo @arg={{if this.user.isAdmin "admin"}} />',
  ],
  invalid: [
    {
      code: '{{component "my-component-name" foo=123 bar=456}}',
      output: '{{my-component-name foo=123 bar=456}}',
      errors: [
        { message: 'Unnecessary use of (component) helper. Use the component name directly.' },
      ],
    },
    {
      code: '{{#component "my-component-name" foo=123 bar=456}}{{/component}}',
      output: null,
      errors: [
        { message: 'Unnecessary use of (component) helper. Use the component name directly.' },
      ],
    },
    {
      code: '<Foo @arg={{component "allowed-component"}}>{{component "forbidden-component"}}</Foo>',
      output: '<Foo @arg={{allowed-component}}>{{forbidden-component}}</Foo>',
      errors: [
        { message: 'Unnecessary use of (component) helper. Use the component name directly.' },
        { message: 'Unnecessary use of (component) helper. Use the component name directly.' },
      ],
    },
  ],
});
