//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-empty-glimmer-component-classes');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run('no-empty-glimmer-component-classes', rule, {
  valid: [
    `import Component from '@glimmer/component';

    class MyComponent extends Component {
      foo() {
        return this.args.bar + this.args.baz;
      }
    }`,
    'class MyComponent extends NotAGlimmerComponent {}',
  ],
  invalid: [
    {
      code: `import Component from '@glimmer/component';

      class MyComponent extends Component {}`,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ClassDeclaration' }],
    },
    {
      code: `import Component from '@glimmer/component';

      class MyComponent extends Component { /* foo */ }`,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ClassDeclaration' }],
    },
  ],
});
