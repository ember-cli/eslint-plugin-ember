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
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
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
      export default Component.extend(Mixin, { tagName: '' });
    `,
    `
      import Component from '@ember/component';
      export default class MyComponent extends Component {
        tagName = ''
      }
    `,
    `
      import Component from '@ember/component';
      export default class MyComponent extends Component.extend(Mixin) {
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
        tagName: 'some-non-empty-value'
      });
    `,
    `
      import SomeOtherThing from 'some-other-module';
      export default class MyThing extends SomeOtherThing {
        tagName = 'some-non-empty-value';
      }
    `,
    {
      // Classic service in component file.
      filename: 'app/components/foo.js',
      code: `
        import Service from '@ember/service';
        export default Service.extend({});
      `,
    },
    {
      // Native service in component file.
      filename: 'app/components/foo.js',
      code: `
        import Service from '@ember/service';
        export default class MyService extends Service {};
      `,
    },
    {
      // Should ignore test files.
      filename: 'tests/integration/components/foo-test.js',
      code: `
        import Component from '@ember/component';
        export default class MyComponent extends Component {};
        Component.extend({});
      `,
    },
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
      // `tagName` but not the last object argument
      code: `
        import Component from '@ember/component';
        export default Component.extend({ tagName: 'span' }, SomeMixin);
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'Property' }],
    },
    {
      // `tagName` but inside a variable
      code: `
        import Component from '@ember/component';
        const body = { tagName: 'span' };
        export default Component.extend(body);
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'Property' }],
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
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 4,
          // type could be ClassProperty (ESLint v7) or PropertyDefinition (ESLint v8)
        },
      ],
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
