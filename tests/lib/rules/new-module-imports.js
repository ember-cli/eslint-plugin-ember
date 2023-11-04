// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/new-module-imports');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
});
eslintTester.run('new-module-imports', rule, {
  valid: [
    {
      code: `import Ember from 'ember';

        const { Handlebars: { Utils: { escapeExpression } } } = Ember
      `,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
    'Ember.Handlebars.Utils.escapeExpression("foo");',
    'Ember.onerror = function() {};',
    'Ember.MODEL_FACTORY_INJECTIONS = true;',
    'console.log(Ember.SOMETHING_NO_ONE_USES);',
    'if (Ember.testing) {}',
    {
      code: `import Component from '@ember/component';

        export default Component.extend({});
      `,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
    {
      code: `
        import Controller from '@ember/controller';
        import { bool } from '@ember/object/computed';

        export default Controller.extend({
          isTrue: bool(''),
          ...foo
        });
      `,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
    {
      code: `import LOL from 'who-knows-but-definitely-not-ember';

        const { Controller } = LOL;
      `,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
    {
      code: 'export const Ember = 1;',
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
    {
      code: 'for (let i = 0; i < 10; i++) { }',
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
    'SomethingRandom.Ember.Service;',
  ],
  invalid: [
    {
      code: `import Ember from 'ember';

        const { Object: EmberObject } = Ember;

        export default Component.extend({});
      `,
      output: null,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      errors: [
        {
          message:
            "Use `import EmberObject from '@ember/object';` instead of using Ember destructuring",
          line: 3,
        },
      ],
    },
    {
      code: `import LOL from 'ember';

        const { Controller } = LOL;
      `,
      output: null,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      errors: [
        {
          message:
            "Use `import Controller from '@ember/controller';` instead of using Ember destructuring",
          line: 3,
        },
      ],
    },
    {
      code: `import Ember from 'ember';

        const { $, Controller } = Ember;

        export default Controller.extend({});
      `,
      output: null,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      errors: [
        {
          message: "Use `import $ from 'jquery';` instead of using Ember destructuring",
          line: 3,
        },
        {
          message:
            "Use `import Controller from '@ember/controller';` instead of using Ember destructuring",
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
      output: null,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      errors: [
        {
          message:
            "Use `import Component from '@ember/component';` instead of using Ember destructuring",
          line: 3,
        },
        {
          message:
            "Use `import { htmlSafe } from '@ember/template';` instead of using Ember destructuring",
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
      output: null,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      errors: [
        {
          message:
            "Use `import { inject as controller } from '@ember/controller';` instead of using Ember destructuring",
          line: 3,
        },
        {
          message:
            "Use `import { inject as service } from '@ember/service';` instead of using Ember destructuring",
          line: 3,
        },
        {
          message:
            "Use `import Component from '@ember/component';` instead of using Ember.Component",
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
      output: null,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      errors: [
        {
          message:
            "Use `import { alias } from '@ember/object/computed';` instead of using Ember destructuring",
          line: 5,
        },
        {
          message:
            "Use `import { uniq } from '@ember/object/computed';` instead of using Ember destructuring",
          line: 5,
        },
      ],
    },
    {
      code: 'export default Ember.Service;',
      output: null,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      errors: [
        {
          message: "Use `import Service from '@ember/service';` instead of using Ember.Service",
          line: 1,
        },
      ],
    },
    {
      code: 'export default Ember.Service.extend({});',
      output: null,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      errors: [
        {
          message: "Use `import Service from '@ember/service';` instead of using Ember.Service",
          line: 1,
        },
      ],
    },
    {
      code: 'Ember.computed();',
      output: null,
      errors: [
        {
          message:
            "Use `import { computed } from '@ember/object';` instead of using Ember.computed",
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
            "Use `import { not } from '@ember/object/computed';` instead of using Ember.computed.not",
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
            "Use `import { inject } from '@ember/service';` instead of using Ember.inject.service",
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
            "Use `import EmberRouter from '@ember/routing/router';` instead of using Ember.Router",
          line: 1,
        },
      ],
    },
    {
      code: "Ember.$('.foo')",
      output: null,
      errors: [
        {
          message: "Use `import $ from 'jquery';` instead of using Ember.$",
          line: 1,
        },
      ],
    },
    {
      code: 'new Ember.RSVP.Promise();',
      output: null,
      errors: [
        {
          message: "Use `import { Promise } from 'rsvp';` instead of using Ember.RSVP.Promise",
          line: 1,
        },
      ],
    },
  ],
});
