'use strict';

const rule = require('../../../lib/rules/no-component-lifecycle-hooks');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS: ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run('no-component-lifecycle-hooks', rule, {
  valid: [
    `
      import Component from '@glimmer/component';
      export default class MyComponent extends Component {
        willDestroy() {}
      }
    `,
    `
      import Component from '@glimmer/component';
      export default class MyClass {
        didUpdate() {}
      }
    `,
    `
      export default {
        didUpdate() {},
      }
    `,
    `
      import Component from '@ember/component';
      export default Component.extend({
        willDestroy() {},
      });
    `,
    `
      export default EmberObject.extend({
        didUpdate() {},
      });
    `,
    `
      import Component from '@ember/component';
      export const Component1 = Component.extend({
        willDestroy() {},
      });
      export const Component2 = Component.extend({
        willDestroy() {},
      });
    `,
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
    {
      code: `
        import Component from '@glimmer/component';
        export default class MyComponent extends Component {
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
    {
      code: `
        import Component from '@ember/component';
        export default class MyComponent extends Component {
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
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
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
    {
      code: `
        import Component from '@ember/component';

        export const Component2 = Component.extend({
          didDestroyElement() {},
        });

        export const Component1 = Component.extend({
          willDestroy() {},
        });
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        import Component from "@glimmer/component";

        export const Component1 = Component.extend({
          test: computed('', function () {}),
          didDestroyElement() {},
        });
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
