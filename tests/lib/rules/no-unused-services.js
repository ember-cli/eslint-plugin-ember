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

/**
 * Generate an array of usecases using the given property name
 * @param {String} propertyName The given property name to access
 * @returns {Array}
 */
function generateUseCasesFor(propertyName) {
  return [
    `this.${propertyName};`,
    `this.${propertyName}[0];`,
    `this.${propertyName}.prop;`,
    `this.${propertyName}.func();`,
    `this.get('${propertyName}');`,
    `this.get('${propertyName}.prop');`,
    `get(this, '${propertyName}');`,
    `get(this, '${propertyName}.prop');`,
    `this.getProperties('a', '${propertyName}');`,
    `this.getProperties('a', '${propertyName}.prop');`,
    `this.getProperties(['a', '${propertyName}']);`,
    `this.getProperties(['a', '${propertyName}.prop']);`,
    `getProperties(this, 'a', '${propertyName}');`,
    `getProperties(this, 'a', '${propertyName}.prop');`,
    `getProperties(this, ['a', '${propertyName}']);`,
    `getProperties(this, ['a', '${propertyName}.prop']);`,
    `const { a, b, ${propertyName} } = this;`,
    `let { c, ${propertyName} : prop, d } = this;`,
  ];
}

/**
 * Generate an array of valid test cases
 * @returns {Array}
 */
function generateValid() {
  const name = 'fooName';
  const usecases = generateUseCasesFor(name);
  const valid = [];
  for (const use of usecases) {
    valid.push(
      `class MyClass { @service('foo') ${name}; fooFunc() {${use}} }`,
      `class MyClass { @service() ${name}; fooFunc() {${use}} }`,
      `Component.extend({ ${name}: service('foo'), fooFunc() {${use}} });`,
      `Component.extend({ ${name}: service(), fooFunc() {${use}} });`
    );
  }
  return valid;
}

const unrelatedPropUsecases = generateUseCasesFor('unrelatedProp').join('');

ruleTester.run('no-unused-services', rule, {
  valid: generateValid(),
  invalid: [
    {
      code: `class MyClass { @service('foo') fooName; fooFunc() {${unrelatedPropUsecases}} }`,
      output: null,
      errors: [
        {
          message,
          suggestions: [{ output: `class MyClass {  fooFunc() {${unrelatedPropUsecases}} }` }],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `class MyClass { @service() fooName; fooFunc() {${unrelatedPropUsecases}} }`,
      output: null,
      errors: [
        {
          message,
          suggestions: [{ output: `class MyClass {  fooFunc() {${unrelatedPropUsecases}} }` }],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `Component.extend({ fooName: service('foo'), fooFunc() {${unrelatedPropUsecases}} });`,
      output: null,
      errors: [
        {
          message,
          suggestions: [{ output: `Component.extend({  fooFunc() {${unrelatedPropUsecases}} });` }],
          type: 'Property',
        },
      ],
    },
    {
      code: "Component.extend({ fooName: service('foo') });",
      output: null,
      errors: [{ message, suggestions: [{ output: 'Component.extend({  });' }], type: 'Property' }],
    },
    {
      code: `Component.extend({ fooName: service(), fooFunc() {${unrelatedPropUsecases}} });`,
      output: null,
      errors: [
        {
          message,
          suggestions: [{ output: `Component.extend({  fooFunc() {${unrelatedPropUsecases}} });` }],
          type: 'Property',
        },
      ],
    },
    {
      code: 'Component.extend({ fooName: service() });',
      output: null,
      errors: [{ message, suggestions: [{ output: 'Component.extend({  });' }], type: 'Property' }],
    },
  ],
});
