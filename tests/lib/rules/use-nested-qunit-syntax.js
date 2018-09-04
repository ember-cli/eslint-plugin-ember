const path = require('path');
const rule = require('../../../lib/rules/use-nested-qunit-syntax');
const RuleTester = require('eslint').RuleTester;

const messages = rule.meta.messages;
const testLocation = path.join('tests', 'unit', 'my-unit-test.js');
const nonTestLocation = path.join('app', 'components', 'my-component.js');

const eslintTester = new RuleTester({
  parserOptions: { sourceType: 'module' },
});

eslintTester.run('use-nested-qunit-syntax', rule, {
  valid: [
    {
      code: `
        moduleFor('foo-bar');
      `,
      filename: nonTestLocation,
    },
    {
      code: `
        import { module, test } from 'qunit';
        module('foo-bar');
      `,
      filename: testLocation,
    },
    {
      code: `
        import { module } from 'qunit';
        module('foo-bar', function() {
          setupTest(hooks);
        });
      `,
      filename: testLocation,
    },
    {
      code: `
        import { module, test } from 'qunit';
        import badTestPractice from 'some-confusing-location';

        module('bad test invocations', badTestPractice())
      `,
      filename: testLocation
    },
    {
      code: `
        import QUnit from 'qunit';

        QUnit.module('some-test', function () {});
      `,
      filename: testLocation
    },
    {
      code: `
        import FooUnit from 'qunit';

        FooUnit.module('some-test', function () {});
      `,
      filename: testLocation
    }
  ],
  invalid: [
    {
      code: `
        moduleFor('foo-bar');
      `,
      filename: testLocation,
      errors: [{ message: messages.ONLY_USE_MODULE }],
    },
    {
      code: `
        module('foo-bar');
      `,
      filename: testLocation,
      errors: [{ message: messages.ONLY_USE_MODULE }],
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('some-test');

        test('this is a test', function () {});
      `,
      filename: testLocation,
      errors: [{ message: messages.TESTS_SHOULD_BE_NESTED }]
    },
    {
      code: `
        QUnit.module('some-test', function () {});
      `,
      filename: testLocation,
      errors: [{ message: messages.ONLY_USE_MODULE }]
    },
    {
      code: `
        import { module } from 'some-weird-place';

        module('foo-bar', function() {
          test('sneh', function(assert) {
            assert.ok(true);
          })
        });
      `,
      filename: testLocation,
      errors: [{ message: messages.ONLY_USE_MODULE }]
    },
    {
      code: `
        import { module } from 'qunit';
        import fooBar from 'foo-bar';

        fooBar();

        module('foo-bar', function () {});
      `,
      filename: testLocation,
      errors: [{ message: messages.ONLY_USE_MODULE }]
    }
  ],
});
