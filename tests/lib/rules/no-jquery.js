const rule = require('../../../lib/rules/no-jquery');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;
const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

eslintTester.run('no-jquery', rule, {
  valid: [
    `
        export default Ember.Component({
          didInsertElement() {
            this.element.classList.add('active')
          }
        });`,
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
    },
    `
      function addClass($, selector, className) {
        $(selector).addClass(className);
      }
    `,
    `
      Foo.$(selector).attr(attribute);
    `,
    `
      const { $ } = Foo;
      $(selector).attr(attribute);
    `,
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
      output: null,
      globals: {
        $: true,
      },
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        import Service from '@ember/service';
        export default Service.extend({
          myFunc(a, b) {
            return $.extend({}, a, b);
          }
        });`,
      output: null,
      globals: {
        $: true,
      },
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
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
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
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
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
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
            jq.post({}, a, b);
            return jq.extend({}, a, b);
          }
        });`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
          line: 6,
        },
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
          line: 7,
        },
      ],
    },
    // Ember.$
    {
      code: `
        import Ember from 'ember'
        export default Ember.Component({
          didInsertElement() {
            Ember.$(body).addClass('active')
          }
        });`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    // AliasedEmber.$
    {
      code: `
        import E from 'ember';
        export default E.Component({
          didInsertElement() {
            E.$(body).addClass('active')
          }
        });`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    // import $ from ember
    {
      code: `
        import Ember, { $ } from 'ember';
        export default Ember.Component({
          didInsertElement() {
            $(body).addClass('active')
          }
        });`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    // const jq = Ember.$
    {
      code: `
        import Ember from 'ember'
        const jq = Ember.$;
        export default Ember.Component({
          didInsertElement() {
            jq(body).addClass('active')
          }
        });`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    // const { $ } = Ember;
    {
      code: `
        import Ember from 'ember'
        const { $ } = Ember;
        export default Ember.Component({
          didInsertElement() {
            $(body).addClass('active')
          }
        });`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 6,
          type: 'CallExpression',
        },
      ],
    },
    // const { $: jq } = Ember;
    {
      code: `
        import Ember from 'ember'
        const { $: jq } = Ember;
        export default Ember.Component({
          didInsertElement() {
            jq(body).addClass('active')
          }
        });`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          line: 6,
          type: 'CallExpression',
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
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        import Ember from 'ember';
        export default Ember.Component({
          didInsertElement() {
            this.$.extend({}, a, b)
          }
        });`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'MemberExpression',
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
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
  ],
});
