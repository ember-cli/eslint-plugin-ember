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
  
    // Test cases ported from ember-template-lint
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
  
    // Test cases ported from ember-template-lint
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
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template>{{MyComponent something another b="1" a="2"}}</template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
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
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><div {{did-render this.someAction}} aria-label="button"></div></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><MyComponent @value="5" data-test-foo @change={{this.foo}} local-class="foo" {{on "click" this.foo}} as |sth|>content</MyComponent></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
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
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: `<template>{{MyComponent
        c="2"
        b="3"
      }}</template>`,
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: `<template><Shared::Modal b="2" a="1" @close={{action "closeModal"}} {{did-insert this.ok}} as |modal|>
        content
      </Shared::Modal></template>`,
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
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
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><Foo class="asd" @tagName="" /></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: `<template><Foo
      {{!-- @glint-expect-error --}}
      id="op"
      {{!-- @second --}}
      @foo={{1}}
    /></template>`,
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
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
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><Link @b="b" @a="a">Foo</Link></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
  ],
});
