'use strict';

const rule = require('../../../lib/rules/no-legacy-computed');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-legacy-computed', rule, {
  valid: [
    `
      import Component from '@glimmer/component';

      export default class extends Component {
        get doubled() {
          return 2;
        }
      }
    `,
    `
      import { computed } from 'somewhere-else';
      computed();
    `,
    `
      import { and, gt } from 'somewhere-else';
      and('a', 'b');
      gt('count', 2);
    `,
    `
      import EmberObject from '@ember/object';

      export default EmberObject.extend({});
    `,
  ],
  invalid: [
    {
      code: `
        import { computed } from '@ember/object';

        class Example {}
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportSpecifier' }],
    },
    {
      code: `
        import { computed as cp } from '@ember/object';

        class Example {}
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportSpecifier' }],
    },
    {
      code: `
        import { and } from '@ember/object/computed';

        class Example {}
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportSpecifier' }],
    },
    {
      code: `
        import { and, gt, sortBy as sort } from '@ember/object/computed';

        class Example {}
      `,
      output: null,
      errors: [
        { message: ERROR_MESSAGE, type: 'ImportSpecifier' },
        { message: ERROR_MESSAGE, type: 'ImportSpecifier' },
        { message: ERROR_MESSAGE, type: 'ImportSpecifier' },
      ],
    },
    {
      code: `
        import '@ember/object/computed';

        class Example {}
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
  ],
});
