// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-ember-super-in-es-classes');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 2022 },
});

eslintTester.run('no-ember-super-in-es-classes', rule, {
  valid: [
    'EmberObject.extend({ init() { this._super(); } })',
    'EmberObject.extend({ init(a, b) { this._super(a, b); } })',
    'EmberObject.extend({ init() { this._super(...arguments); } })',
    'class Foo { bar() { Baz.reopen({ quux() { this._super(); } }); } }',
  ],
  invalid: [
    {
      code: 'class Foo { init() { this._super(); } }',
      output: 'class Foo { init() { super.init(); } }',
      errors: [
        { message: "Don't use `this._super` in ES classes; instead, you should use `super`" },
      ],
    },
    {
      code: 'class Foo { init(a, b) { this._super(a); } }',
      output: 'class Foo { init(a, b) { super.init(a); } }',
      errors: [
        { message: "Don't use `this._super` in ES classes; instead, you should use `super`" },
      ],
    },
    {
      code: 'class Foo { init() { this._super(...arguments); } }',
      output: 'class Foo { init() { super.init(...arguments); } }',
      errors: [
        { message: "Don't use `this._super` in ES classes; instead, you should use `super`" },
      ],
    },
    {
      code: 'class Foo { init() { this._super.apply(this, arguments); } }',
      output: 'class Foo { init() { super.init.apply(this, arguments); } }',
      errors: [
        { message: "Don't use `this._super` in ES classes; instead, you should use `super`" },
      ],
    },
    {
      code: 'class Foo { init() { if (x) { this._super(1); } else { this._super(2); } } }',
      output: 'class Foo { init() { if (x) { super.init(1); } else { super.init(2); } } }',
      errors: [
        { message: "Don't use `this._super` in ES classes; instead, you should use `super`" },
        { message: "Don't use `this._super` in ES classes; instead, you should use `super`" },
      ],
    },
    {
      code: 'class Foo { "a b"() { this._super(); } }',
      output: 'class Foo { "a b"() { super["a b"](); } }',
      errors: [
        { message: "Don't use `this._super` in ES classes; instead, you should use `super`" },
      ],
    },
    {
      code: 'class Foo { [Symbol.iterator]() { this._super(); } }',
      output: 'class Foo { [Symbol.iterator]() { super[Symbol.iterator](); } }',
      errors: [
        { message: "Don't use `this._super` in ES classes; instead, you should use `super`" },
      ],
    },
  ],
});
