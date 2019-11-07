// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/avoid-leaking-state-in-ember-objects');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

describe('imports', () => {
  it('should expose the default ignored properties', () => {
    expect(rule.DEFAULT_IGNORED_PROPERTIES).toEqual([
      'classNames',
      'classNameBindings',
      'actions',
      'concatenatedProperties',
      'mergedProperties',
      'positionalParams',
      'attributeBindings',
      'queryParams',
      'attrs',
    ]);
  });
});

const eslintTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});
eslintTester.run('avoid-leaking-state-in-ember-objects', rule, {
  valid: [
    'export default Foo.extend();',
    'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", []) } });',
    'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", {}) } });',
    'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", new Ember.A()) } });',
    'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", new A()) } });',
    'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", new Ember.Object()) } });',
    'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", new Object()) } });',
    'export default Foo.extend({ classNames: [], classNameBindings: [], actions: {}, concatenatedProperties: [], mergedProperties: [], positionalParams: [] });',
    'export default Foo.extend(someMixin, { classNames: [], classNameBindings: [], actions: {}, concatenatedProperties: [], mergedProperties: [], positionalParams: [] });',
    'export default Foo.extend({ someProp: "example",});',
    'export default Foo.extend({ someProp: function() {},});',
    'export default Foo.extend({ someProp: 5,});',
    'export default Foo.extend({ someProp: Symbol(),});',
    'export default Foo.extend({ someProp: undefined,});',
    'export default Foo.extend({ someProp: null,});',
    'export default Foo.extend({ doStuff() { }});',
    'export default Foo.extend({ derp: importedThing });',
    'export default Foo.extend({ derp });',
    'export default Foo.extend(SomeMixin, { simple: "string" });',
    'export default Foo.extend(SomeMixin, OtherMixin, { derp: null });',
    'export default Foo.extend({ doStuff: task(function* () {}) });',
    'export default Foo.extend({ fullName: computed(function() {}) });',
    'export default Foo.extend({ fullName: inject.service() });',
    "export default Foo.extend({ fullName: 'a' + 'b' });",
    'export default Foo.extend({ test: hbs`lorem ipsum` });',
    'export default Foo.extend({ test: `lorem ipsum` });',
    'export default Foo.extend({ fullName: abc.dgc });',
    'export default Foo.extend({ foo: abc.something() });',
    'export default Foo.extend({ foo: !true });',
    'export default Foo.extend({ ...props });',
    'export default Foo.extend({ foo: condition ? "foo" : "bar" });',
    'export default Foo.extend({ foo: "foo" && "bar" });',
    'export default Foo.extend({ foo: "foo" || "bar" });',
  ],
  invalid: [
    {
      code: 'export default Foo.extend({someProp: []});',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({someProp: new Ember.A()});',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({someProp: new A()});',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({someProp: {}});',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({someProp: new Ember.Object()});',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({someProp: new Object()});',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },

    {
      code: 'export default Foo.extend(SomeMixin, { derp: [] });',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({ badThing: new Set() });',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: "export default Foo['extend']({ otherThing: {} });",
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.reopen({ otherThing: {} });',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({ foo: condition ? {} : false });',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({ foo: condition ? false : {} });',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({ foo: false && {} });',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({ foo: {} && false });',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({ foo: false || {} });',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'export default Foo.extend({ foo: {} || false });',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
  ],
});
