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
      export default Component.extend({
        willDestroy() {},
      });
    `,
    `
      export default EmberObject.extend({
        didUpdate() {},
      });
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
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'FunctionExpression',
        },
      ],
    },
  ],
});
