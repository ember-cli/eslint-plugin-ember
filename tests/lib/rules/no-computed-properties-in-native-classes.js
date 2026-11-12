'use strict';

const rule = require('../../../lib/rules/no-computed-properties-in-native-classes');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
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

    // File with both native class and .extend() should not flag computed import
    `
      import { computed } from '@ember/object';
      import Component from '@ember/component';

      class Helper {}

      export default Component.extend({
        fullName: computed('firstName', 'lastName', function() {})
      });
    `,

    // Imported but not used in a class body (no-unused-vars covers this)
    `
      import { computed } from '@ember/object';
      import Component from '@ember/component';

      export default class MyComponent extends Component {}
    `,

    // Used in the class's extends clause, not its body
    `
      import { computed } from '@ember/object';
      import Component from '@ember/component';

      export default class MyComponent extends Component.extend({
        fullName: computed('firstName', 'lastName', function() {})
      }) {}
    `,

    // Used outside of any class
    `
      import { computed } from '@ember/object';

      export const fullName = computed('first', 'last', function () {});
      export class Helper {}
    `,

    // Computed only used inside the @classic class; another native class has none (#1267)
    `
      import classic from 'ember-classic-decorator';
      import { readOnly } from '@ember/object/computed';
      import Component from '@ember/component';
      import { get, computed } from '@ember/object';

      class Tooltip {
        constructor(valueFormatter) {
          this.valueFormatter = ({ y }) => get(y, 'value');
        }
      }

      @classic
      export default class Graph extends Component {
        @readOnly('tabName') label;

        @computed('tabName')
        get title() {
          return this.tabName;
        }
      }
    `,
  ],
  invalid: [
    {
      code: `
        import { computed } from '@ember/object';

        export default class MyComponent extends Component {
          @computed('a') get b() { return this.a; }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier', line: 5 }],
    },
    {
      code: `
        import { computed as thinking } from '@ember/object';

        export default class MyComponent extends Component {
          @thinking('a') get b() { return this.a; }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier', line: 5 }],
    },
    {
      code: `
        import { and, or, alias } from '@ember/object/computed';

        export default class MyComponent extends Component {
          @alias('x') a;
          @and('x', 'y') b;
          c = or('x', 'y');
        }
      `,
      output: null,
      errors: [
        { message: ERROR_MESSAGE, type: 'Identifier', line: 5 },
        { message: ERROR_MESSAGE, type: 'Identifier', line: 6 },
        { message: ERROR_MESSAGE, type: 'Identifier', line: 7 },
      ],
    },
    {
      // Class expression
      code: `
        import { computed } from '@ember/object';

        export const MyComponent = class extends Component {
          @computed('a') get b() { return this.a; }
        };
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier', line: 5 }],
    },
    {
      // ignoreClassic: false still reports computed inside @classic classes
      code: `
        import { computed } from '@ember/object';
        import Component from '@ember/component';
        import classic from 'ember-classic-decorator';

        @classic
        export default class MyComponent extends Component {
          @computed('a') get b() { return this.a; }
        }
      `,
      output: null,
      options: [{ ignoreClassic: false }],
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier', line: 8 }],
    },
    {
      // Only the native class is reported, not the @classic one
      code: `
        import classic from 'ember-classic-decorator';
        import { computed } from '@ember/object';
        import Component from '@ember/component';

        @classic
        class Legacy extends Component {
          @computed('a') get b() { return this.a; }
        }

        export default class Modern extends Component {
          @computed('a') get b() { return this.a; }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier', line: 12 }],
    },
    {
      // A native class nested in a @classic class is still checked
      code: `
        import classic from 'ember-classic-decorator';
        import { alias } from '@ember/object/computed';
        import Component from '@ember/component';

        @classic
        export default class Legacy extends Component {
          make() {
            return class Inner {
              @alias('x') y;
            };
          }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier', line: 10 }],
    },
    {
      // Used next to a classic .extend() in the same file
      code: `
        import { computed } from '@ember/object';
        import Component from '@ember/component';

        export const Old = Component.extend({
          a: computed('b', function () {}),
        });

        export default class Modern extends Component {
          @computed('a') get b() { return this.a; }
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier', line: 10 }],
    },
  ],
});
