//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unused-services');
const RuleTester = require('eslint').RuleTester;

const { getErrorMessage } = rule;

const SERVICE_NAME = 'fooName';
const message = getErrorMessage(SERVICE_NAME);

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
  const usecases = generateUseCasesFor(SERVICE_NAME);
  const valid = [];
  for (const use of usecases) {
    valid.push(
      `class MyClass { @service('foo') ${SERVICE_NAME}; fooFunc() {${use}} }`,
      `class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${use}} }`,
      `Component.extend({ ${SERVICE_NAME}: service('foo'), fooFunc() {${use}} });`,
      `Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${use}} });`
    );
  }
  return valid;
}

// Testing for unrelated props + some edge cases
const unrelatedPropUses = generateUseCasesFor('unrelatedProp').join('').concat('let foo;');

ruleTester.run('no-unused-services', rule, {
  valid: generateValid(),
  invalid: [
    {
      code: `class MyClass { @service('foo') ${SERVICE_NAME}; fooFunc() {${unrelatedPropUses}} }`,
      output: null,
      errors: [
        {
          message,
          suggestions: [{ output: `class MyClass {  fooFunc() {${unrelatedPropUses}} }` }],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${unrelatedPropUses}} }`,
      output: null,
      errors: [
        {
          message,
          suggestions: [{ output: `class MyClass {  fooFunc() {${unrelatedPropUses}} }` }],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `Component.extend({ ${SERVICE_NAME}: service('foo'), fooFunc() {${unrelatedPropUses}} });`,
      output: null,
      errors: [
        {
          message,
          suggestions: [{ output: `Component.extend({  fooFunc() {${unrelatedPropUses}} });` }],
          type: 'Property',
        },
      ],
    },
    {
      code: `Component.extend({ ${SERVICE_NAME}: service('foo') });`,
      output: null,
      errors: [{ message, suggestions: [{ output: 'Component.extend({  });' }], type: 'Property' }],
    },
    {
      code: `Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${unrelatedPropUses}} });`,
      output: null,
      errors: [
        {
          message,
          suggestions: [{ output: `Component.extend({  fooFunc() {${unrelatedPropUses}} });` }],
          type: 'Property',
        },
      ],
    },
    {
      code: `Component.extend({ ${SERVICE_NAME}: service() });`,
      output: null,
      errors: [{ message, suggestions: [{ output: 'Component.extend({  });' }], type: 'Property' }],
    },
    /* Multiple Classes */
    {
      code: `class MyClass1 { @service() ${SERVICE_NAME}; } class MyClass2 { fooFunc() {this.${SERVICE_NAME};} }`,
      output: null,
      errors: [
        {
          message,
          suggestions: [
            { output: `class MyClass1 {  } class MyClass2 { fooFunc() {this.${SERVICE_NAME};} }` },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `class MyClass1 { fooFunc() {this.${SERVICE_NAME};} } class MyClass2 { @service() ${SERVICE_NAME}; }`,
      output: null,
      errors: [
        {
          message,
          suggestions: [
            { output: `class MyClass1 { fooFunc() {this.${SERVICE_NAME};} } class MyClass2 {  }` },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    /* Nested Classes */
    {
      code: `class MyClass1 { @service() ${SERVICE_NAME}; fooFunc1() { class MyClass2 { fooFunc2() {this.${SERVICE_NAME};} } } }`,
      output: null,
      errors: [
        {
          message,
          suggestions: [
            {
              output: `class MyClass1 {  fooFunc1() { class MyClass2 { fooFunc2() {this.${SERVICE_NAME};} } } }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `class MyClass1 { fooFunc1() {this.${SERVICE_NAME};} fooFunc2() { class MyClass2 { @service() ${SERVICE_NAME}; } } }`,
      output: null,
      errors: [
        {
          message,
          suggestions: [
            {
              output: `class MyClass1 { fooFunc1() {this.${SERVICE_NAME};} fooFunc2() { class MyClass2 {  } } }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
  ],
});
