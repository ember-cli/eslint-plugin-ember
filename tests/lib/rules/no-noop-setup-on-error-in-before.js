//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-noop-setup-on-error-in-before');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-noop-setup-on-error-in-before', rule, {
  valid: [
    `
        import { setupOnerror } from '@ember/test-helpers';
        import { module, test } from 'qunit';

        module('foo', function(hooks) {
          test('something', function() {
            setupOnerror((error) => {
              assert.equal(error.message, 'test', 'Should have message');
            });
          })
        });
        `,
    `
        import { setupOnerror } from '@ember/test-helpers';
        import { module } from 'qunit';

        module('foo', function(hooks) {
          hooks.beforeEach(function() {
            setupOnerror((error) => {
              assert.equal(error.message, 'test', 'Should have message');
            });
          });
        });
      `,
    `
        import { setupOnerror } from '@ember/test-helpers';
        import { module, test } from 'qunit';

        module('foo', function(hooks) {
          test('something', function() {
            setupOnerror(() => {
            });
          })
        });
      `,
    `
      import { setupOnerror } from '@ember/test-helpers';
      import { module, test } from 'qunit';
      import moduleBody from 'somewhere';

      module('foo', moduleBody());
    `,
    `
        import { setupOnerror } from '@ember/test-helpers';
        import { module } from 'qunit';

        module('foo', function() {
        });
      `,
  ],
  invalid: [
    {
      code: `
        import { setupOnerror } from '@ember/test-helpers';
        import { module as moduleVariable } from 'qunit';

        moduleVariable('foo', function(hooks) {
          hooks.beforeEach(function() {
setupOnerror(() => {});
          });
        });
      `,
      output: `
        import { setupOnerror } from '@ember/test-helpers';
        import { module as moduleVariable } from 'qunit';

        moduleVariable('foo', function(hooks) {
          hooks.beforeEach(function() {

          });
        });
      `,
      errors: [
        {
          messageId: 'main',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        import { setupOnerror } from '@ember/test-helpers';
        import { module } from 'qunit';

        module('foo', function(hooks) {
          hooks.beforeEach(function() {
setupOnerror(function(){});
          });
        });
      `,
      output: `
        import { setupOnerror } from '@ember/test-helpers';
        import { module } from 'qunit';

        module('foo', function(hooks) {
          hooks.beforeEach(function() {

          });
        });
      `,
      errors: [
        {
          messageId: 'main',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        import { setupOnerror } from '@ember/test-helpers';
        import { module } from 'qunit';

        module('foo', function(hooks) {
          hooks.beforeEach(function() {
setupOnerror(function noop(){});
          });
        });
      `,
      output: `
        import { setupOnerror } from '@ember/test-helpers';
        import { module } from 'qunit';

        module('foo', function(hooks) {
          hooks.beforeEach(function() {

          });
        });
      `,
      errors: [
        {
          messageId: 'main',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        import { setupOnerror } from '@ember/test-helpers';
        import { module } from 'qunit';

        module('foo', function(hooks) {
          hooks.before(function() {
setupOnerror(() => {});
          });
        });
      `,
      output: `
        import { setupOnerror } from '@ember/test-helpers';
        import { module } from 'qunit';

        module('foo', function(hooks) {
          hooks.before(function() {

          });
        });
      `,
      errors: [
        {
          messageId: 'main',
          type: 'CallExpression',
        },
      ],
    },
  ],
});
