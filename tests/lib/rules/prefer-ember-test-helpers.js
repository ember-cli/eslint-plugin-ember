'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/prefer-ember-test-helpers');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const TEST_FILE_NAME = 'some-test.js';
const REGULAR_FILE_NAME = 'regular-file.js';

ruleTester.run('prefer-ember-test-helpers', rule, {
  valid: [
    // Native methods in regular files
    {
      filename: REGULAR_FILE_NAME,
      code: "blur('.some-element');",
    },
    {
      filename: REGULAR_FILE_NAME,
      code: "find('.some-element');",
    },
    {
      filename: REGULAR_FILE_NAME,
      code: "focus('.some-element');",
    },

    // Ember test helper method properly imported
    {
      filename: TEST_FILE_NAME,
      code: `import { blur } from '@ember/test-helpers';

      test('foo', async (assert) => {
        await blur('.some-element');
      });`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `import { find } from '@ember/test-helpers';

      test('foo', async (assert) => {
        await find('.some-element');
      });`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `import { focus } from '@ember/test-helpers';

      test('foo', async (assert) => {
        await focus('.some-element');
      });`,
    },

    // Wrong method on import from Ember test helpers
    {
      filename: TEST_FILE_NAME,
      code: `import { blur } from '@ember/test-helpers';

      test('foo', async (assert) => {
        await blur.wrongFunction();
      });`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `import { find } from '@ember/test-helpers';

      test('foo', async (assert) => {
        await find.wrongFunction();
      });`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `import { focus } from '@ember/test-helpers';

      test('foo', async (assert) => {
        await focus.wrongFunction();
      });`,
    },

    // Method on unrelated object called
    {
      filename: TEST_FILE_NAME,
      code: `import { blur } from '@ember/test-helpers';

      test('foo', async (assert) => {
        await WrongObject.blur();
      });`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `import { find } from '@ember/test-helpers';

      test('foo', async (assert) => {
        await WrongObject.find();
      });`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `import { focus } from '@ember/test-helpers';

      test('foo', async (assert) => {
        await WrongObject.focus();
      });`,
    },

    // Method properly imported from Ember test helpers with aliased name
    {
      filename: TEST_FILE_NAME,
      code: `import { blur as myBlurName } from '@ember/test-helpers';

      myBlurName();`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `import { find as myFindName } from '@ember/test-helpers';

      myFindName();`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `import { focus as myFocusName } from '@ember/test-helpers';

      myFocusName();`,
    },

    // Method imported from any source
    {
      filename: TEST_FILE_NAME,
      code: `import { blur } from 'irrelevant-import-path';

      blur('.some-element');`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `import { find } from 'irrelevant-import-path';

      find('.some-element');`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `import { focus } from 'irrelevant-import-path';

      focus('.some-element');`,
    },

    // Function declaration within test file
    {
      filename: TEST_FILE_NAME,
      code: `function blur(el) { console.log('blurring from element!'); }

      blur('.some-element')`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `function find(el) { console.log('finding element!'); }

      find('.some-element')`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `function focus(el) { console.log('focusing element!'); }

      focus('.some-element')`,
    },

    // Function expression within test file
    {
      filename: TEST_FILE_NAME,
      code: `const blur = function(el) { console.log('blurring from element!'); }

      blur('.some-element')`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `const find = function(el) { console.log('finding element!'); }

      find('.some-element')`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `const focus = function(el) { console.log('focusing element!'); }

      focus('.some-element')`,
    },

    // Arrow Function declaration within test file
    {
      filename: TEST_FILE_NAME,
      code: `const blur = (el) => { console.log('blurring from element!'); }

      blur('.some-element')`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `const find = (el) => { console.log('finding element!'); }

      find('.some-element')`,
    },
    {
      filename: TEST_FILE_NAME,
      code: `const focus = (el) => { console.log('focusing element!'); }

      focus('.some-element')`,
    },
  ],

  invalid: [
    {
      filename: TEST_FILE_NAME,
      code: `test('foo', async (assert) => {
        await blur('.some-element');
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `blur()` method from @ember/test-helpers',
          type: 'CallExpression',
        },
      ],
    },
    {
      filename: TEST_FILE_NAME,
      code: `test('foo', async (assert) => {
        await find('.some-element');
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `find()` method from @ember/test-helpers',
          type: 'CallExpression',
        },
      ],
    },
    {
      filename: TEST_FILE_NAME,
      code: `test('foo', async (assert) => {
        await focus('.some-element');
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `focus()` method from @ember/test-helpers',
          type: 'CallExpression',
        },
      ],
    },

    {
      // Aliased relevant import but didn't use it.
      filename: TEST_FILE_NAME,
      code: `
      import { blur as myBlurName } from '@ember/test-helpers';
      test('foo', async (assert) => {
        await blur('.some-element');
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `blur()` method from @ember/test-helpers',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Aliased relevant import but didn't use it.
      filename: TEST_FILE_NAME,
      code: `
      import { find as myFindName } from '@ember/test-helpers';
      test('foo', async (assert) => {
        await find('.some-element');
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `find()` method from @ember/test-helpers',
          type: 'CallExpression',
        },
      ],
    },
    {
      // Aliased relevant import but didn't use it.
      filename: TEST_FILE_NAME,
      code: `
      import { focus as myFocusName } from '@ember/test-helpers';
      test('foo', async (assert) => {
        await focus('.some-element');
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `focus()` method from @ember/test-helpers',
          type: 'CallExpression',
        },
      ],
    },
  ],
});
