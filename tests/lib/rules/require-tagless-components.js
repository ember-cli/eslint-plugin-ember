// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-tagless-components');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS: ERROR_MESSAGE } = rule;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
});

ruleTester.run('require-tagless-components', rule, {
  valid: [
    `
      import Component from '@ember/component';
      export default Component.extend({ tagName: '' });
    `,
    `
      import Component from '@ember/component';
      export default class MyComponent extends Component {
        tagName = ''
      }
    `,
    `
      import Component from '@ember/component';
      import { tagName } from '@ember-decorators/component';
      @tagName('')
      export default class MyComponent extends Component {}
    `,
    `
      import Component from '@glimmer/component';
      export default class MyComponent extends Component {}
    `,
    `
      import SomeOtherThing from 'some-other-module';
      export default SomeOtherThing.extend({
        tagName: ''
      });
    `,
    `
      import SomeOtherThing from 'some-other-module';
      export default class MyThing extends SomeOtherThing {
        tagName = '';
      }
    `,
  ],
  invalid: [
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({});
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'CallExpression' }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend();
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'CallExpression' }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend(SomeMixin, {});
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'CallExpression' }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default Component.extend({
          tagName: 'span'
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 4, type: 'Property' }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default class MyComponent extends Component {}
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'ClassBody' }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default class MyComponent extends Component {
          tagName = 'span'
        }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 4, type: 'ClassProperty' }],
    },
    {
      code: `
        import Component from '@ember/component';
        import { tagName } from '@ember-decorators/component';
        @tagName('span')
        export default class MyComponent extends Component {}
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 4, type: 'Decorator' }],
    },
  ],
});
