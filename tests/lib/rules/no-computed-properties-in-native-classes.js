'use strict';

const rule = require('../../../lib/rules/no-computed-properties-in-native-classes');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run('no-computed-properties-in-native-classes', rule, {
  valid: [
    `
      import { computed } from '@ember/object';
      import Component from '@ember/component';

      export default Ember.Component.extend({});
    `,
    `
      import { alias, or, and } from '@ember/object/computed';
      import Component from '@ember/component';

      export default Ember.Component.extend({});
    `,
    `
      import { tracked } from '@glimmer/tracking';
      import Component from '@ember/component';

      export default class MyComponent extends Component {}
    `,
    `
      import { randomThing } from '@ember/object';
      import Component from '@ember/component';

      export default class MyComponent extends Component {}
    `,

    // Unrelated import statements:
    "import EmberObject from '@ember/object';",
    "import { run } from '@ember/runloop';",
    "import { run as renamedRun } from '@ember/runloop';",
  ],
  invalid: [
    {
      code: `
      import { computed } from '@ember/object';

      export default class MyComponent extends Component {

      }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: `
      import { computed as thinking } from '@ember/object';

      export default class MyComponent extends Component {

      }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: `
      import { and, or, alias } from '@ember/object/computed';

      export default class MyComponent extends Component {

      }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
  ],
});
