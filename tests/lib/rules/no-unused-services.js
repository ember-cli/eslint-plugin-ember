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
const SERVICE_IMPORT = "import {inject as service} from '@ember/service';";
const EO_IMPORTS = "import {computed, get, getProperties, observer} from '@ember/object';";
const RENAMED_EO_IMPORTS =
  "import {computed as cp, get as g, getProperties as gp, observer as ob} from '@ember/object';";
const ALIAS_IMPORT = "import {alias} from '@ember/object/computed';";
const RENAMED_ALIAS_IMPORT = "import {alias as al} from '@ember/object/computed';";
const OBSERVES_IMPORT = "import {observes} from '@ember-decorators/object';";
const RENAMED_OBSERVES_IMPORT = "import {observes as obs} from '@ember-decorators/object';";
const EMBER_IMPORT = "import Ember from 'ember';";
const RENAMED_EMBER_IMPORT = "import Em from 'ember';";

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
 * Generate an array of usecases with a computed macro `alias` using the given property name
 * @param {String} propertyName The given property name to access
 * @param {Boolean} renamed Whether or not the imports are renamed
 * @returns {Array}
 */
function generateMacroUseCasesFor(propertyName, renamed = false) {
  const aliasName = renamed ? 'al' : 'alias';
  const aliasImport = renamed ? RENAMED_ALIAS_IMPORT : ALIAS_IMPORT;
  return [
    `${SERVICE_IMPORT}${aliasImport} class MyClass { @service() ${propertyName}; @${aliasName}('${propertyName}.prop') someAlias; }`,
    `${SERVICE_IMPORT}${aliasImport} Component.extend({ ${SERVICE_NAME}: service(), someAlias: ${aliasName}('${propertyName}.prop') });`,
  ];
}

/**
 * Generate an array of usecases with a computed property using the given property name
 * @param {String} propertyName The given property name to access
 * @param {Boolean} renamed Whether or not the imports are renamed
 * @returns {Array}
 */
function generateComputedUseCasesFor(propertyName, renamed = false) {
  const computedName = renamed ? 'cp' : 'computed';
  const computedImport = renamed ? RENAMED_EO_IMPORTS : EO_IMPORTS;
  const emberName = renamed ? 'Em' : 'Ember';
  const emberImport = renamed ? RENAMED_EMBER_IMPORT : EMBER_IMPORT;
  return [
    `${SERVICE_IMPORT}${computedImport} class MyClass { @service() ${propertyName}; @${computedName}('${propertyName}.prop') get someComputed() {} }`,
    `${SERVICE_IMPORT}${computedImport} Component.extend({ ${SERVICE_NAME}: service(), someComputed: ${computedName}('${propertyName}.prop', ()=>{}) });`,
    `${SERVICE_IMPORT}${computedImport} Component.extend({ ${SERVICE_NAME}: service(), someComputed: ${computedName}.alias('${propertyName}.prop', ()=>{}) });`,
    `${SERVICE_IMPORT}${emberImport} Component.extend({ ${SERVICE_NAME}: service(), someComputed: ${emberName}.computed('${propertyName}.prop', ()=>{}) });`,
    `${SERVICE_IMPORT}${emberImport} Component.extend({ ${SERVICE_NAME}: service(), someComputed: ${emberName}.computed.alias('${propertyName}.prop', ()=>{}) });`,
  ];
}

/**
 * Generate an array of usecases with an observer using the given property name
 * @param {String} propertyName The given property name to access
 * @param {Boolean} renamed Whether or not the imports are renamed
 * @returns {Array}
 */
function generateObserverUseCasesFor(propertyName, renamed = false) {
  const observerName = renamed ? 'ob' : 'observer';
  const observerImport = renamed ? RENAMED_EO_IMPORTS : EO_IMPORTS;
  const observesName = renamed ? 'obs' : 'observes';
  const observesImport = renamed ? RENAMED_OBSERVES_IMPORT : OBSERVES_IMPORT;
  const emberName = renamed ? 'Em' : 'Ember';
  const emberImport = renamed ? RENAMED_EMBER_IMPORT : EMBER_IMPORT;
  return [
    `${SERVICE_IMPORT}${observerImport} Component.extend({ ${SERVICE_NAME}: service(), someObserved: ${observerName}('${propertyName}.prop', ()=>{}) });`,
    `${SERVICE_IMPORT}${observerImport} Component.extend({ ${SERVICE_NAME}: service(), someObserved: on('init', ${observerName}('${propertyName}.prop', ()=>{})) });`,
    `${SERVICE_IMPORT}${emberImport} Component.extend({ ${SERVICE_NAME}: service(), someObserved: ${emberName}.observer('${propertyName}.prop', ()=>{}) });`,
    `${SERVICE_IMPORT}${emberImport} Component.extend({ ${SERVICE_NAME}: service(), someObserved: on('init', ${emberName}.observer('${propertyName}.prop', ()=>{})) });`,
    `${SERVICE_IMPORT}${observesImport} class MyClass { @service() ${propertyName}; @${observesName}('${propertyName}.prop') get someVal() {} }`,
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
      `${SERVICE_IMPORT} class MyClass { @service('foo') ${SERVICE_NAME}; fooFunc() {${use}} }`,
      `${SERVICE_IMPORT} class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${use}} }`,
      `${SERVICE_IMPORT} Component.extend({ ${SERVICE_NAME}: service('foo'), fooFunc() {${use}} });`,
      `${SERVICE_IMPORT} Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${use}} });`
    );
  }

  const emberObjectUseCases = [
    generateEmberObjectUseCasesFor(SERVICE_NAME),
    generateEmberObjectUseCasesFor(SERVICE_NAME, true),
  ];
  for (const [idx, useCases] of emberObjectUseCases.entries()) {
    const imports = idx === 0 ? EO_IMPORTS : RENAMED_EO_IMPORTS;
    for (const use of useCases) {
      valid.push(
        `${SERVICE_IMPORT}${imports} class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${use}} }`,
        `${SERVICE_IMPORT}${imports} Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${use}} });`
      );
    }
  }

  return valid;
}

