'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-tracked-built-ins');
const RuleTester = require('eslint').RuleTester;

const parserOptions = { ecmaVersion: 2022, sourceType: 'module' };

const { ERROR_MESSAGE_IMPORT } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions,
  parser: require.resolve('@babel/eslint-parser'),
});

ruleTester.run('no-tracked-built-ins', rule, {
  valid: [
    // Already using @ember/reactive
    "import { trackedArray } from '@ember/reactive';",
    "import { trackedObject, trackedMap } from '@ember/reactive';",

    // Not tracked-built-ins
    "import { something } from 'other-package';",
    "import { TrackedArray } from 'some-other-package';",

    // No import at all
    'const arr = [];',
  ],

  invalid: [
    // Single named import
    {
      code: "import { TrackedArray } from 'tracked-built-ins';",
      output: "import { trackedArray } from '@ember/reactive';",
      errors: [{ message: ERROR_MESSAGE_IMPORT, type: 'ImportDeclaration' }],
    },

    // Multiple named imports
    {
      code: "import { TrackedArray, TrackedObject } from 'tracked-built-ins';",
      output: "import { trackedArray, trackedObject } from '@ember/reactive';",
      errors: [{ message: ERROR_MESSAGE_IMPORT, type: 'ImportDeclaration' }],
    },

    // All tracked imports
    {
      code: "import { TrackedArray, TrackedObject, TrackedMap, TrackedSet, TrackedWeakMap, TrackedWeakSet } from 'tracked-built-ins';",
      output:
        "import { trackedArray, trackedObject, trackedMap, trackedSet, trackedWeakMap, trackedWeakSet } from '@ember/reactive';",
      errors: [{ message: ERROR_MESSAGE_IMPORT, type: 'ImportDeclaration' }],
    },

    // Aliased import
    {
      code: "import { TrackedArray as TA } from 'tracked-built-ins';",
      output: "import { trackedArray as TA } from '@ember/reactive';",
      errors: [{ message: ERROR_MESSAGE_IMPORT, type: 'ImportDeclaration' }],
    },

    // Default import (no autofix)
    {
      code: "import TrackedBuiltins from 'tracked-built-ins';",
      output: null,
      errors: [{ message: ERROR_MESSAGE_IMPORT, type: 'ImportDeclaration' }],
    },

    // Default import with named imports (no autofix)
    {
      code: "import TrackedBuiltins, { TrackedArray } from 'tracked-built-ins';",
      output: null,
      errors: [{ message: ERROR_MESSAGE_IMPORT, type: 'ImportDeclaration' }],
    },

    // new TrackedArray() with import
    {
      code: `import { TrackedArray } from 'tracked-built-ins';
const arr = new TrackedArray([1, 2, 3]);`,
      output: `import { trackedArray } from '@ember/reactive';
const arr = trackedArray([1, 2, 3]);`,
      errors: [
        { message: ERROR_MESSAGE_IMPORT, type: 'ImportDeclaration' },
        {
          message:
            'Use `trackedArray(...)` instead of `new TrackedArray(...)`. The `@ember/reactive` utilities do not use `new`.',
          type: 'NewExpression',
        },
      ],
    },

    // new TrackedObject() with import
    {
      code: `import { TrackedObject } from 'tracked-built-ins';
const obj = new TrackedObject({ a: 1 });`,
      output: `import { trackedObject } from '@ember/reactive';
const obj = trackedObject({ a: 1 });`,
      errors: [
        { message: ERROR_MESSAGE_IMPORT, type: 'ImportDeclaration' },
        {
          message:
            'Use `trackedObject(...)` instead of `new TrackedObject(...)`. The `@ember/reactive` utilities do not use `new`.',
          type: 'NewExpression',
        },
      ],
    },

    // new TrackedMap() with import
    {
      code: `import { TrackedMap } from 'tracked-built-ins';
const map = new TrackedMap();`,
      output: `import { trackedMap } from '@ember/reactive';
const map = trackedMap();`,
      errors: [
        { message: ERROR_MESSAGE_IMPORT, type: 'ImportDeclaration' },
        {
          message:
            'Use `trackedMap(...)` instead of `new TrackedMap(...)`. The `@ember/reactive` utilities do not use `new`.',
          type: 'NewExpression',
        },
      ],
    },

    // Aliased import with new expression
    {
      code: `import { TrackedArray as TA } from 'tracked-built-ins';
const arr = new TA([1, 2, 3]);`,
      output: `import { trackedArray as TA } from '@ember/reactive';
const arr = TA([1, 2, 3]);`,
      errors: [
        { message: ERROR_MESSAGE_IMPORT, type: 'ImportDeclaration' },
        {
          message:
            'Use `trackedArray(...)` instead of `new TA(...)`. The `@ember/reactive` utilities do not use `new`.',
          type: 'NewExpression',
        },
      ],
    },

    // Multiple new expressions
    {
      code: `import { TrackedArray, TrackedMap } from 'tracked-built-ins';
const arr = new TrackedArray();
const map = new TrackedMap();`,
      output: `import { trackedArray, trackedMap } from '@ember/reactive';
const arr = trackedArray();
const map = trackedMap();`,
      errors: [
        { message: ERROR_MESSAGE_IMPORT, type: 'ImportDeclaration' },
        {
          message:
            'Use `trackedArray(...)` instead of `new TrackedArray(...)`. The `@ember/reactive` utilities do not use `new`.',
          type: 'NewExpression',
        },
        {
          message:
            'Use `trackedMap(...)` instead of `new TrackedMap(...)`. The `@ember/reactive` utilities do not use `new`.',
          type: 'NewExpression',
        },
      ],
    },
  ],
});
