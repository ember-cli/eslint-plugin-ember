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
    // With noImplicitThis:true (default), explicit this/@ paths are always valid
    '<template>{{this.foo}}</template>',
    '<template>{{@bar}}</template>',
    '<template>{{42}}</template>',
    '<template>{{true}}</template>',
    '<template>{{foo bar}}</template>',
    '<template>{{#each items as |item|}}{{item}}{{/each}}</template>',
    // ElementNode block params should be recognized as local variables
    '<template><Foo as |bar|>{{bar}}</Foo></template>',
    '<template><Foo as |bar|>{{bar.baz}}</Foo></template>',
    '<template>{{#if someProperty}}yay{{/if}}</template>',
    '<template><FooBar /></template>',
    {
      // {{foo}} is not flagged when noImplicitThis is disabled
      code: '<template>{{foo}}</template>',
      options: [{ noImplicitThis: false }],
    },
    {
      // {{foo.bar}} is not flagged when noImplicitThis is disabled
      code: '<template>{{foo.bar}}</template>',
      options: [{ noImplicitThis: false }],
    },
    {
      code: '<template>{{foo-bar}}</template>',
      options: [{ allow: ['foo-bar'] }],
    },

    // GJS/GTS: JS scope bindings (imports, const) used as curly invocations
    // are explicit by name. Converting to <Foo> would reference an unbound
    // identifier, so skip both single-word and named-args forms.
    `import fooBar from './foo-bar';
     export default <template>{{fooBar}}</template>;`,
    `import fooBar from './foo-bar';
     export default <template>{{fooBar arg=1}}</template>;`,
    `import fooBar from './foo-bar';
     export default <template>{{#fooBar}}content{{/fooBar}}</template>;`,
    `const someHelper = () => 'x';
     export default <template>{{someHelper}}</template>;`,
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
      output: '<template><FooBar>content</FooBar></template>',
      errors: [
        {
          message:
            "You are using the component {{#foo-bar}} with curly component syntax. You should use <FooBar> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. `'no-curly-component-invocation': { allow: ['foo-bar'] }`.",
        },
      ],
    },
    {
      code: '<template>{{#foo-bar}}{{/foo-bar}}</template>',
      output: '<template><FooBar></FooBar></template>',
      errors: [
        {
          message:
            "You are using the component {{#foo-bar}} with curly component syntax. You should use <FooBar> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. `'no-curly-component-invocation': { allow: ['foo-bar'] }`.",
        },
      ],
    },
    {
      code: '<template>{{#foo-bar/baz/boo-foo}}block{{/foo-bar/baz/boo-foo}}</template>',
      output: '<template><FooBar::Baz::BooFoo>block</FooBar::Baz::BooFoo></template>',
      errors: [
        {
          message:
            "You are using the component {{#foo-bar/baz/boo-foo}} with curly component syntax. You should use <FooBar::Baz::BooFoo> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. `'no-curly-component-invocation': { allow: ['foo-bar/baz/boo-foo'] }`.",
        },
      ],
    },
    {
      code: '<template>{{#some-component foo="bar"}}foo{{/some-component}}</template>',
      output: '<template><SomeComponent @foo="bar">foo</SomeComponent></template>',
      errors: [
        {
          message:
            "You are using the component {{#some-component}} with curly component syntax. You should use <SomeComponent> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. `'no-curly-component-invocation': { allow: ['some-component'] }`.",
        },
      ],
    },
    {
      // noImplicitThis:true (default) flags plain single-word names
      code: '<template>{{foo}}</template>',
      output: null,
      errors: [{ message: generateError('foo') }],
    },
    {
      // noImplicitThis:true (default) flags multi-part paths
      code: '<template>{{foo.bar}}</template>',
      output: null,
      errors: [{ message: generateError('foo.bar') }],
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

function generateBlockError(name, isLocal) {
  let angleBracketName;
  if (name.startsWith('@') || name.startsWith('this.') || isLocal) {
    angleBracketName = name;
  } else {
    const parts = name.split('/');
    angleBracketName = parts
      .map((part) => {
        return part
          .split('-')
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join('');
      })
      .join('::');
  }
  return `You are using the component {{#${name}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${name}'] }\`.`;
}

hbsRuleTester.run('template-no-curly-component-invocation', rule, {
  valid: [
    // Plain single-word / multi-part paths are valid when noImplicitThis is disabled
    {
      code: '{{foo}}',
      options: [{ noImplicitThis: false }],
    },
    {
      code: '{{foo.bar}}',
      options: [{ noImplicitThis: false }],
    },
    {
      code: '{{model.selectedTransfersCount}}',
      options: [{ noImplicitThis: false }],
    },
    {
      code: '{{request.note}}',
      options: [{ noImplicitThis: false }],
    },
    // Built-in helpers / keywords (always valid)
    '{{#each items as |item|}}{{item}}{{/each}}',
    '{{#each items as |item|}}{{item.foo}}{{/each}}',
    // ElementNode block params should be recognized as local variables
    '<Foo as |bar|>{{bar}}</Foo>',
    '<Foo as |bar|>{{bar.baz}}</Foo>',
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
    // Explicit this/@ paths are always valid
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
    // noImplicitThis: block params exempt {{item}} even with noImplicitThis:true
    {
      code: '{{#each items as |item|}}{{item}}{{/each}}',
      options: [{ noImplicitThis: true }],
    },
    // noImplicitThis: block params exempt multi-part access too
    {
      code: '{{#each items as |item|}}{{item.name}}{{/each}}',
      options: [{ noImplicitThis: true }],
    },
    // noImplicitThis: explicit this./ @ paths never flagged
    {
      code: '{{this.someProperty}}',
      options: [{ noImplicitThis: true }],
    },
    {
      code: '{{@someArg}}',
      options: [{ noImplicitThis: true }],
    },
    // disallow: block params exempt the disallowed name
    {
      code: '{{#each items as |disallowed|}}{{disallowed}}{{/each}}',
      options: [{ disallow: ['disallowed'], noImplicitThis: false }],
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
      output: '<FooBar></FooBar>',
      errors: [{ message: generateBlockError('foo-bar') }],
    },
    {
      code: '{{#foo-bar as |foo-baz|}}{{foo-baz}}{{/foo-bar}}',
      output: '<FooBar as |foo-baz|>{{foo-baz}}</FooBar>',
      errors: [{ message: generateBlockError('foo-bar') }, { message: generateError('foo-baz') }],
    },
    {
      code: '{{#foo-bar as |foo-baz|}}{{#foo-baz as |foo-boo|}}{{foo-boo}}{{/foo-baz}}{{/foo-bar}}',
      output: '<FooBar as |foo-baz|>{{#foo-baz as |foo-boo|}}{{foo-boo}}{{/foo-baz}}</FooBar>',
      errors: [
        { message: generateBlockError('foo-bar') },
        { message: generateBlockError('foo-baz', true) },
        { message: generateError('foo-boo') },
      ],
    },
    {
      code: '{{#foo-bar as |foo-baz|}}{{foos-baz}}{{/foo-bar}}',
      output: '<FooBar as |foo-baz|>{{foos-baz}}</FooBar>',
      errors: [{ message: generateBlockError('foo-bar') }, { message: generateError('foos-baz') }],
    },
    {
      code: '{{#this.foo-bar as |foo-baz|}}{{foos-baz}}{{/this.foo-bar}}',
      output: '<this.foo-bar as |foo-baz|>{{foos-baz}}</this.foo-bar>',
      errors: [
        { message: generateBlockError('this.foo-bar') },
        { message: generateError('foos-baz') },
      ],
    },
    {
      code: '{{#this.fooBar as |foo-baz|}}{{foos-baz}}{{/this.fooBar}}',
      output: '<this.fooBar as |foo-baz|>{{foos-baz}}</this.fooBar>',
      errors: [
        { message: generateBlockError('this.fooBar') },
        { message: generateError('foos-baz') },
      ],
    },
    {
      code: '{{#@foo-bar as |foo-baz|}}{{foos-baz}}{{/@foo-bar}}',
      output: '<@foo-bar as |foo-baz|>{{foos-baz}}</@foo-bar>',
      errors: [{ message: generateBlockError('@foo-bar') }, { message: generateError('foos-baz') }],
    },
    {
      code: '{{#@fooBar as |foo-baz|}}{{foos-baz}}{{/@fooBar}}',
      output: '<@fooBar as |foo-baz|>{{foos-baz}}</@fooBar>',
      errors: [{ message: generateBlockError('@fooBar') }, { message: generateError('foos-baz') }],
    },
    {
      code: '{{#let (component "foo") as |my-component|}}{{#my-component}}{{/my-component}}{{/let}}',
      output: '{{#let (component "foo") as |my-component|}}<my-component></my-component>{{/let}}',
      errors: [{ message: generateBlockError('my-component', true) }],
    },
    // Curly component invocations with hash params
    {
      code: '{{foo-bar bar=baz}}',
      output: null,
      errors: [{ message: generateError('foo-bar') }],
    },
    // Multi-part path with named args is always flagged ({{foo.bar bar=baz}})
    {
      code: '{{foo.bar bar=baz}}',
      output: null,
      errors: [{ message: generateError('foo.bar') }],
    },
    // link-to with positional params
    {
      code: '{{link-to "bar" "foo"}}',
      output: null,
      errors: [{ message: generateError('link-to') }],
    },
    // block link-to with positional params
    {
      code: '{{#link-to "foo"}}bar{{/link-to}}',
      output: null,
      errors: [{ message: generateBlockError('link-to') }],
    },
    // input with hash params
    {
      code: '{{input type="text" value=this.model.name}}',
      output: null,
      errors: [{ message: generateError('input') }],
    },
    // textarea with hash params
    {
      code: '{{textarea value=this.model.body}}',
      output: null,
      errors: [{ message: generateError('textarea') }],
    },
    // Disallow config
    {
      code: '{{disallowed}}',
      output: null,
      options: [{ disallow: ['disallowed'] }],
      errors: [{ message: generateError('disallowed') }],
    },
    // noImplicitThis: plain single-word name flagged with noImplicitThis:true
    {
      code: '{{foo}}',
      output: null,
      options: [{ noImplicitThis: true }],
      errors: [{ message: generateError('foo') }],
    },
    // noImplicitThis: multi-part path flagged with noImplicitThis:true
    {
      code: '{{foo.bar}}',
      output: null,
      options: [{ noImplicitThis: true }],
      errors: [{ message: generateError('foo.bar') }],
    },
  ],
});
