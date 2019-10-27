/**
 * @fileoverview Prevents usage of "classic" ember component lifecycle hooks. Render modifiers or custom functional modifiers should be used instead.
 * @author Jacek Bandura
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-component-lifecycle-hooks');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS: ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run('no-component-lifecycle-hooks', rule, {
  valid: [
    `
      import Component from '@ember/component';
      export default class MyComponent extends Component {
        didDestroyElement() {}
      }
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
  ],
});
