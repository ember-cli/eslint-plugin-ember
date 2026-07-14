const path = require('path');
const rule = require('../../../lib/rules/no-get');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE_GET, ERROR_MESSAGE_GET_PROPERTIES } = rule;

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-get', rule, {
  valid: [
    // **************************
    // get
    // **************************

    // Nested property path.
    {
      code: "this.get('foo.bar');",
      options: [{ ignoreNestedPaths: true, useOptionalChaining: false }],
    },
    {
      code: "import { get } from '@ember/object'; get(this, 'foo.bar');",
      options: [{ ignoreNestedPaths: true, useOptionalChaining: false }],
    },

    // Template literals.
    {
      code: 'this.get(`foo`);',
      parserOptions: { ecmaVersion: 2022 },
    },
    {
      code: "import { get } from '@ember/object'; get(this, `foo`);",
      parserOptions: { ecmaVersion: 2022 },
    },

    // Not `this`.
    "foo.get('bar');",
    {
      code: "import { get } from '@ember/object'; get(foo, 'bar');",
      options: [{ catchSafeObjects: false }],
    },

    // Not `get`.
    "this.foo('bar');",
    "foo(this, 'bar');",

    // Unknown extra argument.
    "this.get('foo', 'bar');",
    "import { get } from '@ember/object'; get(this, 'foo', 'bar');",

    // Non-string, non-numerical parameter.
    'this.get(MY_PROP);',
    "import { get } from '@ember/object'; get(this, MY_PROP);",

    // Unknown sub-function call:
    "this.get.foo('bar');",
    "import { get } from '@ember/object'; get.foo(this, 'bar');",

    // In mirage directory
    {
      filename: path.join('app', 'mirage', 'config.js'),
      code: 'this.get("/resources")',
    },

    // Missing import:
    "get(this, 'foo');",

    // Ternary expressions with non-literal consequent or alternate
    'this.get(foo ? bar : baz)',
    `
    import { get } from '@ember/object';
    import { somethingElse } from '@ember/object';
    import { random } from 'random';

    const buzz = get(foo, bar ? baz : biz);
    `,

    // **************************
    // getProperties
    // **************************

    // Nested property path.
    {
      code: "this.getProperties('foo', 'bar.baz');",
      options: [{ ignoreNestedPaths: true, useOptionalChaining: false }],
    },
    {
      code: "this.getProperties(['foo', 'bar.baz']);",
      options: [{ ignoreNestedPaths: true, useOptionalChaining: false }],
    }, // With parameters in array.
    {
      code: "import { getProperties } from '@ember/object'; getProperties(this, 'foo', 'bar.baz');",
      options: [{ ignoreNestedPaths: true, useOptionalChaining: false }],
    },
    {
      code: "import { getProperties } from '@ember/object'; getProperties(this, ['foo', 'bar.baz']);",
      options: [{ ignoreNestedPaths: true, useOptionalChaining: false }],
    }, // With parameters in array.

    // Template literals.
    'this.getProperties(`prop1`, `prop2`);',
    "import { getProperties } from '@ember/object'; getProperties(this, `prop1`, `prop2`);",

    // Not `this`.
    "myObject.getProperties('prop1', 'prop2');",
    {
      code: "import { getProperties } from '@ember/object'; getProperties(myObject, 'prop1', 'prop2');",
      options: [{ catchSafeObjects: false }],
    },

    // Not `getProperties`.
    "this.foo('prop1', 'prop2');",

    // Non-string parameter.
    'this.getProperties(MY_PROP);',
    'this.getProperties(...MY_PROPS);',
    'this.getProperties([MY_PROP]);',
    "import { getProperties } from '@ember/object'; getProperties(this, MY_PROP);",
    "import { getProperties } from '@ember/object'; getProperties(this, ...MY_PROPS);",
    "import { getProperties } from '@ember/object'; getProperties(this, [MY_PROP]);",

    // Unknown sub-function call:
    "this.getProperties.foo('prop1', 'prop2');",

    // Missing import:
    "getProperties(this, 'prop1', 'prop2');",

    // With ignoreGetProperties: true
    {
      code: "this.getProperties('prop1', 'prop2');",
      options: [{ ignoreGetProperties: true }],
    },
    {
      code: "this.getProperties(['prop1', 'prop2']);", // With parameters in array.
      options: [{ ignoreGetProperties: true }],
    },
    {
      code: "import { getProperties } from '@ember/object'; getProperties(this, 'prop1', 'prop2');",
      options: [{ ignoreGetProperties: true }],
    },
    {
      code: "import { getProperties } from '@ember/object'; getProperties(this, ['prop1', 'prop2']);", // With parameters in array.
      options: [{ ignoreGetProperties: true }],
    },

    // Ignores `get()` inside proxy objects (which still require using `get()`):
    `
    import ObjectProxy from '@ember/object/proxy';
    export default ObjectProxy.extend({
      someFunction() {
        test();
        console.log(this.get('propertyInsideProxyObject'));
      }
    });
    `,
    `
    import ArrayProxy from '@ember/array/proxy';
    export default ArrayProxy.extend({
      someFunction() {
        test();
        console.log(this.get('propertyInsideProxyObject'));
      }
    });
    `,
    `
    import ArrayProxy from '@ember/array/proxy';
    class MyProxy extends ArrayProxy {
      someFunction() {
        test();
        console.log(this.get('propertyInsideProxyObject'));
      }
    }
    `,
    `
    import ArrayProxy from '@ember/array/proxy';
    class MyProxy extends ArrayProxy.extend(SomeMixin) {
      someFunction() {
        test();
        console.log(this.get('propertyInsideProxyObject'));
      }
    }
    `,

    // Ignores `get()` inside classes with `unknownProperty`:
    `
    import EmberObject from '@ember/object';
    export default EmberObject.extend({
      unknownProperty() {},
      someFunction() {
        console.log(this.get('propertyInsideClassWithUnknownProperty'));
      }
    });
    `,
    `
    import EmberObject from '@ember/object';
    class MyClass extends EmberObject {
      unknownProperty() {}
      someFunction() {
        console.log(this.get('propertyInsideClassWithUnknownProperty'));
      }
    }
    `,

    // Optional chaining:
    'this.foo?.bar',
    'this.foo?.[0]?.bar',
  ],
  invalid: [
    // **************************
    // get
    // **************************

    {
      code: "this.get('foo');",
      output: 'this.foo;',
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      code: "foo1.foo2.get('bar');",
      output: 'foo1.foo2.bar;',
      options: [{ catchUnsafeObjects: true }],
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      code: "foo1.foo2.get('bar').baz;",
      output: 'foo1.foo2.bar.baz;',
      options: [{ catchUnsafeObjects: true, useOptionalChaining: true }],
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      // useOptionalChaining = false
      // We can safely autofix nested paths when the result of get() is chained,
      code: "foo1.foo2.get('bar.bar').baz;",
      output: 'foo1.foo2.bar.bar.baz;',
      options: [{ catchUnsafeObjects: true, useOptionalChaining: false }],
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      // useOptionalChaining = true (implicit)
      code: "foo1.foo2.get('bar.bar').baz;",
      output: 'foo1.foo2.bar.bar.baz;',
      options: [{ catchUnsafeObjects: true }],
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      // useOptionalChaining = true (explicit)
      code: "foo1.foo2.get('bar.bar').baz;",
      output: 'foo1.foo2.bar.bar.baz;',
      options: [{ catchUnsafeObjects: true, useOptionalChaining: true }],
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      code: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      get(this, 'foo');
      `,
      output: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      this.foo;
      `,
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      // Calling the imported function on an unknown object (without `this`).
      code: "import { get } from '@ember/object'; get(foo1.foo2, 'bar');",
      output: "import { get } from '@ember/object'; foo1.foo2.bar;",
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      // Calling the imported function on an unknown object (without `this`) with an object argument that needs parenthesis.
      code: "import { get } from '@ember/object'; get(foo || {}, 'bar');",
      output: "import { get } from '@ember/object'; (foo || {}).bar;",
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      // With renamed import:
      code: "import { get as g } from '@ember/object'; g(this, 'foo');",
      output: "import { get as g } from '@ember/object'; this.foo;",
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "this.get('foo').someFunction();",
      output: 'this.foo.someFunction();',
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // With invalid JS variable name:
      code: "this.get('foo-bar');",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // With invalid JS variable name:
      code: "import { get } from '@ember/object'; get(this, 'foo-bar');",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },

    // **************************
    // getProperties
    // **************************

    {
      code: "let obj = this.getProperties('prop1', 'prop2');",
      output: 'let obj = { prop1: this.prop1, prop2: this.prop2 };',
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: "const baz = foo.getProperties('prop1', 'prop2');",
      output: 'const baz = { prop1: foo.prop1, prop2: foo.prop2 };',
      options: [{ catchUnsafeObjects: true }],
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: "const obj = this.getProperties(['prop1', 'prop2']);", // With parameters in array.
      output: 'const obj = { prop1: this.prop1, prop2: this.prop2 };',
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: "const obj = this.getProperties('1');", // With invalid JS variable name.
      output: null,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: "const obj = this.getProperties('a*');", // With invalid JS variable name.
      output: null,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: "const obj = this.getProperties('obj.foo');", // With invalid JS variable name.
      output: null,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: `
      import { getProperties } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      const obj = getProperties(this, 'prop1', 'prop2');
      `,
      output: `
      import { getProperties } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      const obj = { prop1: this.prop1, prop2: this.prop2 };
      `,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: `
      import { getProperties } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      function foo(){
        return getProperties(this, 'prop1', 'prop2');
      }
      `,
      output: `
      import { getProperties } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      function foo(){
        return { prop1: this.prop1, prop2: this.prop2 };
      }
      `,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      // Calling the imported function on an unknown object (without `this`).
      code: "import { getProperties } from '@ember/object'; let obj = getProperties(foo, 'prop1', 'prop2');",
      output:
        "import { getProperties } from '@ember/object'; let obj = { prop1: foo.prop1, prop2: foo.prop2 };",
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      // With renamed import:
      code: "import { getProperties as gp } from '@ember/object'; const obj = gp(this, 'prop1', 'prop2');",
      output:
        "import { getProperties as gp } from '@ember/object'; const obj = { prop1: this.prop1, prop2: this.prop2 };",
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: "import { getProperties } from '@ember/object'; const obj = getProperties(this, ['prop1', 'prop2']);", // With parameters in array.
      output:
        "import { getProperties } from '@ember/object'; const obj = { prop1: this.prop1, prop2: this.prop2 };",
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: `
      import { getProperties } from '@ember/object';
      const { foo, bar } = getProperties(
        this.obj,
        "foo",
        "bar"
      );
      `,
      output: `
      import { getProperties } from '@ember/object';
      const { foo, bar } = this.obj;
      `,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: `
      import { getProperties } from '@ember/object';
      const { foo: qux, bar } = getProperties(
        this.obj,
        "bar",
        "foo"
      );
      `,
      output: `
      import { getProperties } from '@ember/object';
      const { foo: qux, bar } = this.obj;
      `,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: `
      import { getProperties } from '@ember/object';
      const { foo, bar, ...qux } = getProperties(
        this.obj,
        "foo",
        "bar",
        "baz",
        "frex"
      );
      `,
      output: `
      import { getProperties } from '@ember/object';
      const { foo, bar, ...qux } = this.obj;
      `,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: `
      import { getProperties } from '@ember/object';

      const { foo, bar, baz } = getProperties(
        get(obj, 't.s'),
        'foo',
        'bar',
        'baz',
      );
      `,
      output: `
      import { getProperties } from '@ember/object';

      const { foo, bar, baz } = get(obj, 't.s');
      `,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },

    // Nested paths:
    {
      code: "this.get('foo.bar');",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "import { get } from '@ember/object'; get(this, 'foo.bar');",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "this.getProperties('foo.bar');",
      output: null,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: "import { getProperties } from '@ember/object'; getProperties(this, 'foo.bar');",
      output: null,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },

    // Nested paths with optional chaining:
    {
      code: "this.get('foo.bar');",
      output: 'this.foo?.bar;',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "this.get('foo.bar').baz;",
      output: 'this.foo.bar.baz;',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "this.get('very.long.path');",
      output: 'this.very?.long?.path;',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "import { get } from '@ember/object'; get(this, 'foo.bar');",
      output: "import { get } from '@ember/object'; this.foo?.bar;",
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "import { get } from '@ember/object'; get(this, 'very.long.path');",
      output: "import { get } from '@ember/object'; this.very?.long?.path;",
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "this.get('foo');", // No nested path.
      output: 'this.foo;',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // Optional chaining is not valid in the left side of an assignment,
      // and we can safely autofix nested paths without it anyway.
      code: "this.get('foo.bar')[123] = 'hello world';",
      output: "this.foo.bar[123] = 'hello world';",
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // Handle array element access with optional chaining (beginning/middle/end of string).
      code: "this.get('0.foo1.1.2.bar1bar.3')",
      output: 'this[0]?.foo1?.[1]?.[2]?.bar1bar?.[3]',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // Handle array element access as entire string.
      code: "this.get('0')",
      output: 'this[0]',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // Handle array element access (left side of an assignment, beginning/middle/end of string).
      code: "this.get('0.foo.1.bar.2')[123] = 'hello world';",
      output: "this[0].foo[1].bar[2][123] = 'hello world';",
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // We can safely autofix nested paths when the result of get() is chained,
      code: "this.get('foo.0.bar')[123];",
      output: 'this.foo[0].bar[123];',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // Handle array element access (left side of an assignment, entire string).
      code: "this.get('0')[123] = 'hello world';",
      output: "this[0][123] = 'hello world';",
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // We can safely autofix nested paths in the left side of an assignment,
      // even when the `useOptionalChaining` option is off.
      code: "this.get('foo.bar')[123] = 'hello world';",
      output: "this.foo.bar[123] = 'hello world';",
      options: [{ useOptionalChaining: false }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // handle ember's Array prototype extensions for `firstObject`
      code: "foo.get('firstObject');",
      output: 'foo[0];',
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // handle ember's Array prototype extensions for `firstObject`
      code: "foo.get('lastObject');",
      output: 'foo[foo.length - 1];',
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // handle ember's Array prototype extensions for `firstObject`
      code: "this.get('foo.firstObject.bar');",
      output: 'this.foo[0].bar;',
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // handle ember's Array prototype extensions for `firstObject`
      code: "this.get('foo.lastObject.bar');",
      output: 'this.foo[this.foo.length - 1].bar;',
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },

    {
      code: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      get(this, 'foo.firstObject.bar');
      `,
      output: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      this.foo?.[0]?.bar;
      `,
      options: [{ useOptionalChaining: true }],
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      code: `
      import { get as g } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      g(obj.baz.qux, 'foo.firstObject.bar');
      `,
      output: `
      import { get as g } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      obj.baz.qux.foo?.[0]?.bar;
      `,
      options: [{ useOptionalChaining: true }],
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      // `firstObject` used in the middle of a path.
      // And the result of get() is chained (getResultIsChained=true).
      code: "this.get('foo.firstObject.bar')[123];",
      output: 'this.foo[0].bar[123];',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // `firstObject` used in multiple places in a path.
      // And the result of get() is chained (getResultIsChained=true).
      code: "this.get('firstObject.foo.firstObject.bar')[123];",
      output: 'this[0].foo[0].bar[123];',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // `firstObject` used in the middle of a path.
      // And the resolved path of `get` is NOT chained (getResultIsChained=false).
      code: "this.get('foo.firstObject.bar');",
      output: 'this.foo?.[0]?.bar;',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // `firstObject` used at the beginning of a path.
      // And the resolved path of `get` is NOT chained (getResultIsChained=false).
      code: "this.get('firstObject.bar');",
      output: 'this[0]?.bar;',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // `firstObject` used as the entire path.
      // And the result of get() is chained (getResultIsChained=true).
      code: "this.get('firstObject')[123];",
      output: 'this[0][123];',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // `firstObject` used in the middle of a path.
      // And `get` is used in a left side of an assignment (isInLeftSideOfAssignmentExpression=true).
      code: "this.get('foo.firstObject.bar')[123] = 'hello world';",
      output: "this.foo[0].bar[123] = 'hello world';",
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // `lastObject` used in the middle of a path.
      // And the result of get() is chained (getResultIsChained=true).
      code: "this.get('foo.lastObject.bar')[123];",
      output: 'this.foo.at(-1).bar[123];',
      options: [{ useOptionalChaining: true, useAt: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // useAt default value
      // `lastObject` used at the beginning of a path.
      // And the result of get() is chained (getResultIsChained=true).
      code: "this.get('lastObject.bar')[123];",
      output: 'this.at(-1).bar[123];',
      options: [{ useOptionalChaining: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // `lastObject` used at the beginning of a path.
      // And the result of get() is chained (getResultIsChained=true).
      code: "this.get('lastObject.bar')[123];",
      output: 'this.at(-1).bar[123];',
      options: [{ useOptionalChaining: true, useAt: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // `lastObject` used as the entire path.
      // And the result of get() is chained (getResultIsChained=true).
      code: "this.get('lastObject')[123];",
      output: 'this.at(-1)[123];',
      options: [{ useOptionalChaining: true, useAt: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // `lastObject` used in the middle of a path.
      // And the resolved path of `get` is NOT chained (getResultIsChained=false).
      code: "this.get('foo.lastObject.bar');",
      output: 'this.foo?.at(-1)?.bar;',
      options: [{ useOptionalChaining: true, useAt: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // `lastObject` used at the beginning of a path.
      // And the resolved path of `get` is NOT chained (getResultIsChained=false).
      code: "this.get('lastObject.bar');",
      output: 'this.at(-1)?.bar;',
      options: [{ useOptionalChaining: true, useAt: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // multiple `lastObject` used in the middle of a path.
      // And the result of get() is chained (getResultIsChained=true).
      code: "this.get('foo.lastObject.bar.lastObject')[123];",
      output: 'this.foo.at(-1).bar.at(-1)[123];',
      options: [{ useOptionalChaining: true, useAt: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // `lastObject` used at the beginning of a path.
      // And the result of get() is chained (getResultIsChained=true).
      code: "this.get('lastObject.bar.lastObject')[123];",
      output: 'this.at(-1).bar.at(-1)[123];',
      options: [{ useOptionalChaining: true, useAt: true }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },

    {
      // useAt = false.
      // `lastObject` used at the beginning of a path.
      // And the resolved path of `get` is NOT chained (getResultIsChained=false).
      code: "this.get('lastObject.bar');",
      output: 'this[this.length - 1]?.bar;',
      options: [{ useOptionalChaining: true, useAt: false }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // useAt = false.
      // `lastObject` used as the entire path.
      // And the result of get() is chained (getResultIsChained=true).
      code: "this.get('lastObject')[123];",
      output: 'this[this.length - 1][123];',
      options: [{ useOptionalChaining: true, useAt: false }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      //  useAt = false.
      // multiple `lastObject` used in the middle of a path.
      // And the result of get() is chained (getResultIsChained=true).
      code: "this.get('foo.lastObject.bar.lastObject')[123];",
      output: null,
      options: [{ useOptionalChaining: true, useAt: false }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      //  useAt = false.
      // `lastObject` used in the middle of a path.
      // And the resolved path of `get` is NOT chained (getResultIsChained=false).
      code: "this.get('foo.lastObject.bar');",
      output: 'this.foo?.[this.foo.length - 1]?.bar;',
      options: [{ useOptionalChaining: true, useAt: false }],
      errors: [
        {
          message: ERROR_MESSAGE_GET,
          type: 'CallExpression',
        },
      ],
    },
    {
      // Reports violation after (classic) proxy class.
      code: `
      import ArrayProxy from '@ember/array/proxy';
      export default ArrayProxy.extend({
        someFunction() {
          test();
          console.log(this.get('propertyInsideProxyObject'));
        }
      });
      this.get('propertyOutsideClass');
      `,
      output: `
      import ArrayProxy from '@ember/array/proxy';
      export default ArrayProxy.extend({
        someFunction() {
          test();
          console.log(this.get('propertyInsideProxyObject'));
        }
      });
      this.propertyOutsideClass;
      `,
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      // Reports violation after (native) proxy class.
      code: `
      import ArrayProxy from '@ember/array/proxy';
      class MyProxy extends ArrayProxy {
        someFunction() {
          test();
          console.log(this.get('propertyInsideProxyObject'));
        }
      }
      this.get('propertyOutsideClass');
      `,
      output: `
      import ArrayProxy from '@ember/array/proxy';
      class MyProxy extends ArrayProxy {
        someFunction() {
          test();
          console.log(this.get('propertyInsideProxyObject'));
        }
      }
      this.propertyOutsideClass;
      `,
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },

    {
      // Reports violation after (classic) class with `unknownProperty()`.
      code: `
      import EmberObject from '@ember/object';
      export default EmberObject.extend({
        unknownProperty() {},
        someFunction() {
          console.log(this.get('propertyInsideClassWithUnknownProperty'));
        }
      });
      this.get('propertyOutsideClass');
      `,
      output: `
      import EmberObject from '@ember/object';
      export default EmberObject.extend({
        unknownProperty() {},
        someFunction() {
          console.log(this.get('propertyInsideClassWithUnknownProperty'));
        }
      });
      this.propertyOutsideClass;
      `,
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      // Reports violation after (native) class with `unknownProperty()`.
      code: `
      import EmberObject from '@ember/object';
      class MyClass extends EmberObject {
        unknownProperty() {}
        someFunction() {
          console.log(this.get('propertyInsideClassWithUnknownProperty'));
        }
      }
      this.get('propertyOutsideClass');
      `,
      output: `
      import EmberObject from '@ember/object';
      class MyClass extends EmberObject {
        unknownProperty() {}
        someFunction() {
          console.log(this.get('propertyInsideClassWithUnknownProperty'));
        }
      }
      this.propertyOutsideClass;
      `,
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    // Accessing numerical property with get
    {
      code: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      get(foo, 5);
      `,
      output: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';
      foo[5];
      `,
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      code: 'this.get(5);',
      output: 'this[5];',
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    // Logical and conditional expressions
    {
      code: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      const bar = baz ? get(foo, 'biz') : get(foo, 'buzz');
      `,
      output: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      const bar = baz ? foo.biz : foo.buzz;
      `,
      errors: [
        { message: ERROR_MESSAGE_GET, type: 'CallExpression' },
        { message: ERROR_MESSAGE_GET, type: 'CallExpression' },
      ],
    },
    {
      code: "foo ? this.get('bar') : this.get('baz')",
      output: 'foo ? this.bar : this.baz',
      errors: [
        { message: ERROR_MESSAGE_GET, type: 'CallExpression' },
        { message: ERROR_MESSAGE_GET, type: 'CallExpression' },
      ],
    },
    {
      code: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      const bar = get(foo, 'biz') || get(foo, 'buzz');
      `,
      output: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      const bar = foo.biz || foo.buzz;
      `,
      errors: [
        { message: ERROR_MESSAGE_GET, type: 'CallExpression' },
        { message: ERROR_MESSAGE_GET, type: 'CallExpression' },
      ],
    },
    {
      code: "this.get('bar') || this.get('baz')",
      output: 'this.bar || this.baz',
      errors: [
        { message: ERROR_MESSAGE_GET, type: 'CallExpression' },
        { message: ERROR_MESSAGE_GET, type: 'CallExpression' },
      ],
    },
    // Ternary expressions with literal consequent and alternate
    {
      code: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      const buzz = get(foo, bar ? 'biz' : 'baz');
      `,
      output: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      const buzz = bar ? foo.biz : foo.baz;
      `,
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      code: "this.get(foo ? 'bar' : 'baz')",
      output: 'foo ? this.bar : this.baz',
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      code: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      const buzz = get(foo, bar ? 5 : 'baz');
      `,
      output: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      const buzz = bar ? foo[5] : foo.baz;
      `,
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      code: "this.get(foo ? 5 : 'baz')",
      output: 'foo ? this[5] : this.baz',
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    // Ternary expressions with literal consequent and alternate with optional chaining
    {
      code: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      const buzz = get(foo, bar ? 'biz.baz' : 'baz.biz');
      `,
      output: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      const buzz = bar ? foo.biz?.baz : foo.baz?.biz;
      `,
      options: [{ useOptionalChaining: true }],
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      code: "this.get(foo ? 'bar.baz' : 'baz.bar')",
      output: 'foo ? this.bar?.baz : this.baz?.bar',
      options: [{ useOptionalChaining: true }],
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    // Ternary expressions with left-hand side of assignment expression
    {
      code: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      get(foo, bar ? 'biz' : 'baz').buzz = 'something';
      `,
      output: `
      import { get } from '@ember/object';
      import { somethingElse } from '@ember/object';
      import { random } from 'random';

      (bar ? foo.biz : foo.baz).buzz = 'something';
      `,
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
    {
      code: "this.get(foo ? 'bar' : 'baz').buzz = 'something';",
      output: "(foo ? this.bar : this.baz).buzz = 'something';",
      errors: [{ message: ERROR_MESSAGE_GET, type: 'CallExpression' }],
    },
  ],
});
