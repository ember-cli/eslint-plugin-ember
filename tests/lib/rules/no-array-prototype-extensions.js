'use strict';

const rule = require('../../../lib/rules/no-array-prototype-extensions');
const RuleTester = require('eslint').RuleTester;

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
    "get(something, 'notfirstObject')",
    "get(something, 'lastObjectSibling')",
    "get(something, 'foo.lastObjectSibling.bar')",
    'firstObject',
    'lastObject',
    'something.length',
    'something.firstObject()',
    'something[something.length - 1]',
    'something.isAny',
    "something['compact']",
    /** Optional chaining */
    'arr?.notfirstObject?.foo',
    'arr?.filter?.()',
    /** String.prototype.replace() */
    "'something'.replace(regexp, 'substring')",
    "something.replace(regexp, 'substring')",
  ],
  invalid: [
    {
      code: '[1, 2, 3].filterBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.filterBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something?.firstObject?.foo',
      output: null,
      errors: [{ messageId: 'main', type: 'MemberExpression' }],
    },
    {
      code: 'something?.filterBy?.()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'getSomething().filterBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.firstObject',
      output: null,
      errors: [{ messageId: 'main', type: 'MemberExpression' }],
    },
    {
      code: "get(something, 'foo.firstObject')",
      output: null,
      errors: [{ messageId: 'main', type: 'Literal' }],
    },
    {
      code: "get(something, 'firstObject')",
      output: null,
      errors: [{ messageId: 'main', type: 'Literal' }],
    },
    {
      code: "set(something, 'foo.firstObject.bar', 'something')",
      output: null,
      errors: [{ messageId: 'main', type: 'Literal' }],
    },

    {
      code: "get(something, 'foo.lastObject')",
      output: null,
      errors: [{ messageId: 'main', type: 'Literal' }],
    },
    {
      code: "set(something, 'lastObject', 'something')",
      output: null,
      errors: [{ messageId: 'main', type: 'Literal' }],
    },
    {
      code: "get(something, 'foo.lastObject.bar')",
      output: null,
      errors: [{ messageId: 'main', type: 'Literal' }],
    },
    {
      code: 'something.compact()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.any()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.findBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.getEach()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.invoke()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.isAny()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.isEvery()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.mapBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.objectAt()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.objectsAt()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.reject()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.rejectBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.setEach()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.sortBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.toArray()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.uniq()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.uniqBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.without()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.lastObject',
      output: null,
      errors: [{ messageId: 'main', type: 'MemberExpression' }],
    },
    {
      code: 'something.addObject()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.addObjects()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.clear()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.insertAt()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.popObject()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.pushObject()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.pushObjects()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.removeAt()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.removeObject()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.removeObjects()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.reverseObjects()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.setObject()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.shiftObject()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.unshiftObject()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.unshiftObjects()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.replace(1, 2, someArray)',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
  ],
});
