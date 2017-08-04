const rule = require('../../../lib/rules/no-this-jquery');
const RuleTester = require('eslint').RuleTester;

const message = rule.meta.message;
const eslintTester = new RuleTester();

eslintTester.run('no-this-jquery', rule, {
  valid: [
    {
      code: `
        export default Ember.Component({
          didInsertElement() {
            this.element.classList.add('active')
          }
        });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      code: `
        import { moduleForComponent, test } from 'ember-qunit';
        import hbs from 'htmlbars-inline-precompile';

        moduleForComponent('some-component', 'Integration | Component | some-component', {
          integration: true
        });

        test('assert something', function() {
          assert.equal(find('.some-component').textContent.trim(), 'hello world');
        })`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    }
  ],
  invalid: [
    {
      code: `
        export default Ember.Component({
          didInsertElement() {
            this.$().addClass('active')
          }
        });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message
      }]
    },
    {
      code: `
        import { moduleForComponent, test } from 'ember-qunit';
        import hbs from 'htmlbars-inline-precompile';

        moduleForComponent('some-component', 'Integration | Component | some-component', {
          integration: true
        });

        test('assert something', function() {
          assert.equal(this.$('.some-component').text().trim(), 'hello world');
        })`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message
      }]
    }
  ]
});
