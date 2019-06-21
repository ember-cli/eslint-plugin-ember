// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/new-module-imports');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('new-module-imports', rule, {
  valid: [
    {
      code: `import Ember from 'ember';

        const { Handlebars: { Utils: { escapeExpression } } } = Ember
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    { code: 'Ember.Handlebars.Utils.escapeExpression("foo");' },
    { code: 'Ember.onerror = function() {};' },
    { code: 'Ember.MODEL_FACTORY_INJECTIONS = true;' },
    { code: 'console.log(Ember.SOMETHING_NO_ONE_USES);' },
    { code: 'if (Ember.testing) {}' },
    {
      code: `import Component from '@ember/component';

        export default Component.extend({});
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `
        import Controller from '@ember/controller';
        import { bool } from '@ember/object/computed';

        export default Controller.extend({
          isTrue: bool('')
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: `import Ember from 'ember';

        const { Object: EmberObject } = Ember;

        export default Component.extend({});
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [
        {
          message:
            "Use import EmberObject from '@ember/object'; instead of using Ember destructuring",
          line: 3,
        },
      ],
    },
    {
      code: `import Ember from 'ember';

        const { $, Controller } = Ember;

        export default Controller.extend({});
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [
        {
          message: "Use import $ from 'jquery'; instead of using Ember destructuring",
          line: 3,
        },
        {
          message:
            "Use import Controller from '@ember/controller'; instead of using Ember destructuring",
          line: 3,
        },
      ],
    },
    {
      code: `import Ember from 'ember';

        const { Component, String: { htmlSafe } } = Ember;
        const TEST = 'MY TEST';

        export default Component.extend({});
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [
        {
          message:
            "Use import Component from '@ember/component'; instead of using Ember destructuring",
          line: 3,
        },
        {
          message:
            "Use import { htmlSafe } from '@ember/template'; instead of using Ember destructuring",
          line: 3,
        },
      ],
    },
    {
      code: `import Ember from 'ember';

        const { inject: { controller, service } } = Ember;

        export default Ember.Component.extend({
          myService: service('my-service')
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [
        {
          message:
            "Use import { inject as controller } from '@ember/controller'; instead of using Ember destructuring",
          line: 3,
        },
        {
          message:
            "Use import { inject as service } from '@ember/service'; instead of using Ember destructuring",
          line: 3,
        },
        {
          message: "Use import Component from '@ember/component'; instead of using Ember.Component",
          line: 5,
        },
      ],
    },
    {
      code: `
        import Ember from 'ember';
        import Component from '@ember/component';

        const { computed: { alias, uniq } } = Ember;

        export default Component.extend({});
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [
        {
          message:
            "Use import { alias } from '@ember/object/computed'; instead of using Ember destructuring",
          line: 5,
        },
        {
          message:
            "Use import { uniq } from '@ember/object/computed'; instead of using Ember destructuring",
          line: 5,
        },
      ],
    },
    {
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: 'export default Ember.Service;',
      output: null,
      errors: [
        {
          message: "Use import Service from '@ember/service'; instead of using Ember.Service",
          line: 1,
        },
      ],
    },
    {
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: 'export default Ember.Service.extend({});',
      output: null,
      errors: [
        {
          message: "Use import Service from '@ember/service'; instead of using Ember.Service",
          line: 1,
        },
      ],
    },
    {
      code: 'Ember.computed();',
      output: null,
      errors: [
        {
          message: "Use import { computed } from '@ember/object'; instead of using Ember.computed",
          line: 1,
        },
      ],
    },
    {
      code: 'Ember.computed.not();',
      output: null,
      errors: [
        {
          message:
            "Use import { not } from '@ember/object/computed'; instead of using Ember.computed.not",
          line: 1,
        },
      ],
    },
    {
      code: "Ember.inject.service('foo');",
      output: null,
      errors: [
        {
          message:
            "Use import { inject } from '@ember/service'; instead of using Ember.inject.service",
          line: 1,
        },
      ],
    },
    {
      code: 'var Router = Ember.Router.extend({});',
      output: null,
      errors: [
        {
          message:
            "Use import EmberRouter from '@ember/routing/router'; instead of using Ember.Router",
          line: 1,
        },
      ],
    },
    {
      code: "Ember.$('.foo')",
      output: null,
      errors: [
        {
          message: "Use import $ from 'jquery'; instead of using Ember.$",
          line: 1,
        },
      ],
    },
    {
      code: 'new Ember.RSVP.Promise();',
      output: null,
      errors: [
        {
          message: "Use import { Promise } from 'rsvp'; instead of using Ember.RSVP.Promise",
          line: 1,
        },
      ],
    },
  ],
});
