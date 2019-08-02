const rule = require('../../../lib/rules/no-jquery');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;
const eslintTester = new RuleTester();

eslintTester.run('no-jquery', rule, {
  valid: [
    {
      code: `
        export default Ember.Component({
          didInsertElement() {
            this.element.classList.add('active')
          }
        });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      filename: 'example-app/tests/integration/component/some-component-test.js',
      code: `
        import { moduleForComponent, test } from 'ember-qunit';
        import hbs from 'htmlbars-inline-precompile';

        moduleForComponent('some-component', 'Integration | Component | some-component', {
          integration: true
        });

        test('assert something', function() {
          assert.equal(find('.some-component').textContent.trim(), 'hello world');
        })`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    // Global $
    {
      code: `
        export default Ember.Component({
          didInsertElement() {
            $(body).addClass('active')
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
    // import $
    {
      code: `
        import $ from 'jquery';
        export default Ember.Component({
          didInsertElement() {
            $(body).addClass('active')
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
        import $ from 'jquery';
        import Service from '@ember/service';
        export default Service.extend({
          myFunc(a, b) {
            return $.extend({}, a, b);
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
    // aliased import $ from jquery
    {
      code: `
        import jq from 'jquery';
        import Service from '@ember/service';
        export default Service.extend({
          myFunc(a, b) {
            return jq.extend({}, a, b);
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
    // Ember.$
    {
      code: `
        export default Ember.Component({
          didInsertElement() {
            Ember.$(body).addClass('active')
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
    // Em.$
    {
      code: `
        export default Ember.Component({
          didInsertElement() {
            Em.$(body).addClass('active')
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
    // AliasedEmber.$
    {
      code: `
        import E from 'ember';
        export default Ember.Component({
          didInsertElement() {
            E.$(body).addClass('active')
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
    // const jq = Ember.$
    {
      code: `
        const jq = Ember.$;
        export default Ember.Component({
          didInsertElement() {
            jq(body).addClass('active')
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
    // const { $ } = Ember;
    {
      code: `
        const { $ } = Ember;
        export default Ember.Component({
          didInsertElement() {
            $(body).addClass('active')
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
    // this.$
    {
      code: `
        export default Ember.Component({
          didInsertElement() {
            this.$().addClass('active')
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
      filename: 'example-app/tests/integration/component/some-component-test.js',
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
      output: null,
      errors: [
        {
          ERROR_MESSAGE,
        },
      ],
    },
  ],
});
