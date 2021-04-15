//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unused-services');
const RuleTester = require('eslint').RuleTester;

const { getErrorMessage } = rule;
const message = getErrorMessage('fooName');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  parser: require.resolve('babel-eslint'),
});

const usecases = [
  'this.fooName;',
  'this.fooName[0]',
  'this.fooName.prop;',
  'this.fooName.func();',
  "this.get('fooName');",
  "this.get('fooName.prop');",
  "get(this, 'fooName');",
  "get(this, 'fooName.prop');",
  "this.getProperties('a', 'fooName');",
  "this.getProperties('a', 'fooName.prop');",
  "this.getProperties(['a', 'fooName']);",
  "this.getProperties(['a', 'fooName.prop']);",
  "getProperties(this, 'a', 'fooName');",
  "getProperties(this, 'a', 'fooName.prop');",
  "getProperties(this, ['a', 'fooName']);",
  "getProperties(this, ['a', 'fooName.prop']);",
  'const { a, b, fooName } = this;',
  'let { a, fooName, b } = this;',
];

const valid = [];
for (const use of usecases) {
  valid.push(
    `class MyClass {
      @service('foo') fooName;

      fooFunc() { ${use} }
    }`,
    `class MyClass {
      @service() fooName;

      fooFunc() { ${use} }
    }`,
    `Component.extend({
      fooName: service('foo'),

      fooFunc() { ${use} }
    });`,
    `Component.extend({
      fooName: service(),

      fooFunc() { ${use} }
    });`
  );
}

ruleTester.run('no-unused-services', rule, {
  valid,
  invalid: [
    {
      code: "class MyClass { @service('foo') fooName; }",
      output: null,
      errors: [{ message, suggestions: [{ output: 'class MyClass {  }' }], type: 'ClassProperty' }],
    },
    {
      code: 'class MyClass { @service() fooName; }',
      output: null,
      errors: [{ message, suggestions: [{ output: 'class MyClass {  }' }], type: 'ClassProperty' }],
    },
    {
      code: "Component.extend({ fooName: service('foo'), });",
      output: null,
      errors: [{ message, suggestions: [{ output: 'Component.extend({  });' }], type: 'Property' }],
    },
    {
      code: 'Component.extend({ fooName: service(), });',
      output: null,
      errors: [{ message, suggestions: [{ output: 'Component.extend({  });' }], type: 'Property' }],
    },
  ],
});
