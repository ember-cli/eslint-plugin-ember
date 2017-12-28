// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/avoid-leaking-state-in-ember-objects');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});
eslintTester.run('avoid-leaking-state-in-ember-objects', rule, {
  valid: [
    {
      code: 'export default Foo.extend();',
    },
    {
      code: 'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", []) } });',
    },
    {
      code: 'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", {}) } });',
    },
    {
      code: 'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", new Ember.A()) } });',
    },
    {
      code: 'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", new A()) } });',
    },
    {
      code: 'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", new Ember.Object()) } });',
    },
    {
      code: 'export default Foo.extend({ someProp: "example", init() { this.set("anotherProp", new Object()) } });',
    },
    {
      code: 'export default Foo.extend({ classNames: [], classNameBindings: [], actions: {}, concatenatedProperties: [], mergedProperties: [], positionalParams: [], foo: [], bar: new Ember.A() });',
      options: [{ additionalIgnoredProperties: ['foo', 'bar'] }],
    },
    {
      code: 'export default Foo.extend(someMixin, { classNames: [], classNameBindings: [], actions: {}, concatenatedProperties: [], mergedProperties: [], positionalParams: [], foo: {} });',
      options: [{ additionalIgnoredProperties: ['foo'] }],
    },
    {
      code: 'export default Foo.extend({ someProp: "example",});',
    },
    {
      code: 'export default Foo.extend({ someProp: function() {},});',
    },
    {
      code: 'export default Foo.extend({ someProp: 5,});',
    },
    {
      code: 'export default Foo.extend({ someProp: Symbol(),});',
    },
    {
      code: 'export default Foo.extend({ someProp: undefined,});',
    },
    {
      code: 'export default Foo.extend({ someProp: null,});',
    },
    {
      code: 'export default Foo.extend({ doStuff() { }});'
    },
    {
      code: 'export default Foo.extend({ derp: importedThing });'
    },
    {
      code: 'export default Foo.extend({ derp });'
    },
    {
      code: 'export default Foo.extend(SomeMixin, { simple: "string" });'
    },
    {
      code: 'export default Foo.extend(SomeMixin, OtherMixin, { derp: null });'
    },
    {
      code: 'export default Foo.extend({ doStuff: task(function* () {}) });'
    },
    {
      code: 'export default Foo.extend({ fullName: computed(function() {}) });'
    },
    {
      code: 'export default Foo.extend({ fullName: inject.service() });'
    },
    {
      code: "export default Foo.extend({ fullName: 'a' + 'b' });"
    },
    {
      code: 'export default Foo.extend({ test: hbs`lorem ipsum` });'
    },
    {
      code: 'export default Foo.extend({ test: `lorem ipsum` });'
    },
    {
      code: 'export default Foo.extend({ fullName: abc.dgc });'
    },
    {
      code: 'export default Foo.extend({ foo: abc.something() });'
    },
    {
      code: 'export default Foo.extend({ foo: !true });'
    },
  ],
  invalid: [
    {
      code: 'export default Foo.extend({someProp: [], bar: {} });',
      options: [{ additionalIgnoredProperties: ['foo'] }],
      errors: [{
        message: 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
      }],
    },
    {
      code: 'export default Foo.extend({someProp: new Ember.A()});',
      errors: [{
        message: 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
      }],
    },
    {
      code: 'export default Foo.extend({someProp: new A()});',
      errors: [{
        message: 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
      }],
    },
    {
      code: 'export default Foo.extend({someProp: {}});',
      errors: [{
        message: 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
      }],
    },
    {
      code: 'export default Foo.extend({someProp: new Ember.Object()});',
      errors: [{
        message: 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
      }],
    },
    {
      code: 'export default Foo.extend({someProp: new Object()});',
      errors: [{
        message: 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
      }],
    },

    {
      code: 'export default Foo.extend(SomeMixin, { derp: [] });',
      errors: [{
        message: 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
      }],
    },
    {
      code: 'export default Foo.extend({ badThing: new Set() });',
      errors: [{
        message: 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
      }],
    },
    {
      code: "export default Foo['extend']({ otherThing: {} });",
      errors: [{
        message: 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
      }],
    },
    {
      code: 'export default Foo.reopen({ otherThing: {} });',
      errors: [{
        message: 'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
      }],
    },
  ],
});
