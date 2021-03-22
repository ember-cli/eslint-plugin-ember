'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-classic-classes');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE_NO_CLASSIC_CLASSES: ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run('no-classic-classes', rule, {
  valid: [
    `
      import Component from '@ember/component';

      export default class MyComponent extends Component {}
    `,
    `
      import Component from '@ember/component';

      export default class MyRoute extends Route.extend(SomeMixin) {}
    `,
    `
      import SomeOtherThing from 'some-other-library';

      export default SomeOtherThing.extend({});
    `,
    'export default Component.extend({});', // No import
  ],

  invalid: [
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
        export default Component.extend({});
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'CallExpression' }],
    },
    {
      code: `
        import Component from '@ember/component';
        import Evented from '@ember/object/Evented';
        export default Component.extend(Evented, {});
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 4, type: 'CallExpression' }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default class MyComponent extends Component.extend() {};
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'CallExpression' }],
    },
    {
      code: `
        import Component from '@ember/component';
        export default class MyComponent extends Component.extend({}) {};
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'CallExpression' }],
    },
    {
      code: `
        import Component from '@ember/component';
        import Evented from '@ember/object/evented';
        export default class MyComponent extends Component.extend(Evented, {}) {};
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 4, type: 'CallExpression' }],
    },
    {
      code: `
        import DS from 'ember-data';
        export default DS.Model.extend({});
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'CallExpression' }],
    },
    {
      code: `
        import Model from '@ember-data/model';
        export default Model.extend({});
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'CallExpression' }],
    },
    {
      code: `
        import CustomClass from 'my-custom-addon';
        export default CustomClass.extend({});
      `,
      options: [
        {
          additionalInvalidImports: ['my-custom-addon'],
        },
      ],
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'CallExpression' }],
    },
    {
      code: `
        import CustomClass from 'my-custom-addon';
        const CustomSub = CustomClass.extend({});

        export default CustomSub;
      `,
      options: [
        {
          additionalInvalidImports: ['my-custom-addon'],
        },
      ],
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 3, type: 'CallExpression' }],
    },
  ],
});
