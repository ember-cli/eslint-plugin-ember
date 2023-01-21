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
    'something.find(item => item.isValid)',
    'something.find(item => item.age === 18, {})',
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
    'replace()',
    'replace(foo)',
    'replace(foo, bar, baz)',
    /** Optional chaining */
    'arr?.notfirstObject?.foo',
    'arr?.filter?.()',
    /** String.prototype.replace() */
    "'something'.replace(regexp, 'substring')",
    "something.replace(regexp, 'substring')",

    // Global non-array class (Promise.reject)
    'window.Promise.reject();',
    'Promise.reject();',
    'Promise.reject("some reason");',
    'reject();',
    'this.reject();',

    // Global non-array class (RSVP.reject)
    'RSVP.reject();',
    'RSVP.reject("some reason");',
    'RSVP.Promise.reject();',
    'Ember.RSVP.reject();',
    'Ember.RSVP.Promise.reject();',

    // `reject()` on instance of `RSVP.defer`.
    `
    import { defer } from 'rsvp';
    const deferred = defer();
    deferred.reject();`,
    `
    import { defer } from 'rsvp';
    const requestDeferred = defer();
    requestDeferred.reject();`,
    `
    import { defer } from 'rsvp';
    const promise = defer();
    promise.reject();`,
    `
    import { defer } from 'rsvp';
    const fooPromise = defer();
    fooPromise.reject();`,

    // Global non-array class (*storage.clear)
    'window.localStorage.clear();',
    'window.sessionStorage.clear();',
    'localStorage.clear();',
    'sessionStorage.clear();',
    'sessionStorage?.clear();',
    'clear();',
    'this.clear();',

    // Global non-array class (location.replace)
    'window.document.location.replace(url)',
    'document.location.replace(url)',
    'location.replace(url)',

    // Lodash utility functions
    "lodash.compact([0, 1, false, 2, '', 3]);",
    "_.compact([0, 1, false, 2, '', 3]);",
    '_.reject(users, function(o) { return !o.active; });',
    "_.toArray({ 'a': 1, 'b': 2 });",
    '_.uniq([2, 1, 2]);',
    '_.uniqBy([2.1, 1.2, 2.3], Math.floor);',
    "_.replace('Hi Fred', 'Fred', 'Barney');",

    // jQuery
    '$( "li" ).toArray();',
    'jQuery( "li" ).toArray();',
    'jquery( "li" ).toArray();',

    // Non-array classes with clear() method
    'const foo = new Set(); foo.clear();',
    'const foo = new WeakSet(); foo.clear();',
    'const foo = new Map(); foo.clear();',
    'const foo = new WeakMap(); foo.clear();',
    'const foo = new TrackedMap(); foo.clear();',
    'const foo = new TrackedSet(); foo.clear();',
    'const foo = new TrackedWeakMap(); foo.clear();',
    'const foo = new TrackedWeakSet(); foo.clear();',

    // Variable names with the Set/Map words and Set/Map function call.
    'set.clear();',
    'map.clear();',
    'foo.set.clear();', // Longer chain.
    // PascalCase
    'Set.clear();',
    'Map.clear();',
    'SetFoo.clear();',
    'SetMap.clear();',
    'MySet.clear();',
    'MyMap.clear();',
    // camelCase
    'aSetOfStuff.clear();',
    'aMapOfStuff.clear();',
    'setOfStuff.clear();',
    'mapOfStuff.clear();',
    // UPPER_CASE
    'SET.clear();',
    'MAP.clear();',
    'SET_OF_STUFF.clear();',
    'MAP_OF_STUFF.clear();',
    'MY_SET.clear();',
    'MY_MAP.clear();',
    // snake_case
    'a_set_of_stuff.clear();',
    'a_map_of_stuff.clear();',
    'set_foo.clear();',
    'map_foo.clear();',

    // super
    'super.clear();',

    // Class property definition with non-array class.
    `class MyClass {
      foo = new Set();
      myFunc() {
        this.foo.clear();
      }
    }`,

    // Class property definition (private) with non-array class.
    `class MyClass {
      #foo = new Set();
      myFunc() {
        this.#foo.clear();
      }
    }`,

    {
      // Class property definition with non-array class (TypeScript).
      code: `
      class MyClass {
        foo: Set<UploadFile> = new Set();
        myFunc() {
          this.foo.clear();
        }
      }
      `,
      parser: require.resolve('@typescript-eslint/parser'),
    },

    {
      // Class property definition (private) with non-array class (TypeScript).
      code: `
      class MyClass {
        #foo: Set<UploadFile> = new TrackedSet();
        myFunc() {
          this.#foo.clear();
        }
      }
      `,
      parser: require.resolve('@typescript-eslint/parser'),
    },
    {
      // Class property definition (private) with non-array class (TypeScript) (does not confuse public/private properties).
      code: `
      class MyClass {
        #foo: Set<UploadFile> = new TrackedSet();
        foo: Array<UploadFile> = new Array();

        myFunc() {
          this.#foo.clear();
        }
      }
      `,
      parser: require.resolve('@typescript-eslint/parser'),
    },

    // function definition with Ember Array initialization.
    `
      function myFunction(){
        const array = A([1, 2, 3])

        array.toArray()
      }
      `,
    `
      function myFunction(){
        const array = EmberArray([1, 2, 3])

        array.without(2)
      }
      `,

    // // TODO: handle non-Identifier property names:
    'foo["clear"]();',
  ],
  invalid: [
    {
      code: '[1, 2, 3].clear()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.clear()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // map function call in chain
      code: 'something.map().clear()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // set at beginning of chain but not directly before function call.
      code: 'productSetMatcher.requiredItems.clear();',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // jquery at beginning of chain but not directly before function call.
      code: 'jquery().foo.clear()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // filterBy with two arguments
      code: `
      const arr = [];

      function getAge() {
        return 16;
      }

      arr.filterBy("age", getAge());
      `,
      output: `
      import { get } from '@ember/object';
const arr = [];

      function getAge() {
        return 16;
      }

      arr.filter(item => get(item, "age") === getAge());
      `,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // filterBy with one argument
      code: `
      const arr = [];

      arr.filterBy("age");
      `,
      output: `
      import { get } from '@ember/object';
const arr = [];

      arr.filter(item => get(item, "age"));
      `,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // filterBy with one argument and `get` import statement already imported
      code: `
      import { get as g } from '@ember/object';
      const arr = [];

      arr.filterBy("age");
      `,
      output: `
      import { get as g } from '@ember/object';
      const arr = [];

      arr.filter(item => g(item, "age"));
      `,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // filterBy with one argument and `get` import statement imported from a different package
      code: `
      import { get as g } from 'dummy';
      const arr = [];

      arr.filterBy("age");
      `,
      output: `
      import { get } from '@ember/object';
import { get as g } from 'dummy';
      const arr = [];

      arr.filter(item => get(item, "age"));
      `,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Set in variable name but not a Set function.
      code: 'set.filterBy("age", 18);',
      output: `import { get } from '@ember/object';
set.filter(item => get(item, "age") === 18);`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Set in variable name but not as its own word.
      code: 'settle.clear()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Map in variable name (front) but not as its own word.
      code: 'mApple.clear()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Map in variable name (middle) but not as its own word.
      code: 'pumaParent.clear()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Map in variable name (inside word) but not as its own word.
      code: 'mapleTree.clear()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.else.clear()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something?.firstObject?.foo',
      output: null,
      errors: [{ messageId: 'main', type: 'MemberExpression' }],
    },
    {
      code: 'something?.clear?.()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'getSomething().clear()',
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
      output: 'something.filter(item => item !== undefined && item !== null)',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of params are passed, skipping auto-fixing
      code: 'something.compact(1, getVal(), 3)',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.any()',
      output: 'something.some()',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer doesn't get triggered
      code: 'something.findBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer doesn't get triggered
      code: 'something.findBy(1, 2, 3)',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // findBy with single argument
      code: "something.findBy('abc')",
      output: `import { get } from '@ember/object';
something.find(item => get(item, 'abc'))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // findBy with two arguments
      code: "something.findBy('abc', 'def')",
      output: `import { get } from '@ember/object';
something.find(item => get(item, 'abc') === 'def')`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // findBy with two arguments and @ember/object's `get` is already imported
      code: `import { get } from '@ember/object';
      something.findBy('abc', 'def')`,
      output: `import { get } from '@ember/object';
      something.find(item => get(item, 'abc') === 'def')`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // findBy with two arguments and @ember/object's `get` is imported with an alias
      code: `import { get as g } from '@ember/object';
      something.findBy('abc', 'def')`,
      output: `import { get as g } from '@ember/object';
      something.find(item => g(item, 'abc') === 'def')`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // findBy with two arguments and `get` is imported from package other than @ember/object
      code: `import { get as g } from 'dummy';
      something.findBy('abc', 'def')`,
      output: `import { get } from '@ember/object';
import { get as g } from 'dummy';
      something.find(item => get(item, 'abc') === 'def')`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.getEach()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.getEach(1, 2)',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: "something.getEach('abc')",
      output: `import { get } from '@ember/object';
something.map(item => get(item, 'abc'))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.getEach(def)',
      output: `import { get } from '@ember/object';
something.map(item => get(item, def))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported from `@ember/object` package
      code: `import { get } from '@ember/object';
      something.getEach('abc')`,
      output: `import { get } from '@ember/object';
      something.map(item => get(item, 'abc'))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported as alias from `@ember/object` package
      code: `import { get as g } from '@ember/object';
      something.getEach('abc')`,
      output: `import { get as g } from '@ember/object';
      something.map(item => g(item, 'abc'))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported from a other than `@ember/object`
      code: `import { get as g } from 'dummy';
      something.getEach('abc')`,
      output: `import { get } from '@ember/object';
import { get as g } from 'dummy';
      something.map(item => get(item, 'abc'))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.invoke()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.invoke("abc")',
      output: `import { get } from '@ember/object';
something.map(item => get(item, "abc")?.())`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.invoke("abc", "def")',
      output: `import { get } from '@ember/object';
something.map(item => get(item, "abc")?.("def"))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported from '@ember/object' package
      code: `import { get } from '@ember/object';
      something.invoke('abc', {})`,
      output: `import { get } from '@ember/object';
      something.map(item => get(item, 'abc')?.({}))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported with alias from '@ember/object' package
      code: `import { get as g } from '@ember/object';
      something.invoke('abc', {})`,
      output: `import { get as g } from '@ember/object';
      something.map(item => g(item, 'abc')?.({}))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported from a package other than '@ember/object'
      code: `import { get as g } from '@custom/object';
      something.invoke('abc', {}, 'test', true)`,
      output: `import { get } from '@ember/object';
import { get as g } from '@custom/object';
      something.map(item => get(item, 'abc')?.({}, 'test', true))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.isAny()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.isAny("abc")',
      output: `import { get } from '@ember/object';
something.some(item => get(item, "abc"))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.isAny("abc", "def")',
      output: `import { get } from '@ember/object';
something.some(item => get(item, "abc") === "def")`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported from '@ember/object' package
      code: `import { get } from '@ember/object';
      something.isAny('abc', def)`,
      output: `import { get } from '@ember/object';
      something.some(item => get(item, 'abc') === def)`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported with alias from '@ember/object' package
      code: `import { get as g } from '@ember/object';
      something.isAny(abc, 'def')`,
      output: `import { get as g } from '@ember/object';
      something.some(item => g(item, abc) === 'def')`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported from a package other than '@ember/object'
      code: `import { get as g } from '@custom/object';
      something.isAny('abc', 'def')`,
      output: `import { get } from '@ember/object';
import { get as g } from '@custom/object';
      something.some(item => get(item, 'abc') === 'def')`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.isEvery()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.isEvery("abc")',
      output: `import { get } from '@ember/object';
something.every(item => get(item, "abc"))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.isEvery("abc", "def")',
      output: `import { get } from '@ember/object';
something.every(item => get(item, "abc") === "def")`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported from '@ember/object' package
      code: `import { get } from '@ember/object';
      something.isEvery('abc', def)`,
      output: `import { get } from '@ember/object';
      something.every(item => get(item, 'abc') === def)`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported with alias from '@ember/object' package
      code: `import { get as g } from '@ember/object';
      something.isEvery(abc, 'def')`,
      output: `import { get as g } from '@ember/object';
      something.every(item => g(item, abc) === 'def')`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` method is already imported from a package other than '@ember/object'
      code: `import { get as g } from '@custom/object';
      something.isEvery('abc', 'def')`,
      output: `import { get } from '@ember/object';
import { get as g } from '@custom/object';
      something.every(item => get(item, 'abc') === 'def')`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.mapBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.mapBy(1, 2)',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: "something.mapBy('abc')",
      output: `import { get } from '@ember/object';
something.map(item => get(item, 'abc'))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.mapBy(def)',
      output: `import { get } from '@ember/object';
something.map(item => get(item, def))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // @ember/object's `get` is already imported
      code: `import { get } from '@ember/object';
      something.mapBy('abc')`,
      output: `import { get } from '@ember/object';
      something.map(item => get(item, 'abc'))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // `get` is imported from package other than @ember/object
      code: `import { get as g } from 'dummy';
      something.mapBy('abc')`,
      output: `import { get } from '@ember/object';
import { get as g } from 'dummy';
      something.map(item => get(item, 'abc'))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.objectAt()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.objectAt(1, 2)',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.objectAt(1)',
      output: 'something[1]',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something?.objectAt(1)',
      output: 'something?.[1]',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Function call in chain
      code: 'something.somethingElse.objectAt(1)',
      output: 'something.somethingElse[1]',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Function call in optional chaining
      code: 'something.somethingElse?.objectAt(1)',
      output: 'something.somethingElse?.[1]',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.objectsAt()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.objectsAt(1, 2)',
      output: '[1, 2].map((ind) => something[ind])',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.reject()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Single argument is passed
      code: 'something.reject(function(el) { return el.isFlagged; })',
      output:
        'something.filter(function(...args) { return !(function(el) { return el.isFlagged; }).apply(this, args); })',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Two arguments are passed
      code: 'something.reject(function(el) { return el.isFlagged && this.isFlagged; }, {isFlagged: true})',
      output:
        'something.filter(function(...args) { return !(function(el) { return el.isFlagged && this.isFlagged; }).apply(this, args); }, {isFlagged: true})',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.rejectBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Single argument is passed
      code: 'something.rejectBy("abc")',
      output: `import { get } from '@ember/object';
something.filter(item => !get(item, "abc"))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Two arguments are passed
      code: 'something.rejectBy("abc", "def")',
      output: `import { get } from '@ember/object';
something.filter(item => get(item, "abc") !== "def")`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` is already imported from '@ember/object' package
      code: `import { get } from '@ember/object';
      something.rejectBy("abc")`,
      output: `import { get } from '@ember/object';
      something.filter(item => !get(item, "abc"))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` is already imported with alias from '@ember/object' package
      code: `import { get as g } from '@ember/object';
      something.rejectBy("abc")`,
      output: `import { get as g } from '@ember/object';
      something.filter(item => !g(item, "abc"))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When `get` is already imported from a package other than '@ember/object'
      code: `import { get as g } from '@custom/object';
      something.rejectBy("abc")`,
      output: `import { get } from '@ember/object';
import { get as g } from '@custom/object';
      something.filter(item => !get(item, "abc"))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.setEach()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.setEach("abc")',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.setEach("abc", 2)',
      output: `import { set } from '@ember/object';
something.forEach(item => set(item, "abc", 2))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When get method is already imported from @ember/object package.
      code: `import { set } from '@ember/object';
      something.setEach("abc", 2)`,
      output: `import { set } from '@ember/object';
      something.forEach(item => set(item, "abc", 2))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When get method is already imported as alias from @ember/object package.
      code: `import { set as s } from '@ember/object';
      something.setEach("abc", 2)`,
      output: `import { set as s } from '@ember/object';
      something.forEach(item => s(item, "abc", 2))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When get method is already imported from a package other than @ember/object.
      code: `import { set as s } from '@custom/object';
      something.setEach("abc", 2)`,
      output: `import { set } from '@ember/object';
import { set as s } from '@custom/object';
      something.forEach(item => set(item, "abc", 2))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of arguments are passed, auto-fixer will not run
      code: 'something.sortBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Arguments containing strings
      code: "something.sortBy('abc', 'def')",
      output: `import { get } from '@ember/object';
import { compare } from '@ember/utils';
[...something].sort((a, b) => {
            for (const key of ['abc', 'def']) {
              const compareValue = compare(get(a, key), get(b, key));
              if (compareValue) {
                return compareValue;
              }
            }
            return 0;
          })`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Single call expression argument.
      code: 'something.sortBy(getKey())',
      output: `import { get } from '@ember/object';
import { compare } from '@ember/utils';
[...something].sort((a, b) => {
              const key = getKey();
              return compare(get(a, key), get(b, key));
            })`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Single non CallExpression argument.
      code: "something.sortBy('abc')",
      output: `import { get } from '@ember/object';
import { compare } from '@ember/utils';
[...something].sort((a, b) => compare(get(a, 'abc'), get(b, 'abc')))`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Spread element as argument
      code: 'something.sortBy(...abc)',
      output: `import { get } from '@ember/object';
import { compare } from '@ember/utils';
[...something].sort((a, b) => {
            for (const key of [...abc]) {
              const compareValue = compare(get(a, key), get(b, key));
              if (compareValue) {
                return compareValue;
              }
            }
            return 0;
          })`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Arguments other than strings
      code: "something.sortBy('abc', def)",
      output: `import { get } from '@ember/object';
import { compare } from '@ember/utils';
[...something].sort((a, b) => {
            for (const key of ['abc', def]) {
              const compareValue = compare(get(a, key), get(b, key));
              if (compareValue) {
                return compareValue;
              }
            }
            return 0;
          })`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When compare method is already imported from @ember/utils.
      code: `import { compare } from '@ember/utils';
      something.sortBy('abc', 'def')`,
      output: `import { get } from '@ember/object';
import { compare } from '@ember/utils';
      [...something].sort((a, b) => {
            for (const key of ['abc', 'def']) {
              const compareValue = compare(get(a, key), get(b, key));
              if (compareValue) {
                return compareValue;
              }
            }
            return 0;
          })`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When compare method is already imported with alias from @ember/utils.
      code: `import { compare as comp } from '@ember/utils';
      something.sortBy('abc', 'def')`,
      output: `import { get } from '@ember/object';
import { compare as comp } from '@ember/utils';
      [...something].sort((a, b) => {
            for (const key of ['abc', 'def']) {
              const compareValue = comp(get(a, key), get(b, key));
              if (compareValue) {
                return compareValue;
              }
            }
            return 0;
          })`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When compare method is already imported from a package other than @ember/utils.
      code: `import { compare as comp } from '@custom/utils';
      something.sortBy('abc', 'def')`,
      output: `import { get } from '@ember/object';
import { compare } from '@ember/utils';
import { compare as comp } from '@custom/utils';
      [...something].sort((a, b) => {
            for (const key of ['abc', 'def']) {
              const compareValue = compare(get(a, key), get(b, key));
              if (compareValue) {
                return compareValue;
              }
            }
            return 0;
          })`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When get method is already imported from @ember/object.
      code: `import { compare as comp } from '@custom/utils';
      import { get } from '@ember/object';
      something.sortBy('abc', 'def')`,
      output: `import { compare } from '@ember/utils';
import { compare as comp } from '@custom/utils';
      import { get } from '@ember/object';
      [...something].sort((a, b) => {
            for (const key of ['abc', 'def']) {
              const compareValue = compare(get(a, key), get(b, key));
              if (compareValue) {
                return compareValue;
              }
            }
            return 0;
          })`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When get method is already imported from a package other than @ember/object.
      code: `import { compare as comp } from '@custom/utils';
      import { get as g } from '@custom/object';
      something.sortBy('abc', 'def')`,
      output: `import { get } from '@ember/object';
import { compare } from '@ember/utils';
import { compare as comp } from '@custom/utils';
      import { get as g } from '@custom/object';
      [...something].sort((a, b) => {
            for (const key of ['abc', 'def']) {
              const compareValue = compare(get(a, key), get(b, key));
              if (compareValue) {
                return compareValue;
              }
            }
            return 0;
          })`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When get method is already imported with an alias from @ember/object package.
      code: `import { compare as comp } from '@custom/utils';
      import { get as g } from '@ember/object';
      something.sortBy('abc', 'def')`,
      output: `import { compare } from '@ember/utils';
import { compare as comp } from '@custom/utils';
      import { get as g } from '@ember/object';
      [...something].sort((a, b) => {
            for (const key of ['abc', 'def']) {
              const compareValue = compare(g(a, key), g(b, key));
              if (compareValue) {
                return compareValue;
              }
            }
            return 0;
          })`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of params are passed, we will skip auto-fixing
      code: 'something.toArray(1)',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.toArray()',
      output: '[...something]',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.somethingElse.toArray()',
      output: '[...something.somethingElse]',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.uniq()',
      output: '[...new Set(something)]',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of params are passed, we will skip auto-fixing
      code: 'something.uniq(1)',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of params are passed, we will skip auto-fixing
      code: 'something.uniqBy()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Primitive value as an argument
      code: 'something.uniqBy(1)',
      output: `import { get } from '@ember/object';
something.reduce(([uniqArr, itemsSet, getterFn], item) => {
          const val = getterFn(item);
          if (!itemsSet.has(val)) {
            itemsSet.add(val);
            uniqArr.push(item);
          }
          return [uniqArr, itemsSet, getterFn];
        }, [[], new Set(), (item) => get(item, 1)])[0]`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Dynamic value as an argument
      code: 'something.uniqBy(abc)',
      output: `import { get } from '@ember/object';
something.reduce(([uniqArr, itemsSet, getterFn], item) => {
          const val = getterFn(item);
          if (!itemsSet.has(val)) {
            itemsSet.add(val);
            uniqArr.push(item);
          }
          return [uniqArr, itemsSet, getterFn];
        }, [[], new Set(), typeof abc === 'function' ? abc : (item) => get(item, abc)])[0]`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // get method is already imported from @ember/object package.
      code: `import { get } from '@ember/object';
      something.uniqBy('abc').sort()`,
      output: `import { get } from '@ember/object';
      something.reduce(([uniqArr, itemsSet, getterFn], item) => {
          const val = getterFn(item);
          if (!itemsSet.has(val)) {
            itemsSet.add(val);
            uniqArr.push(item);
          }
          return [uniqArr, itemsSet, getterFn];
        }, [[], new Set(), (item) => get(item, 'abc')])[0].sort()`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // get method is already imported from a package other than @ember/object.
      code: `import { get as g } from '@custom/object';
      something.uniqBy('abc').sort()`,
      output: `import { get } from '@ember/object';
import { get as g } from '@custom/object';
      something.reduce(([uniqArr, itemsSet, getterFn], item) => {
          const val = getterFn(item);
          if (!itemsSet.has(val)) {
            itemsSet.add(val);
            uniqArr.push(item);
          }
          return [uniqArr, itemsSet, getterFn];
        }, [[], new Set(), (item) => get(item, 'abc')])[0].sort()`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // get method is already imported with an alias from @ember/object package.
      code: `import { get as g } from '@ember/object';
      something.uniqBy('abc')`,
      output: `import { get as g } from '@ember/object';
      something.reduce(([uniqArr, itemsSet, getterFn], item) => {
          const val = getterFn(item);
          if (!itemsSet.has(val)) {
            itemsSet.add(val);
            uniqArr.push(item);
          }
          return [uniqArr, itemsSet, getterFn];
        }, [[], new Set(), (item) => g(item, 'abc')])[0]`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When arrow function expression is passed as argument
      code: `import { get as g } from '@ember/object';
      something.uniqBy(() => true)`,
      output: `import { get as g } from '@ember/object';
      something.reduce(([uniqArr, itemsSet, getterFn], item) => {
          const val = getterFn(item);
          if (!itemsSet.has(val)) {
            itemsSet.add(val);
            uniqArr.push(item);
          }
          return [uniqArr, itemsSet, getterFn];
        }, [[], new Set(), () => true])[0]`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When function expression is passed as argument
      code: `import { get as g } from '@ember/object';
      something.uniqBy(function test() { return true; })`,
      output: `import { get as g } from '@ember/object';
      something.reduce(([uniqArr, itemsSet, getterFn], item) => {
          const val = getterFn(item);
          if (!itemsSet.has(val)) {
            itemsSet.add(val);
            uniqArr.push(item);
          }
          return [uniqArr, itemsSet, getterFn];
        }, [[], new Set(), function test() { return true; }])[0]`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When function expression is passed as argument
      code: `function test() { return true; }
      import { get as g } from '@ember/object';
      something.uniqBy(test)`,
      output: `function test() { return true; }
      import { get as g } from '@ember/object';
      something.reduce(([uniqArr, itemsSet, getterFn], item) => {
          const val = getterFn(item);
          if (!itemsSet.has(val)) {
            itemsSet.add(val);
            uniqArr.push(item);
          }
          return [uniqArr, itemsSet, getterFn];
        }, [[], new Set(), typeof test === 'function' ? test : (item) => g(item, test)])[0]`,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of params are passed, we will skip auto-fixing
      code: 'something.without()',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // When unexpected number of params are passed, we will skip auto-fixing
      code: 'something.without(1, 2)',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: 'something.without(1)',
      output: '(something.indexOf(1) > -1 ? something.filter(item => item !== 1) : something)',
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      code: "something.somethingElse.without('abc')",
      output:
        "(something.somethingElse.indexOf('abc') > -1 ? something.somethingElse.filter(item => item !== 'abc') : something.somethingElse)",
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
    {
      // Variable.
      code: 'const foo = new Array(); foo.clear();',
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Class property with array value.
      code: `
      class MyClass {
        foo = new Array();
        myFunc() {
          this.foo.clear();
        }
      }`,
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Class property (private) with array value.
      code: `
      class MyClass {
        #foo = new Array();
        myFunc() {
          this.#foo.clear();
        }
      }`,
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Class property with array value (TypeScript).
      code: `
      class MyClass {
        foo: Array<UploadFile> = new Array();
        myFunc() {
          this.foo.clear();
        }
      }
      `,
      output: null,
      parser: require.resolve('@typescript-eslint/parser'),
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Class property (private) with array value (TypeScript).
      code: `
      class MyClass {
        #foo: Array<UploadFile> = new Array();
        myFunc() {
          this.#foo.clear();
        }
      }
      `,
      output: null,
      parser: require.resolve('@typescript-eslint/parser'),
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Class property definition (private) with array class (TypeScript) (does not confuse public/private properties).
      code: `
      class MyClass {
        #foo: Array<UploadFile> = new Array();
        foo: Set<UploadFile> = new Set();

        myFunc() {
          this.#foo.clear();
        }
      }
      `,
      output: null,
      parser: require.resolve('@typescript-eslint/parser'),
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Class property with no value.
      code: `
      class MyClass {
        foo;
        myFunc() {
          this.foo.clear();
        }
      }`,
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Class property but not declared anywhere.
      code: `
      class MyClass {
        myFunc() {
          this.foo.clear();
        }
      }`,
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Two classes (should not ignore first class property).
      code: `
      class MyClass1 {
        foo = new Set();
      }
      class MyClass2 {
        myFunc() {
          this.foo.clear();
        }
      }`,
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Nested classes (should not ignore outer class property).
      code: `
      class MyClass1 {
        foo = new Set();
        myFunc() {
          class MyClass2 {
            myFunc() {
              this.foo.clear();
            }
          }
        }
      }
      `,
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
    {
      // Nested classes (should remember first class properties).
      code: `
      class MyClass1 {
        foo = new Array();
        myFunc() {
          class MyClass2 {}
          this.foo.clear();
        }
      }
      `,
      output: null,
      errors: [{ messageId: 'main', type: 'CallExpression' }],
    },
  ],
});
