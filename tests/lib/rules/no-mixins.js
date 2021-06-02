// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-mixins');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const { ERROR_MESSAGE } = rule;
const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
});
eslintTester.run('no-mixins', rule, {
  valid: [
    `
    import NoMixinRule from "some/addon/mixin";
    export default mixin;
    `,
    `
    import NameIsMixin from "some/addon";
    export default Component.extend({});
  `,
    `
    import * as Mixins from "some/addon/mixins";
    export default Component.extend({});
  `,
    `
    import Mixin from '@ember/object/mixin';
    const newMixin = Mixin.create({});
    `,
  ],
  invalid: [
    {
      code: `
        import BadCode from "my-addon/mixins/bad-code";

        export default Component.extend(BadCode, {});
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: `
      import EmberObject from '@ember/object';
      import EditableMixin from '../mixins/editable';

      const Comment = EmberObject.extend(EditableMixin, {
        post: null
      });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: `
      import Component from '@ember/component';
      import FooMixin from '../utils/mixins/foo';

      export default class FooComponent extends Component.extend(FooMixin) {
        // ...
      }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
  ],
});
