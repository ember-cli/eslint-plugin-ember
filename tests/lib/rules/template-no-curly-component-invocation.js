const rule = require('../../../lib/rules/template-no-curly-component-invocation');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

function generateError(name) {
  const parts = name.split('/');
  const angleBracketName = parts
    .map((part) => {
      return part
        .split('-')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join('');
    })
    .join('::');
  return `You are using the component {{${name}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${name}'] }\`.`;
}

ruleTester.run('template-no-curly-component-invocation', rule, {
  valid: [
    '<template>{{foo}}</template>',
    '<template>{{foo.bar}}</template>',
    '<template>{{42}}</template>',
    '<template>{{true}}</template>',
    '<template>{{foo bar}}</template>',
    '<template>{{#each items as |item|}}{{item}}{{/each}}</template>',
    '<template>{{#if someProperty}}yay{{/if}}</template>',
    '<template><FooBar /></template>',
    '<template>{{#some-component foo="bar"}}foo{{/some-component}}</template>',
    {
      code: '<template>{{foo-bar}}</template>',
      options: [{ allow: ['foo-bar'] }],
    },
  ],
  invalid: [
    {
      code: '<template>{{foo-bar}}</template>',
      output: null,
      errors: [
        {
          message: generateError('foo-bar'),
        },
      ],
    },
    {
      code: '<template>{{nested/component}}</template>',
      output: null,
      errors: [
        {
          message: generateError('nested/component'),
        },
      ],
    },
    {
      code: '<template>{{#foo-bar}}content{{/foo-bar}}</template>',
      output: null,
      errors: [
        {
          message:
            "You are using the component {{#foo-bar}} with curly component syntax. You should use <FooBar> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. `'no-curly-component-invocation': { allow: ['foo-bar'] }`.",
        },
      ],
    },
    {
      code: '<template>{{#foo-bar}}{{/foo-bar}}</template>',
      output: null,
      errors: [
        {
          message:
            "You are using the component {{#foo-bar}} with curly component syntax. You should use <FooBar> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. `'no-curly-component-invocation': { allow: ['foo-bar'] }`.",
        },
      ],
    },
    {
      code: '<template>{{#foo-bar/baz/boo-foo}}block{{/foo-bar/baz/boo-foo}}</template>',
      output: null,
      errors: [
        {
          message:
            "You are using the component {{#foo-bar/baz/boo-foo}} with curly component syntax. You should use <FooBar::Baz::BooFoo> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. `'no-curly-component-invocation': { allow: ['foo-bar/baz/boo-foo'] }`.",
        },
      ],
    },
    {
      code: '<template>{{foo}}</template>',
      output: null,
      options: [{ disallow: ['foo'] }],
      errors: [
        {
          message: generateError('foo'),
        },
      ],
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

function generateBlockError(name) {
  const parts = name.split('/');
  const angleBracketName = parts
    .map((part) => {
      return part
        .split('-')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join('');
    })
    .join('::');
  return `You are using the component {{#${name}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${name}'] }\`.`;
}

function generateThisBlockError(name) {
  const displayName = name.replace(/^(this\.|@)/, '');
  const parts = displayName.split('/');
  const prefix = name.startsWith('@') ? '@' : name.startsWith('this.') ? 'This.' : '';
  let angleBracketName;
  if (name.startsWith('@')) {
    angleBracketName =
      '@' +
      parts[0]
        .split('-')
        .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
        .join('');
  } else if (name.startsWith('this.')) {
    angleBracketName =
      'This.' +
      parts[0]
        .split('-')
        .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
        .join('');
  } else {
    angleBracketName = parts
      .map((part) =>
        part
          .split('-')
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join('')
      )
      .join('::');
  }
  return `You are using the component {{#${name}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${name}'] }\`.`;
}

hbsRuleTester.run('template-no-curly-component-invocation', rule, {
  valid: [
    // Simple expressions (no dash = not a component)
    '{{foo}}',
    '{{foo.bar}}',
    '{{model.selectedTransfersCount}}',
    '{{request.note}}',
    // Built-in helpers / keywords
    '{{#each items as |item|}}{{item}}{{/each}}',
    '{{#each items as |item|}}{{item.foo}}{{/each}}',
    '{{42}}',
    '{{true}}',
    '{{undefined}}',
    '{{"foo-bar"}}',
    '{{foo bar}}',
    '<div {{foo}} />',
    '<Foo @bar={{baz}} />',
    '{{#foo bar}}{{/foo}}',
    '{{#foo}}bar{{else}}baz{{/foo}}',
    '{{array}}',
    '{{concat}}',
    '{{debugger}}',
    '{{has-block}}',
    '{{has-block-params}}',
    '{{hasBlock}}',
    '{{hash}}',
    '{{outlet}}',
    '{{unique-id}}',
    '{{yield}}',
    '{{yield to="inverse"}}',
    '{{app-version}}',
    '{{app-version versionOnly=true}}',
    '<GoodCode />',
    '<GoodCode></GoodCode>',
    '{{if someProperty "yay"}}',
    '<Nested::GoodCode />',
    '<Nested::GoodCode @someProperty={{-50}} @someProperty="-50" @someProperty={{true}} />',
    '{{some-valid-helper param}}',
    '{{some/valid-nested-helper param}}',
    '{{@someArg}}',
    '{{this.someProperty}}',
    '{{#-in-element destinationElement}}Hello{{/-in-element}}',
    '{{#in-element destinationElement}}Hello{{/in-element}}',
    '{{#some-component foo="bar"}}foo{{else}}bar{{/some-component}}',
    '<MyComponent @arg={{my-helper this.foobar}} />',
    '<MyComponent @arg="{{my-helper this.foobar}}" />',
    '<MyComponent {{my-modifier this.foobar}} />',
    '{{svg-jar "status"}}',
    '{{t "some.translation.key"}}',
    '{{#animated-if condition}}foo{{/animated-if}}',
    // Allow config
    {
      code: '{{aaa-bbb}}',
      options: [{ allow: ['aaa-bbb', 'aaa/bbb'] }],
    },
    {
      code: '{{aaa/bbb}}',
      options: [{ allow: ['aaa-bbb', 'aaa/bbb'] }],
    },
    {
      code: '{{aaa-bbb bar=baz}}',
      options: [{ allow: ['aaa-bbb', 'aaa/bbb'] }],
    },
    {
      code: '{{#aaa-bbb bar=baz}}{{/aaa-bbb}}',
      options: [{ allow: ['aaa-bbb', 'aaa/bbb'] }],
    },
  ],
  invalid: [
    {
      code: '{{foo-bar}}',
      output: null,
      errors: [{ message: generateError('foo-bar') }],
    },
    {
      code: '{{nested/component}}',
      output: null,
      errors: [{ message: generateError('nested/component') }],
    },
    {
      code: '{{#foo-bar}}{{/foo-bar}}',
      output: null,
      errors: [{ message: generateBlockError('foo-bar') }],
    },
    {
      code: '{{#foo-bar as |foo-baz|}}{{foo-baz}}{{/foo-bar}}',
      output: null,
      errors: [
        { message: generateBlockError('foo-bar') },
        { message: generateError('foo-baz') },
      ],
    },
    {
      code: '{{#foo-bar as |foo-baz|}}{{#foo-baz as |foo-boo|}}{{foo-boo}}{{/foo-baz}}{{/foo-bar}}',
      output: null,
      errors: [
        { message: generateBlockError('foo-bar') },
        { message: generateBlockError('foo-baz') },
        { message: generateError('foo-boo') },
      ],
    },
    {
      code: '{{#foo-bar as |foo-baz|}}{{foos-baz}}{{/foo-bar}}',
      output: null,
      errors: [
        { message: generateBlockError('foo-bar') },
        { message: generateError('foos-baz') },
      ],
    },
    {
      code: '{{#this.foo-bar as |foo-baz|}}{{foos-baz}}{{/this.foo-bar}}',
      output: null,
      errors: [
        { message: generateThisBlockError('this.foo-bar') },
        { message: generateError('foos-baz') },
      ],
    },
    {
      code: '{{#this.fooBar as |foo-baz|}}{{foos-baz}}{{/this.fooBar}}',
      output: null,
      errors: [{ message: generateError('foos-baz') }],
    },
    {
      code: '{{#@foo-bar as |foo-baz|}}{{foos-baz}}{{/@foo-bar}}',
      output: null,
      errors: [
        { message: generateThisBlockError('@foo-bar') },
        { message: generateError('foos-baz') },
      ],
    },
    {
      code: '{{#@fooBar as |foo-baz|}}{{foos-baz}}{{/@fooBar}}',
      output: null,
      errors: [{ message: generateError('foos-baz') }],
    },
    {
      code: '{{#let (component "foo") as |my-component|}}{{#my-component}}{{/my-component}}{{/let}}',
      output: null,
      errors: [{ message: generateBlockError('my-component') }],
    },
    // Disallow config
    {
      code: '{{disallowed}}',
      output: null,
      options: [{ disallow: ['disallowed'] }],
      errors: [{ message: generateError('disallowed') }],
    },
  ],
});
