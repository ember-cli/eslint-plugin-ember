'use strict';

const rule = require('../../../lib/rules/no-array-prototype-extensions');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

ruleTester.run('no-array-prototype-extensions', rule, {
  valid: [
    '[1, 2, 4].filter(el => { /* ... */ })',
    'something.filter(el => { /* ... */ })',
    "filterBy(something, 'foo')",
    'this.filterBy()',
    'something[0]',
    'something[0].foo',
    "get(something, 'foo.0.bar')",
    "get(something, 'foo.0')",
    "get(something, 'foo')[0]",
    "get(something, 'firstObjects')",
    "get(something, 'lastObjects')",
    'something.length',
    'something[something.length - 1]',
    /** Replace is part of string native prototypes */
    "'something'.replace()",
    'something.replace()',
    'something.isAny',
    "something['compact']",
    /** Allow directly using Ember A() */
    `
     import { A } from '@ember/array';
     something = A();
     something.filterBy('foo');
    `,
    `
      import { isArray } from '@ember/array';
      something = isArray([1,2]);
    `,
  ],
  invalid: [
    {
      code: '[1, 2, 3].filterBy()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.filterBy()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'getSomething().filterBy()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.firstObject',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: "get(something, 'foo.firstObject')",
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: "get(something, 'firstObject')",
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: "get(something, 'foo.firstObject.bar')",
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },

    {
      code: "get(something, 'foo.lastObject')",
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: "get(something, 'lastObject')",
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: "get(something, 'foo.lastObject.bar')",
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.firstObject()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.compact()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.any()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.findBy()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.getEach()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.invoke()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.isAny()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.isEvery()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.mapBy()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.objectAt()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.objectsAt()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.reject()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.rejectBy()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.setEach()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.sortBy()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.toArray()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.uniq()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.uniqBy()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.without()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.lastObject',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.addObject()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.addObjects()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.clear()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.insertAt()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.popObject()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.pushObject()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.pushObjects()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.removeAt()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.removeObject()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.removeObjects()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.reverseObjects()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.setObject()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.shiftObject()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.unshiftObject()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: 'something.unshiftObjects()',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
  ],
});
