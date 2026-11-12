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
    `
      import classic from 'ember-classic-decorator';
      import { alias } from '@ember/object/computed';
      import Component from '@ember/component';

      class Helper {}

      @classic
      class Graph extends Component {
        @alias('model.name') name;
      }

      export { Helper, Graph };
    `,
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
      output: null,
      options: [
        {
          ignoreClassic: true,
        },
      ],
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: `
        import { computed } from '@ember/object';
        import Component from '@ember/component';

        export default class MyComponent extends Component {}
      `,
      output: null,
      options: [
        {
          ignoreClassic: false,
        },
      ],
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
      output: null,
      options: [
        {
          ignoreClassic: false,
        },
      ],
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      // Computed used inside the native class, next to a @classic class
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
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      // Only the native class uses the macro
      code: `
        import classic from 'ember-classic-decorator';
        import { alias } from '@ember/object/computed';
        import Component from '@ember/component';

        @classic
        class Legacy extends Component {}

        export default class Modern extends Component {
          @alias('model.name') name;
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      // Used outside of any class
      code: `
        import classic from 'ember-classic-decorator';
        import { computed } from '@ember/object';
        import Component from '@ember/component';

        const fullName = computed('first', 'last', function () {});

        @classic
        class Legacy extends Component {
          @computed('a') get b() { return this.a; }
        }

        export default class Modern extends Component {}
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      // ignoreClassic: false still reports computed inside @classic classes
      code: `
        import classic from 'ember-classic-decorator';
        import { computed } from '@ember/object';
        import Component from '@ember/component';

        class Helper {}

        @classic
        class Legacy extends Component {
          @computed('a') get b() { return this.a; }
        }
      `,
      output: null,
      options: [{ ignoreClassic: false }],
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
  ],
});
