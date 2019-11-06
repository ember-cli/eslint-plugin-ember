const rule = require('../../../lib/rules/no-attrs-snapshot');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;
const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('no-attrs-snapshot', rule, {
  valid: [
    `
        export default Ember.Component({
          init() {
            this._super(...arguments);
            this._valueCache = this.value;
            this.updated = false;
          },
          didReceiveAttrs() {
            if (this._valueCache !== this.value) {
              this._valueCache = this.value;
              this.set('updated', true);
            } else {
              this.set('updated', false);
            }
          }
        });`,
    `
        export default Ember.Component({
          init() {
            this._super(...arguments);
            this._valueCache = this.value;
            this.updated = false;
          },
          didUpdateAttrs() {
            if (this._valueCache !== this.value) {
              this._valueCache = this.value;
              this.set('updated', true);
            } else {
              this.set('updated', false);
            }
          }
        });`,
  ],
  invalid: [
    {
      code: `
        export default Ember.Component({
          init() {
            this._super(...arguments);
            this.updated = false;
          },
          didReceiveAttrs(attrs) {
            let { newAttrs, oldAttrs } = attrs;
            if ((newAttrs && oldAttrs) && newAttrs.value !== oldAttrs.value) {
              this.set('updated', true);
            } else {
              this.set('updated', false);
            }
          }
        });`,
      output: null,
      errors: [
        {
          ERROR_MESSAGE,
        },
      ],
    },
    {
      code: `
        export default Ember.Component({
          init() {
            this._super(...arguments);
            this.updated = false;
          },
          didUpdateAttrs(attrs) {
            let { newAttrs, oldAttrs } = attrs;
            if ((newAttrs && oldAttrs) && newAttrs.value !== oldAttrs.value) {
              this.set('updated', true);
            } else {
              this.set('updated', false);
            }
          }
        });`,
      output: null,
      errors: [
        {
          ERROR_MESSAGE,
        },
      ],
    },
  ],
});
