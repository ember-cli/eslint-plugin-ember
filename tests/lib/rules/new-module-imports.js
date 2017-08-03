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
    { code: 'Ember.onerror = function() {};' },
    { code: 'Ember.MODEL_FACTORY_INJECTIONS = true;' },
    { code: 'console.log(Ember.VERSION);' },
    { code: 'if (Ember.testing) {}' },
  ],
  invalid: [
    {
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: 'export default Ember.Service;',
      errors: [{ message: 'Use  import Service from \'@ember/service\';  instead of using  Ember.Service' }],
    },
    {
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      code: 'export default Ember.Service.extend({});',
      errors: [{ message: 'Use  import Service from \'@ember/service\';  instead of using  Ember.Service' }],
    },
    {
      code: 'Ember.computed();',
      errors: [{ message: 'Use  import { computed } from \'@ember/object\';  instead of using  Ember.computed' }],
    },
    {
      code: 'Ember.computed.not();',
      errors: [{ message: 'Use  import { not } from \'@ember/object/computed\';  instead of using  Ember.computed.not' }],
    },
    {
      code: 'Ember.inject.service(\'foo\');',
      errors: [{ message: 'Use  import { inject } from \'@ember/service\';  instead of using  Ember.inject.service' }],
    },
    {
      code: 'var Router = Ember.Router.extend({});',
      errors: [{ message: 'Use  import Router from \'@ember/routing/router\';  instead of using  Ember.Router' }],
    },
    {
      code: 'Ember.$(\'.foo\')',
      errors: [{ message: 'Use  import $ from \'jquery\';  instead of using  Ember.$' }],
    },
    {
      code: 'new Ember.RSVP.Promise();',
      errors: [{ message: 'Use  import RSVP from \'rsvp\';  instead of using  Ember.RSVP' }],
    },
  ],
});
