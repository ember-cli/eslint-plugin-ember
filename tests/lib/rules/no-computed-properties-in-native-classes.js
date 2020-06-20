'use strict';

const rule = require('../../../lib/rules/no-computed-properties-in-native-classes');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: { legacyDecorators: true },
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
    {
      code: `
        import Component from '@ember/component';

        export default class MyComponent extends Component {}
      `,
      options: [
        {
          ignoreClassic: true,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';

        export default class MyComponent extends Component {}
      `,
      options: [
        {
          ignoreClassic: false,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        import classic from 'ember-classic-decorator';

        @classic
        export default class MyComponent extends Component {}
      `,
      options: [
        {
          ignoreClassic: true,
        },
      ],
    },
    {
      code: `
        import Component from '@ember/component';
        import classic from 'ember-classic-decorator';

        @classic
        export default class MyComponent extends Component {}
      `,
      options: [
        {
          ignoreClassic: false,
        },
      ],
    },
    {
      code: `
        import { computed } from '@ember/object';
        import Component from '@ember/component';
        import classic from 'ember-classic-decorator';

        @classic
        export default class MyComponent extends Component {}
      `,
      options: [
        {
          ignoreClassic: true,
        },
      ],
    },
    {
      code: `
        import { computed } from '@ember/object';
        import Component from '@ember/component';
        import classic from 'ember-classic-decorator';

        @classic
        export default class MyComponent extends Component {}
      `,
      options: [], // default options should be: [{ ignoreClassic: true }]
    },

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
    {
      code: `
        import { computed } from '@ember/object';
        import Component from '@ember/component';

        export default class MyComponent extends Component {}
      `,
      options: [
        {
          ignoreClassic: true,
        },
      ],
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: `
        import { computed } from '@ember/object';
        import Component from '@ember/component';

        export default class MyComponent extends Component {}
      `,
      options: [
        {
          ignoreClassic: false,
        },
      ],
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: `
        import { computed } from '@ember/object';
        import Component from '@ember/component';
        import classic from 'ember-classic-decorator';

        @classic
        export default class MyComponent extends Component {}
      `,
      options: [
        {
          ignoreClassic: false,
        },
      ],
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
  ],
});
