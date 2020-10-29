const rule = require('../../../lib/rules/no-test-import-export');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});
const NO_IMPORT_MESSAGE = rule.meta.importMessage;
const NO_EXPORT_MESSAGE = rule.meta.exportMessage;

ruleTester.run('no-test-import-export', rule, {
  valid: [
    `
        import setupModule from './some-test-helper';
        import { module, test } from 'qunit';

        module('Acceptance | module', setupModule());
      `,
    {
      filename: 'tests/some-test-helper.js',
      code: `
        export function beforeEachSetup(){};
      `,
    },

    // Exporting from files in tests/helpers is allowed.
    {
      filename: 'tests/helpers/setup-application-test.js',
      code: 'export default function setupApplicationTest(){};',
    },
    {
      filename: 'tests/helpers/index.js',
      code: 'export function setupApplicationTest(){};',
    },
    {
      filename: 'my-app-name/tests/helpers/setup-application-test.js',
      code: 'export default function setupApplicationTest(){};',
    },

    // Importing anything from tests/helpers is allowed.
    "import setupApplicationTest from 'tests/helpers/setup-application-test';",
    "import { setupApplicationTest } from 'tests/helpers';",
    "import setupApplicationTest from 'my-app-name/tests/helpers/setup-application-test';",
    "import { setupApplicationTest } from 'my-app-name/tests/helpers';",

    // Importing anything from test/helpers is allowed (using relative path)
    {
      filename: 'my-app-name/tests/helpers/foo.js',
      code: "import setupApplicationTest from './setup-application-test';",
    },
    {
      filename: 'my-app-name/tests/helpers/nested/foo.js',
      code: "import setupApplicationTest from '../setup-application-test';",
    },
  ],
  invalid: [
    {
      code: `
        import setupModule from './some-other-test';
        import { module, test } from 'qunit';

        module('Acceptance | module', setupModule());
      `,
      output: null,
      errors: [
        {
          message: NO_IMPORT_MESSAGE,
        },
      ],
    },
    {
      code: `
        import {
          beforeEachSetup,
          testName,
        } from './some-other-test';
        import { module, test } from 'qunit';

        module('Acceptance | module', beforeEachSetup());
      `,
      output: null,
      errors: [
        {
          message: NO_IMPORT_MESSAGE,
        },
      ],
    },
    {
      code: `
        import testModule from '../../test-dir/another-test';
        import { module, test } from 'qunit';

        module('Acceptance | module', testModule());
      `,
      output: null,
      errors: [
        {
          message: NO_IMPORT_MESSAGE,
        },
      ],
    },
    {
      // Importing from a test file outside test/helpers is disallowed.
      filename: 'my-app-name/tests/helpers/foo.js',
      code: "import testModule from '../../test-dir/another-test';",
      output: null,
      errors: [{ message: NO_IMPORT_MESSAGE }],
    },
    {
      filename: 'tests/some-test.js',
      code: `
        export function beforeEachSetup(){};
      `,
      output: null,
      errors: [
        {
          message: NO_EXPORT_MESSAGE,
        },
      ],
    },
    {
      filename: 'tests/some-test.js',
      code: `
        function beforeEachSetup(){};

        export default {beforeEachSetup};
      `,
      output: null,
      errors: [
        {
          message: NO_EXPORT_MESSAGE,
        },
      ],
    },
  ],
});
