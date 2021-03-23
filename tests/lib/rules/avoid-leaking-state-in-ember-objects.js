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
    expect(rule.DEFAULT_IGNORED_PROPERTIES).toStrictEqual([
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
  parser: require.resolve('babel-eslint'),
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
    'import Mixin from "@ember/object/mixin"; export default Mixin.create({});',
    'import Mixin from "@ember/object/mixin"; export default Mixin.create({ harmlessProp: "foo" });',
    'import Mixin from "@ember/object/mixin"; export default Mixin.create(NestedMixin, {});',
    'import Mixin from "@ember/object/mixin";',
    'import Component from "@ember/component"; export default class MyNativeClassComponent extends Component { someArrayField = []; }',
    'import Component from "@ember/component"; export default class MyNativeClassComponent extends Component { someObjectField = {}; }',
    'import EmberObject from "@ember/object"; export default class MyNativeClassComponentWithAMixin extends EmberObject.extend(MyMixin) { someArrayField = []; }',
    // https://github.com/ember-cli/eslint-plugin-ember/issues/1116
    'import Mixin from "@ember/object/mixin"; export default Mixin.create({ harmlessProp: undefined });',
    'import Mixin from "@ember/object/mixin"; import { inject } from "@ember/service"; export default Mixin.create({ harmlessProp: (inject()) });',
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
    {
      code:
        'import Mixin from "@ember/object/mixin"; export default Mixin.create({ anArray: [] });',
      output: null,
      errors: [
        {
          message:
            'Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties',
        },
      ],
    },
    {
      code: 'import Ember from "ember"; export default Ember.Mixin.create({ anObject: {} });',
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

const typescriptTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
typescriptTester.run('avoid-leaking-state-in-ember-objects - typescript', rule, {
  valid: [
    'import Mixin from "@ember/object/mixin"; export default Mixin.create({ harmlessProp: undefined as any });',
    'import Mixin from "@ember/object/mixin"; import { inject } from "@ember/service"; export default Mixin.create({ harmlessProp: (inject() as unknown) as Store });',
  ],
  invalid: [
    {
      code: 'export default Foo.extend({ someProp: [] as Array });',
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
