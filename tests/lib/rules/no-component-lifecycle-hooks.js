'use strict';

const rule = require('../../../lib/rules/no-component-lifecycle-hooks');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS: ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run('no-component-lifecycle-hooks', rule, {
  valid: [
    // Legitimate Glimmer component lifecycle hooks:
    `
      import Component from '@glimmer/component';
      export default class MyComponent extends Component {
        constructor() {}
        willDestroy() {}
        foo() {}
      }
    `,

    // Not extending from the component:
    `
      import Component from '@glimmer/component';
      export default class MyClass {
        didUpdate() {}
      }
    `,

    // Just an object:
    `
      export default {
        didUpdate() {},
      }
    `,

    // Not a lifecycle hook:
    `
      import Component from '@ember/component';
      export default Component.extend({
        foo() {},
      });
    `,

    // Just an EmberObject:
    `
      export default EmberObject.extend({
        didUpdate() {},
      });
    `,

    // Hooks in a random object after a component class:
    `
      import Component from '@ember/component';
      export default class MyComponent extends Component {}

      const someRandomClassOrObject = { didDestroyElement() { } };
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({});

      const someRandomClassOrObject = { didDestroyElement() { } };
    `,
  ],

  invalid: [
    // Glimmer component using classic Ember component lifecycle hook:
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
          myMethod() {
            class FooBarClass {}
          }
          didDestroyElement() {}
        }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'MethodDefinition',
        },
      ],
    },

    // Classic component using classic Ember component lifecycle hook (native class):
    {
      code: `
        import Component from '@ember/component';
        export default class MyComponent extends Component {
          myMethod() {
            class FooBarClass {}
          }
          didDestroyElement() {}
        }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'MethodDefinition',
        },
      ],
    },

    // Classic component using classic Ember component lifecycle hook (classic class):
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          test: computed('', function () {}),
          didDestroyElement() {}
        })
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Identifier',
        },
      ],
    },
  ],
});
