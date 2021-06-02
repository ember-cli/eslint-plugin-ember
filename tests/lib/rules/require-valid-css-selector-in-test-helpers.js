const rule = require('../../../lib/rules/require-valid-css-selector-in-test-helpers');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

const EXAMPLE_SELECTORS = [
  '.foo',
  '.bar',
  '  .with-spaces-around-this-one  ',
  '#userlist',
  'p',
  '[data-test-foo] svg',
  'div.highlighted > p',
  'iframe[data-src]',
  'li[data-active="1"]',
];

ruleTester.run('require-valid-css-selector-in-test-helpers', rule, {
  valid: [
    {
      code: `
        import { find } from '@ember/test-helpers';
        find('[data-test-pizza]')`,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { find } from '@ember/test-helpers';
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function() {
            find('[data-test-pizza]');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            assert.dom('[data-test-pizza]');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(fooBar) {
            fooBar.dom('[data-test-pizza]');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
      import { find } from '@ember/test-helpers';
      import { module } from 'qunit';

      module('foo', function() {});
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
      import { find as module } from '@ember/test-helpers';
      module('[data-test-foo]');
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        const assert = { dom() {} };

        module('foo', function() {
          test('foo', function(fooBar) {
            assert.dom('.classname');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            this.element.querySelector('[data-test-pizza]');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            document.querySelector('[data-test-pizza]');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            this.element.querySelectorAll('[data-test-pizza]');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            document.querySelectorAll('[data-test-pizza]');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            document.querySelectorAll('#foobar');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            document.querySelectorAll('.foobar');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            document.querySelectorAll('div');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            document.querySelectorAll('.foo\\+bar');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        this.click('.foobar');
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { fillIn } from '@ember/test-helpers';
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function() {
            fillIn('.foobar', 'Jeff Sturgis');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { fillIn, visit } from '@ember/test-helpers';
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function() {
            visit('/foobar');
            fillIn('.foobar', 'Jeff Sturgis');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },

    // Ignored because not a test file.
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function() {
            this.element.querySelectorAll('[data-test-foo-bar');
          });
        });
      `,
      filename: 'components/foobar.js',
    },

    // With comma(s) separating multiple selectors:
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            assert.dom('${EXAMPLE_SELECTORS.join(',')}');
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },

    // With comma(s) inside quotes in a selector:
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            assert.dom('[data-test-row="London, England, GB"], .foo').exists();
          });
        });
      `,
      filename: 'components/foobar-test.js',
    },
  ],
  invalid: [
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            assert.dom('[data-test-pizza');
          });
        });
        `,
      output: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            assert.dom('[data-test-pizza]');
          });
        });
        `,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'unclosedAttr',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { find, click, fillIn, findAll, focus, blur, doubleClick, scrollTo, select, tap, triggerEvent, triggerKeyEvent, typeIn, waitFor } from '@ember/test-helpers';
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function() {
            find('[data-test-pizza');
            findAll('[data-test-pizza');
            fillIn('[data-test-pizza');
            click('[data-test-pizza');
            focus('[data-test-pizza');
            blur('[data-test-pizza');
            doubleClick('[data-test-pizza');
            scrollTo('[data-test-pizza');
            select('[data-test-pizza');
            tap('[data-test-pizza');
            triggerEvent('[data-test-pizza');
            triggerKeyEvent('[data-test-pizza');
            typeIn('[data-test-pizza');
            waitFor('[data-test-pizza');
          });
        });
        `,
      output: `
        import { find, click, fillIn, findAll, focus, blur, doubleClick, scrollTo, select, tap, triggerEvent, triggerKeyEvent, typeIn, waitFor } from '@ember/test-helpers';
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function() {
            find('[data-test-pizza]');
            findAll('[data-test-pizza]');
            fillIn('[data-test-pizza]');
            click('[data-test-pizza]');
            focus('[data-test-pizza]');
            blur('[data-test-pizza]');
            doubleClick('[data-test-pizza]');
            scrollTo('[data-test-pizza]');
            select('[data-test-pizza]');
            tap('[data-test-pizza]');
            triggerEvent('[data-test-pizza]');
            triggerKeyEvent('[data-test-pizza]');
            typeIn('[data-test-pizza]');
            waitFor('[data-test-pizza]');
          });
        });
        `,
      errors: Array.from({ length: 14 }).fill({
        type: 'CallExpression',
        messageId: 'unclosedAttr',
      }),
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { find } from '@ember/test-helpers';
        find('[data-test-pizza');`,
      output: `
        import { find } from '@ember/test-helpers';
        find('[data-test-pizza]');`,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'unclosedAttr',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(fooBar) {
            this.element.querySelector('[data-test-pizza');
          });
        });
        `,
      output: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(fooBar) {
            this.element.querySelector('[data-test-pizza]');
          });
        });
        `,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'unclosedAttr',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(fooBar) {
            document.querySelector('[data-test-pizza');
          });
        });
        `,
      output: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(fooBar) {
            document.querySelector('[data-test-pizza]');
          });
        });
        `,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'unclosedAttr',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(fooBar) {
            this.element.querySelectorAll('[data-test-pizza');
          });
        });
        `,
      output: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(fooBar) {
            this.element.querySelectorAll('[data-test-pizza]');
          });
        });
        `,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'unclosedAttr',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(fooBar) {
            document.querySelectorAll('[data-test-pizza');
          });
        });
        `,
      output: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(fooBar) {
            document.querySelectorAll('[data-test-pizza]');
          });
        });
        `,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'unclosedAttr',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(fooBar) {
            document.querySelectorAll('#1234');
          });
        });
        `,
      output: null,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'idStartsWithNumber',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { module, test } from 'qunit';

        test('foo', function(fooBar) {
          document.querySelectorAll('..foobar');
        });
        `,
      output: null,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'other',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(fooBar) {
            document.querySelectorAll('##foobar');
          });
        });
        `,
      output: null,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'other',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { find as findRenamed } from '@ember/test-helpers';

        findRenamed('[data-foo')
        `,
      output: `
        import { find as findRenamed } from '@ember/test-helpers';

        findRenamed('[data-foo]')
        `,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'unclosedAttr',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { module, test as testRenamed } from 'qunit';

        module('foo', function() {
          testRenamed('foo', function() {
            document.querySelectorAll('[data-foo')
          });
        });
        `,
      output: `
        import { module, test as testRenamed } from 'qunit';

        module('foo', function() {
          testRenamed('foo', function() {
            document.querySelectorAll('[data-foo]')
          });
        });
        `,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'unclosedAttr',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function() {
            document.querySelectorAll('data-test]')
          });
        });
        `,
      output: null,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'other',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { expect } from 'chai';
        import { describe, it } from 'mocha';
        import { setupTest } from 'ember-mocha';

        describe('foo', function() {
          setupTest();

          beforeEach(function() {
            this.elem = this.element.querySelectorAll('data-test]');
          });

          it('exists', function() {
            expect(this.elem).to.be.ok;
          });
        });
        `,
      output: null,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'other',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { expect } from 'chai';
        import { describe, it } from 'mocha';
        import { setupTest } from 'ember-mocha';

        describe('foo', function() {
          setupTest();

          afterEach(function() {
            this.elem = this.element.querySelectorAll('data-test]');
          });

          it('exists', function() {
            expect(this.elem).to.be.ok;
          });
        });
        `,
      output: null,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'other',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { module, test } from 'qunit';

        module('Acceptance | foo', function (hooks) {
          hooks.beforeEach(function () {
            this.elem = this.element.querySelectorAll('data-test]');
          });
            test('foo', function(assert) {
              assert.ok(this.elem);
            });
        });
        `,
      output: null,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'other',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    {
      code: `
        import { module, test } from 'qunit';

        module('Acceptance | foo', function (hooks) {
          hooks.afterEach(function () {
            this.elem = this.element.querySelectorAll('data-test]');
          });
            test('foo', function(assert) {
              assert.ok(this.elem);
            });
        });
        `,
      output: null,
      errors: [
        {
          type: 'CallExpression',
          messageId: 'other',
        },
      ],
      filename: 'components/foobar-test.js',
    },

    // With comma(s) separating multiple selectors:
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            assert.dom('.foo, 5bar');
          });
        });
        `,
      output: null,
      errors: [{ type: 'CallExpression', messageId: 'other' }],
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            assert.dom('.foo, #1234');
          });
        });
        `,
      output: null,
      errors: [{ type: 'CallExpression', messageId: 'idStartsWithNumber' }],
      filename: 'components/foobar-test.js',
    },
    {
      code: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            assert.dom('.foo, [data-test-row="London, England, GB", .bar');
          });
        });
        `,
      output: `
        import { module, test } from 'qunit';

        module('foo', function() {
          test('foo', function(assert) {
            assert.dom('.foo, [data-test-row="London, England, GB"], .bar');
          });
        });
        `,
      errors: [{ type: 'CallExpression', messageId: 'unclosedAttr' }],
      filename: 'components/foobar-test.js',
    },
  ],
});
