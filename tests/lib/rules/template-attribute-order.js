const rule = require('../../../lib/rules/template-attribute-order');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-attribute-order', rule, {
  valid: [
    // Alphabetized attributes
    '<template><div class="foo" id="bar"></div></template>',
    '<template><button aria-label="Submit" class="btn" role="button"></button></template>',
    '<template><input name="username" type="text" value=""></template>',
    '<template><div data-test-id="foo"></div></template>',
    // Arguments before attributes (default order)
    '<template><MyComponent @arg="val" class="foo" /></template>',

    '<template><MyComponent @a="1" {{on "change" this.click}} ...attributes /></template>',
    '<template><MyComponent @name="1" bar="baz" {{did-render this.someAction}} ...attributes aria-role="button" /></template>',
    '<template><MyComponent @name="1" aria-role="button" /></template>',
    '<template><MyComponent @name="1" ...attributes /></template>',
    '<template><MyComponent @name="1" {{did-render this.someAction}} /></template>',
    '<template><MyComponent @name="1" bar="baz" /></template>',
    '<template><div b="1" ...attributes aria-label="foo"></div></template>',
    '<template><div ...attributes {{did-render this.someAction}}></div></template>',
    '<template><div ...attributes @a="1"></div></template>',
    '<template><div bar="baz" {{did-render this.ok}} ...attributes label="foo"></div></template>',
    '<template><div ...attributes @a="1" b="2"></div></template>',
    '<template><div @a="1" ...attributes></div></template>',
    '<template><div @foo="1" aria-label="foo" {{did-render this.ok}} ...attributes bar="baz"></div></template>',
    '<template><div @foo="1" aria-label="foo"></div></template>',
    '<template><div @foo="1" ...attributes></div></template>',
    '<template><div @foo="1" {{did-render this.ok}}></div></template>',
    '<template><div @foo="1" bar="baz"></div></template>',
    '<template><div aria-label="foo" bar="baz"></div></template>',
    '<template><div bar="baz" ...attributes></div></template>',
    '<template><div bar="baz" {{did-render this.ok}}></div></template>',
    '<template><div {{did-render this.oks}} ...attributes aria-label="foo"></div></template>',
    '<template><div {{did-render this.ok}} ...attributes></div></template>',
    '<template><div ...attributes aria-label="foo"></div></template>',
    '<template><div aria-label="foo"></div></template>',
    '<template><MyComponent @change={{this.foo}} @value="5" data-test-foo local-class="foo" {{on "click" this.foo}} ...attributes as |sth|>content</MyComponent></template>',
    '<template>{{MyComponent something another a="1" b="2"}}</template>',
    '<template>{{MyComponent a="2" b="1"}}</template>',
    '<template><MyComponent @bar="2" @z="1" bar="2"></MyComponent></template>',
  ],

  invalid: [
    {
      code: '<template><div id="bar" class="foo"></div></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><button role="button" aria-label="Submit"></button></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><input type="text" name="username"></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },

    {
      code: '<template><div {{in-viewport onEnter=this.loadMore viewportSpy=true}} {{did-update this.loadMore this.activeTab}}></div></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><div b="1" aria-label="foo"></div></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><MyComponent data-test-id="Hello" @name="World" /></template>',
      output: null,
      errors: [{ messageId: 'unordered' }],
    },
    {
      code: '<template>{{MyComponent something another b="1" a="2"}}</template>',
      output: null,
      errors: [{ messageId: 'hashPairOrder' }],
    },
    {
      code: '<template><MyComponent @b="1" @a="2"></MyComponent></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><MyComponent {{did-update (fn this.click @a) @b}} {{did-insert this.click}}></MyComponent></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template>{{MyComponent b="2" a="1"}}</template>',
      output: null,
      errors: [{ messageId: 'hashPairOrder' }],
    },
    {
      code: '<template><div {{did-render this.someAction}} aria-label="button"></div></template>',
      output: null,
      errors: [{ messageId: 'unordered' }],
    },
    {
      code: '<template><MyComponent @value="5" data-test-foo @change={{this.foo}} local-class="foo" {{on "click" this.foo}} as |sth|>content</MyComponent></template>',
      output: null,
      errors: [{ messageId: 'unordered' }],
    },
    {
      code: '<template><Button @description="a" @block={{@b}} @dialogTitle="a" @dialogButton="b" @button="b" @alert="b" @alertDescription="d"></Button></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: `<template><MyComponent
        @c="2"
        @b="3"
      ></MyComponent></template>`,
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: `<template><!-- hi --> <MyComponent
        {{did-update this.ok}}
        a=1
        @c="2"
      ></MyComponent></template>`,
      output: null,
      errors: [{ messageId: 'unordered' }],
    },
    {
      code: `<template>{{MyComponent
        c="2"
        b="3"
      }}</template>`,
      output: null,
      errors: [{ messageId: 'hashPairOrder' }],
    },
    {
      code: `<template><Shared::Modal b="2" a="1" @close={{action "closeModal"}} {{did-insert this.ok}} as |modal|>
        content
      </Shared::Modal></template>`,
      output: null,
      errors: [{ messageId: 'unordered' }],
    },
    {
      code: `<template><Input
      @type="checkbox"
      @checked={{@title.isVisible}}
    /></template>`,
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><div {{did-render this.someAction}} @a="1"></div></template>',
      output: null,
      errors: [{ messageId: 'unordered' }],
    },
    {
      code: '<template><Foo class="asd" @tagName="" /></template>',
      output: null,
      errors: [{ messageId: 'unordered' }],
    },
    {
      code: `<template><Foo
      {{!-- @glint-expect-error --}}
      id="op"
      {{!-- @second --}}
      @foo={{1}}
    /></template>`,
      output: null,
      errors: [{ messageId: 'unordered' }],
    },
    {
      code: `<template><Foo
        {{!-- @glint-expect-error --}}
        id="op"
        {{!-- double comment --}}
        {{!-- @second --}}
        @foo={{1}}
        {{!-- another comment --}}
        {{!-- second last --}}
        {{!-- trailing comment --}}
      /></template>`,
      output: null,
      errors: [{ messageId: 'unordered' }],
    },
    {
      code: '<template><Link @b="b" @a="a">Foo</Link></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
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

hbsRuleTester.run('template-attribute-order', rule, {
  valid: [
    '<MyComponent @a="1" {{on "change" this.click}} ...attributes />',
    '<MyComponent @name="1" bar="baz" {{did-render this.someAction}} ...attributes aria-role="button" />',
    '<MyComponent @name="1" aria-role="button" />',
    '<MyComponent @name="1" ...attributes />',
    '<MyComponent @name="1" {{did-render this.someAction}} />',
    '<MyComponent @name="1" bar="baz" />',
    '<div b="1" ...attributes aria-label="foo"></div>',
    '<div ...attributes {{did-render this.someAction}}></div>',
    '<div ...attributes @a="1"></div>',
    '<div bar="baz" {{did-render this.ok}} ...attributes label="foo"></div>',
    '<div ...attributes @a="1" b="2"></div>',
    '<div @a="1" ...attributes></div>',
    '<div @foo="1" aria-label="foo" {{did-render this.ok}} ...attributes bar="baz"></div>',
    '<div @foo="1" aria-label="foo"></div>',
    '<div @foo="1" ...attributes></div>',
    '<div @foo="1" {{did-render this.ok}}></div>',
    '<div @foo="1" bar="baz"></div>',
    '<div aria-label="foo" bar="baz"></div>',
    '<div bar="baz" ...attributes></div>',
    '<div bar="baz" {{did-render this.ok}}></div>',
    '<div {{did-render this.oks}} ...attributes aria-label="foo"></div>',
    '<div {{did-render this.ok}} ...attributes></div>',
    '<div ...attributes aria-label="foo"></div>',
    '<div aria-label="foo"></div>',
    '<MyComponent @change={{this.foo}} @value="5" data-test-foo local-class="foo" {{on "click" this.foo}} ...attributes as |sth|>content</MyComponent>',
    '{{MyComponent something another a="1" b="2"}}',
    '{{MyComponent a="2" b="1"}}',
    '<MyComponent @bar="2" @z="1" bar="2"></MyComponent>',
  ],
  invalid: [
    {
      code: '<div {{in-viewport onEnter=this.loadMore viewportSpy=true}} {{did-update this.loadMore this.activeTab}}></div>',
      output: null,
      errors: [
        { message: 'Modifiers "did-update" is not alphabetized.' },
      ],
    },
    {
      code: '<div b="1" aria-label="foo"></div>',
      output: null,
      errors: [
        { message: 'Attributes "aria-label" is not alphabetized.' },
      ],
    },
    {
      code: '<MyComponent data-test-id="Hello" @name="World" />',
      output: null,
      errors: [
        { message: 'Arguments @name must go before attributes.' },
      ],
    },
    {
      code: '<div @foo="1" {{did-render this.ok}} aria-label="foo"></div>',
      output: null,
      errors: [
        { message: 'Attributes aria-label must go before modifiers.' },
      ],
    },
    {
      code: '{{MyComponent something another b="1" a="2"}}',
      output: null,
      errors: [
        { message: '`a` must appear after `b`.' },
      ],
    },
    {
      code: '<MyComponent @b="1" @a="2"></MyComponent>',
      output: null,
      errors: [
        { message: 'Arguments "a" is not alphabetized.' },
      ],
    },
    {
      code: '<MyComponent {{did-update (fn this.click @a) @b}} {{did-insert this.click}}></MyComponent>',
      output: null,
      errors: [
        { message: 'Modifiers "did-insert" is not alphabetized.' },
      ],
    },
    {
      code: '<div {{did-render this.someAction}} aria-label="button"></div>',
      output: null,
      errors: [
        { message: 'Attributes aria-label must go before modifiers.' },
      ],
    },
    {
      code: '<MyComponent @value="5" data-test-foo @change={{this.foo}} local-class="foo" {{on "click" this.foo}} ...attributes as |sth|>content</MyComponent>',
      output: null,
      errors: [
        { message: 'Arguments @change must go before attributes.' },
      ],
    },
    {
      code: '<MyComponent @value="5" data-test-foo @change={{this.foo}} local-class="foo" {{on "click" this.foo}} as |sth|>content</MyComponent>',
      output: null,
      errors: [
        { message: 'Arguments @change must go before attributes.' },
      ],
    },
    {
      code: '{{my-component one two b=1 a=2}}',
      output: null,
      errors: [
        { message: '`a` must appear after `b`.' },
      ],
    },
    {
      code: '<div {{did-update this.notok}} {{did-render this.ok}} aria-label="foo" @foo="1"></div>',
      output: null,
      errors: [
        { message: 'Arguments @foo must go before attributes.' },
      ],
    },
    {
      code: '<Button @description="a" @block={{@b}} @dialogTitle="a" @dialogButton="b" @button="b" @alert="b" @alertDescription="d"></Button>',
      output: null,
      errors: [
        { message: 'Arguments "block" is not alphabetized.' },
      ],
    },
    {
      code: `<MyComponent
        @c="2"
        @b="3"
      ></MyComponent>`,
      output: null,
      errors: [
        { message: 'Arguments "b" is not alphabetized.' },
      ],
    },
    {
      code: `<!-- hi --> <MyComponent
        {{did-update this.ok}}
        a=1
        @c="2"
      ></MyComponent>`,
      output: null,
      errors: [
        { message: 'Arguments @c must go before attributes.' },
      ],
    },
    {
      code: `{{MyComponent
        c="2"
        b="3"
      }}`,
      output: null,
      errors: [
        { message: '`b` must appear after `c`.' },
      ],
    },
    {
      code: `<Input
      @type="checkbox"
      @checked={{@title.isVisible}}
    />`,
      output: null,
      errors: [
        { message: 'Arguments "checked" is not alphabetized.' },
      ],
    },
    {
      code: '<div {{did-render this.someAction}} @a="1"></div>',
      output: null,
      errors: [
        { message: 'Arguments @a must go before modifiers.' },
      ],
    },
    {
      code: '<Foo class="asd" @tagName="" />',
      output: null,
      errors: [
        { message: 'Arguments @tagName must go before attributes.' },
      ],
    },
    {
      code: `<Foo
      {{!-- @glint-expect-error --}}
      id="op"
      {{!-- @second --}}
      @foo={{1}}
    />`,
      output: null,
      errors: [
        { message: 'Arguments @foo must go before attributes.' },
      ],
    },
    {
      code: `<Foo
        {{!-- @glint-expect-error --}}
        id="op"
        {{!-- double comment --}}
        {{!-- @second --}}
        @foo={{1}}
        {{!-- another comment --}}
        {{!-- second last --}}
        {{!-- trailing comment --}}
      />`,
      output: null,
      errors: [
        { message: 'Arguments @foo must go before attributes.' },
      ],
    },
    {
      code: '<Link @b="b" @a="a">Foo</Link>',
      output: null,
      errors: [
        { message: 'Arguments "a" is not alphabetized.' },
      ],
    },
  ],
});
