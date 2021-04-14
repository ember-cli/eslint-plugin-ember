//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unused-services');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;
const message = ERROR_MESSAGE('fooName');

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
usecases.forEach((use) => {
  valid.push({
    code: `
      class MyClass {
        @service('foo')
        fooName;

        fooFunc() { ${use} }
      }
    `,
    parser: require.resolve('babel-eslint'),
  });

  valid.push({
    code: `
      Component.extend({
        fooName: service('foo'),

        fooFunc() { ${use} }
      });
    `,
    parser: require.resolve('babel-eslint'),
  });
});

ruleTester.run('no-unused-services', rule, {
  valid,
  invalid: [
    {
      code: `class MyClass { @service('foo') fooName; }`,
      output: `class MyClass {  }`,
      parser: require.resolve('babel-eslint'),
      errors: [{ message }],
    },

    {
      code: `Component.extend({ fooName: service('foo'), });`,
      output: `Component.extend({  });`,
      parser: require.resolve('babel-eslint'),
      errors: [{ message }],
    },
  ],
});