// Testing for unrelated props + some edge cases
const unrelatedPropUses = generateUseCasesFor('unrelatedProp');
const edgeCases = ['let foo;', `this.prop.${SERVICE_NAME};`];
const nonUses = [...unrelatedPropUses, ...edgeCases].join('');
const emberObjectUses1 = generateEmberObjectUseCasesFor(SERVICE_NAME).join('');
const emberObjectUses2 = generateEmberObjectUseCasesFor('unrelatedProp').join('');

ruleTester.run('no-unused-services', rule, {
  valid: [
    ...generateValid(),
    ...generateMacroUseCasesFor(SERVICE_NAME),
    ...generateMacroUseCasesFor(SERVICE_NAME, true),
    ...generateComputedUseCasesFor(SERVICE_NAME),
    ...generateComputedUseCasesFor(SERVICE_NAME, true),
    ...generateObserverUseCasesFor(SERVICE_NAME),
    ...generateObserverUseCasesFor(SERVICE_NAME, true),
    `class MyClass { @service() ${SERVICE_NAME}; }`,
    `Component.extend({ ${SERVICE_NAME}: service() });`,
    `Component.extend({ ${SERVICE_NAME}: Ember.inject.service() });`,
    `${SERVICE_IMPORT} class MyClass {}`,
    `${SERVICE_IMPORT} Component.extend({});`,
    'const foo = service();',
  ],
  invalid: [
    {
      code: `${SERVICE_IMPORT} class MyClass { @service('foo') ${SERVICE_NAME}; fooFunc() {${nonUses}} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} class MyClass {  fooFunc() {${nonUses}} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT} class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${nonUses}} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} class MyClass {  fooFunc() {${nonUses}} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT} Component.extend({ ${SERVICE_NAME}: service('foo'), fooFunc() {${nonUses}} });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} Component.extend({  fooFunc() {${nonUses}} });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT} Component.extend({ ${SERVICE_NAME}: service('foo') });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} Component.extend({  });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT} Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${nonUses}} });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} Component.extend({  fooFunc() {${nonUses}} });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT} Component.extend({ ${SERVICE_NAME}: service() });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} Component.extend({  });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    /* Using get/getProperties without @ember/object import */
    {
      code: `${SERVICE_IMPORT} class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${emberObjectUses1}} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} class MyClass {  fooFunc() {${emberObjectUses1}} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT} Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${emberObjectUses1}} });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} Component.extend({  fooFunc() {${emberObjectUses1}} });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    /* Using get/getProperties with @ember/object import for an unrelatedProp */
    {
      code: `${SERVICE_IMPORT}${EO_IMPORTS} class MyClass { @service() ${SERVICE_NAME}; fooFunc() {${emberObjectUses2}} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT}${EO_IMPORTS} class MyClass {  fooFunc() {${emberObjectUses2}} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT}${EO_IMPORTS} Component.extend({ ${SERVICE_NAME}: service(), fooFunc() {${emberObjectUses2}} });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT}${EO_IMPORTS} Component.extend({  fooFunc() {${emberObjectUses2}} });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    /* Using computed props and macros without the imports */
    {
      code: `${SERVICE_IMPORT} class MyClass { @service() ${SERVICE_NAME}; @alias('${SERVICE_NAME}') someAlias; @computed('${SERVICE_NAME}.prop') get someComputed() {} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} class MyClass {  @alias('${SERVICE_NAME}') someAlias; @computed('${SERVICE_NAME}.prop') get someComputed() {} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT} Component.extend({ ${SERVICE_NAME}: service(), someAlias1: alias('${SERVICE_NAME}'), someAlias2: computed.alias('${SERVICE_NAME}.prop'), someComputed: computed('${SERVICE_NAME}.prop', ()=>{}) });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} Component.extend({  someAlias1: alias('${SERVICE_NAME}'), someAlias2: computed.alias('${SERVICE_NAME}.prop'), someComputed: computed('${SERVICE_NAME}.prop', ()=>{}) });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    /* Using computed props and macros with the imports for an unrelatedProp */
    {
      code: `${SERVICE_IMPORT}${EO_IMPORTS}${ALIAS_IMPORT} class MyClass { @service() ${SERVICE_NAME}; @alias('unrelatedProp', '${SERVICE_NAME}') someAlias; @computed('unrelatedProp.prop') get someComputed() {} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT}${EO_IMPORTS}${ALIAS_IMPORT} class MyClass {  @alias('unrelatedProp', '${SERVICE_NAME}') someAlias; @computed('unrelatedProp.prop') get someComputed() {} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT}${EO_IMPORTS}${ALIAS_IMPORT} Component.extend({ ${SERVICE_NAME}: service(), someAlias1: alias('unrelatedProp', '${SERVICE_NAME}'), someAlias2: computed.alias('unrelatedProp.prop'), someComputed: computed('unrelatedProp.prop', ()=>{}) });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT}${EO_IMPORTS}${ALIAS_IMPORT} Component.extend({  someAlias1: alias('unrelatedProp', '${SERVICE_NAME}'), someAlias2: computed.alias('unrelatedProp.prop'), someComputed: computed('unrelatedProp.prop', ()=>{}) });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT}${EO_IMPORTS}${ALIAS_IMPORT} class MyClass { @service() ${SERVICE_NAME}; @alias(${SERVICE_NAME}) someAlias; @computed(${SERVICE_NAME}) get someComputed() {} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT}${EO_IMPORTS}${ALIAS_IMPORT} class MyClass {  @alias(${SERVICE_NAME}) someAlias; @computed(${SERVICE_NAME}) get someComputed() {} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT}${EO_IMPORTS}${ALIAS_IMPORT} Component.extend({ ${SERVICE_NAME}: service(), someAlias1: alias(${SERVICE_NAME}), someAlias2: computed.alias(${SERVICE_NAME}), someComputed: computed(${SERVICE_NAME}, ()=>{}) });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT}${EO_IMPORTS}${ALIAS_IMPORT} Component.extend({  someAlias1: alias(${SERVICE_NAME}), someAlias2: computed.alias(${SERVICE_NAME}), someComputed: computed(${SERVICE_NAME}, ()=>{}) });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    /* Using dummy macros that don't have dependent key props */
    {
      code: `${SERVICE_IMPORT} import {foobar} from '@ember/object/computed'; class MyClass { @service() ${SERVICE_NAME}; @foobar('${SERVICE_NAME}') someFoobar; }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} import {foobar} from '@ember/object/computed'; class MyClass {  @foobar('${SERVICE_NAME}') someFoobar; }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT} import {foobar} from '@ember/object/computed'; Component.extend({ ${SERVICE_NAME}: service(), someFoobar: foobar('${SERVICE_NAME}') });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} import {foobar} from '@ember/object/computed'; Component.extend({  someFoobar: foobar('${SERVICE_NAME}') });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT}${EMBER_IMPORT} Component.extend({ ${SERVICE_NAME}: service(), someFoobar: Ember.computed.foobar('${SERVICE_NAME}') });`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT}${EMBER_IMPORT} Component.extend({  someFoobar: Ember.computed.foobar('${SERVICE_NAME}') });`,
            },
          ],
          type: 'Property',
        },
      ],
    },
    /* Multiple classes */
    {
      code: `${SERVICE_IMPORT} class MyClass1 { @service() ${SERVICE_NAME}; } class MyClass2 { fooFunc() {this.${SERVICE_NAME};} }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} class MyClass1 {  } class MyClass2 { fooFunc() {this.${SERVICE_NAME};} }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT} class MyClass1 { fooFunc() {this.${SERVICE_NAME};} } class MyClass2 { @service() ${SERVICE_NAME}; }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} class MyClass1 { fooFunc() {this.${SERVICE_NAME};} } class MyClass2 {  }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    /* Nested classes */
    {
      code: `${SERVICE_IMPORT} class MyClass1 { @service() ${SERVICE_NAME}; fooFunc1() { class MyClass2 { fooFunc2() {this.${SERVICE_NAME};} } } }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} class MyClass1 {  fooFunc1() { class MyClass2 { fooFunc2() {this.${SERVICE_NAME};} } } }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
    {
      code: `${SERVICE_IMPORT} class MyClass1 { fooFunc1() {this.${SERVICE_NAME};} fooFunc2() { class MyClass2 { @service() ${SERVICE_NAME}; } } }`,
      output: null,
      errors: [
        {
          messageId: 'main',
          suggestions: [
            {
              messageId: 'removeServiceInjection',
              output: `${SERVICE_IMPORT} class MyClass1 { fooFunc1() {this.${SERVICE_NAME};} fooFunc2() { class MyClass2 {  } } }`,
            },
          ],
          type: 'ClassProperty',
        },
      ],
    },
  ],
});
