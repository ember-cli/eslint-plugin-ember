const rule = require('../../../lib/rules/no-attrs-snapshot');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;
const eslintTester = new RuleTester();

eslintTester.run('no-attrs-snapshot', rule, {
  valid: [
    {
      code: `
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
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
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [
        {
          ERROR_MESSAGE,
        },
      ],
    },
  ],
});
