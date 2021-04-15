//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unused-services');
const RuleTester = require('eslint').RuleTester;

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

const SERVICE_NAME = 'fooName';
const IMPORTS = "import {get, getProperties} from '@ember/object';";
const RENAMED_IMPORTS = "import {get as g, getProperties as gp} from '@ember/object';";

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
    `this.getProperties('a', '${propertyName}');`,
    `this.getProperties('a', '${propertyName}.prop');`,
    `this.getProperties(['a', '${propertyName}']);`,
    `this.getProperties(['a', '${propertyName}.prop']);`,
    `const { a, b, ${propertyName} } = this;`,
    `let { c, ${propertyName} : prop, d } = this;`,
  ];
}

/**
 * Generate an array of usecases with Ember.get and Ember.getProperties using the given property name
 * @param {String} propertyName The given property name to access
 * @param {Boolean} renamed Whether or not the imports are renamed
 * @returns {Array}
 */
function generateEmberObjectUseCasesFor(propertyName, renamed = false) {
  const getName = renamed ? 'g' : 'get';
  const getPropertiesName = renamed ? 'gp' : 'getProperties';
  return [
    `${getName}(this, '${propertyName}');`,
    `${getName}(this, '${propertyName}.prop');`,
    `${getPropertiesName}(this, 'a', '${propertyName}');`,
    `${getPropertiesName}(this, 'a', '${propertyName}.prop');`,
    `${getPropertiesName}(this, ['a', '${propertyName}']);`,
    `${getPropertiesName}(this, ['a', '${propertyName}.prop']);`,
  ];
}

/**
 * Generate an array of valid test cases
 * @returns {Array}
 */
function generateValid() {
  const valid = [];

  const useCases = generateUseCasesFor(SERVICE_NAME);
  for (const use of useCases) {
    valid.push(
      `class MyClass { @service('foo') ${SERVICE_NAME}; fooFunc() {${use}} }`,
      `class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${use}} }`,
      `Component.extend({ ${SERVICE_NAME}: service('foo'), fooFunc() {${use}} });`,
      `Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${use}} });`
    );
  }

  const emberObjectUseCases = [
    generateEmberObjectUseCasesFor(SERVICE_NAME),
    generateEmberObjectUseCasesFor(SERVICE_NAME, true),
  ];
  for (const [idx, useCases] of emberObjectUseCases.entries()) {
    const imports = idx === 0 ? IMPORTS : RENAMED_IMPORTS;
    for (const use of useCases) {
      valid.push(
        `${imports} class MyClass { @service('foo') ${SERVICE_NAME}; fooFunc() {${use}} }`,
        `${imports} class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${use}} }`,
        `${imports} Component.extend({ ${SERVICE_NAME}: service('foo'), fooFunc() {${use}} });`,
        `${imports} Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${use}} });`
      );
    }
  }

  return valid;
}

// Testing for unrelated props + some edge cases
const unrelatedPropUses = generateUseCasesFor('unrelatedProp');
const edgeCases = ['let foo;', `this.prop.${SERVICE_NAME};`];
const nonUses = unrelatedPropUses.concat(edgeCases).join('');
const emberObjectUses1 = generateEmberObjectUseCasesFor(SERVICE_NAME).join('');
const emberObjectUses2 = generateEmberObjectUseCasesFor('unrelatedProp').join('');

ruleTester.run('no-unused-services', rule, {
  valid: generateValid(),
  invalid: [
    {
      code: `class MyClass { @service('foo') ${SERVICE_NAME}; fooFunc() {${nonUses}} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `class MyClass {  fooFunc() {${nonUses}} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${nonUses}} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `class MyClass {  fooFunc() {${nonUses}} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `Component.extend({ ${SERVICE_NAME}: service('foo'), fooFunc() {${nonUses}} });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `Component.extend({  fooFunc() {${nonUses}} });`,
            },
          ],
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
      code: `Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${nonUses}} });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `Component.extend({  fooFunc() {${nonUses}} });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    {
      code: `Component.extend({ ${SERVICE_NAME}: service() });`,
      output: null,
      errors: [{ message, suggestions: [{ output: 'Component.extend({  });' }], type: 'Property' }],
    },
    /* Using get/getProperties without @ember/object import */
    {
      code: `class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${emberObjectUses1}} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `class MyClass {  fooFunc() {${emberObjectUses1}} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${emberObjectUses1}} });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `Component.extend({  fooFunc() {${emberObjectUses1}} });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    /* Using get/getProperties with @ember/object import for an unrelatedProp */
    {
      code: `${IMPORTS} class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${emberObjectUses2}} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${IMPORTS} class MyClass {  fooFunc() {${emberObjectUses2}} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `${IMPORTS} Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${emberObjectUses2}} });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${IMPORTS} Component.extend({  fooFunc() {${emberObjectUses2}} });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    /* Multiple classes */
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
    /* Nested classes */
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
