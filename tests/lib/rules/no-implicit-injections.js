'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-implicit-injections');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
};
const MESSAGE = rule.meta.message;

ruleTester.run('no-global-jquery', rule, {
  valid: [
    {
      code: `
        import Ember from 'ember';

        export default Ember.Component.extend({
          store: Ember.inject.service('store')
        });`,
      parserOptions,
    }, {
      code: `
        import Ember from 'ember';

        const { inject } = Ember;

        export default Ember.Component.extend({
          store: inject.service('store')
        });`,
      parserOptions,
    }, {
      code: `
        import Ember from 'ember';

        const { inject: service } = Ember;

        export default Ember.Component.extend({
          store: service('store')
        });`,
      parserOptions,
    }, {
      code: `
        import { inject } from '@ember/service';

        export default Ember.Component.extend({
          store: inject('store')
        });`,
      parserOptions,
    }, {
      code: `
        import { inject as service } from '@ember/service';

        export default Ember.Component.extend({
          store: service('store')
        });`,
      parserOptions,
    }, {
      code: `
        import Ember from 'ember';

        export default Ember.Controller.extend({
          users: Ember.inject.controller('users')
        });`,
      parserOptions,
    }, {
      code: `
        import Ember from 'ember';

        const { inject } = Ember;

        export default Ember.Controller.extend({
          users: inject.controller('users')
        });`,
      parserOptions,
    }, {
      code: `
        import Ember from 'ember';

        const { inject: controller } = Ember;

        export default Ember.Controller.extend({
          users: controller('users')
        });`,
      parserOptions,
    }, {
      code: `
        import { inject } from '@ember/controller';

        export default Ember.Controller.extend({
          users: inject('users')
        });`,
      parserOptions,
    }, {
      code: `
        import { inject as controller } from '@ember/controller';

        export default Ember.Controller.extend({
          users: controller('users')
        });`,
      parserOptions,
    }
  ],

  invalid: [
    {
      code: `
      import Ember from 'ember';

      export default Ember.Component.extend({
        store: Ember.inject.service()
      });`,
      parserOptions,
      errors: [{
        message: MESSAGE
      }]
    }, {
      code: `
      import Ember from 'ember';

      const { inject } = Ember;

      export default Ember.Component.extend({
        store: inject.service()
      });`,
      parserOptions,
      errors: [{
        message: MESSAGE
      }]
    }, {
      code: `
      import Ember from 'ember';

      const { inject: service } = Ember;

      export default Ember.Component.extend({
        store: service()
      });`,
      parserOptions,
      errors: [{
        message: MESSAGE
      }]
    }, {
      code: `
      import { inject } from '@ember/service';

      export default Ember.Component.extend({
        store: inject.service()
      });`,
      parserOptions,
      errors: [{
        message: MESSAGE
      }]
    }, {
      code: `
      import { inject as service } from '@ember/service';

      export default Ember.Component.extend({
        store: service()
      });`,
      parserOptions,
      errors: [{
        message: MESSAGE
      }]
    }, {
      code: `
        import Ember from 'ember';

        export default Ember.Controller.extend({
          users: Ember.inject.controller()
        });`,
      parserOptions,
      errors: [{
        message: MESSAGE
      }]
    }, {
      code: `
        import Ember from 'ember';

        const { inject } = Ember;

        export default Ember.Controller.extend({
          users: inject.controller()
        });`,
      parserOptions,
      errors: [{
        message: MESSAGE
      }]
    }, {
      code: `
        import Ember from 'ember';

        const { inject: controller } = Ember;

        export default Ember.Controller.extend({
          users: controller()
        });`,
      parserOptions,
      errors: [{
        message: MESSAGE
      }]
    }, {
      code: `
        import { inject } from '@ember/controller';

        export default Ember.Controller.extend({
          users: inject()
        });`,
      parserOptions,
      errors: [{
        message: MESSAGE
      }]
    }, {
      code: `
        import { inject as controller } from '@ember/controller';

        export default Ember.Controller.extend({
          users: controller()
        });`,
      parserOptions,
      errors: [{
        message: MESSAGE
      }]
    }
  ]
});
