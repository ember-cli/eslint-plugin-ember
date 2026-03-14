//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-router-transition-methods');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    babelOptions: {
      configFile: require.resolve('../../../.babelrc'),
      plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
    },
  },
});

function validRouteClassUsage(serviceDefinition) {
  return {
    filename: 'routes/index.js',
    code: `
    import Route from '@ember/routing/route';
    import { inject as service } from '@ember/service';

    export default class SettingsRoute extends Route {
      ${serviceDefinition}
      @service session;

      beforeModel() {
        if (!this.session.isAuthenticated) {
          this.router.transitionTo('login');
        }
      }
    }`,
  };
}

function validRouteExtendUsage(serviceDefinition) {
  return {
    filename: 'routes/index.js',
    code: `
    import Route from '@ember/routing/route';
    import { inject as service } from '@ember/service';

    export default Route.extend({
      ${serviceDefinition}
      session: service(),

      beforeModel() {
        if (!this.session.isAuthenticated) {
          this.router.transitionTo('login');
        }
      }
    })`,
  };
}

function invalidRouteClassUsage(serviceDefinition, { routerServiceName, methodUsed }) {
  return {
    filename: 'routes/index.js',
    errors: [
      {
        messageId: 'main',
        data: { methodUsed, desiredMethod: methodUsed, moduleType: 'Route' },
        type: 'MemberExpression',
      },
    ],
    code: `
    import Route from '@ember/routing/route';
    import { inject as service } from '@ember/service';

    export default class SettingsRoute extends Route {
      ${serviceDefinition}
      @service session;

      beforeModel() {
        if (!this.session.isAuthenticated) {
          this.${methodUsed}('login');
        }
      }
    }`,
    output: `
    import Route from '@ember/routing/route';
    import { inject as service } from '@ember/service';

    export default class SettingsRoute extends Route {
      ${serviceDefinition}
      @service session;

      beforeModel() {
        if (!this.session.isAuthenticated) {
          this.${routerServiceName ?? 'router'}.${methodUsed}('login');
        }
      }
    }`,
  };
}

function invalidRouteExtendUsage(serviceDefinition, { routerServiceName, methodUsed }) {
  return {
    filename: 'routes/index.js',
    errors: [
      {
        messageId: 'main',
        data: { methodUsed, desiredMethod: methodUsed, moduleType: 'Route' },
        type: 'MemberExpression',
      },
    ],
    code: `
    import Route from '@ember/routing/route';
    import { inject as service } from '@ember/service';

    export default Route.extend({
      ${serviceDefinition}
      session: service(),

      beforeModel() {
        if (!this.session.isAuthenticated) {
          this.${methodUsed}('login');
        }
      }
    })`,
    output: `
    import Route from '@ember/routing/route';
    import { inject as service } from '@ember/service';

    export default Route.extend({
      ${serviceDefinition}
      session: service(),

      beforeModel() {
        if (!this.session.isAuthenticated) {
          this.${routerServiceName ?? 'router'}.${methodUsed}('login');
        }
      }
    })`,
  };
}

ruleTester.run('no-deprecated-router-transition-methods', rule, {
  valid: [
    // Route Uses RouterService.transitionTo with different service injection types
    validRouteClassUsage('@service router'),
    validRouteClassUsage('@service() router'),
    validRouteClassUsage("@service('router') router"),

    // Legacy .extends Route Uses RouterService.transitionTo with different service injection types
    validRouteExtendUsage('router: service(),'),
    validRouteExtendUsage("router: service('router'),"),

    // Route Uses RouterService.replaceWith
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export default class SettingsRoute extends Route {
        @service('router') router;
        @service session;
        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.router.replaceWith('login');
          }
        }
      }`,
    },
    // Controller Uses RouterService.transitionTo
    {
      filename: 'controllers/index.js',
      code: `
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';
      import { action } from '@ember/object';

      export default class NewPostController1 extends Controller {
        @service('router') router;

        @action
        async save({ title, text }) {
          let post = this.store.createRecord('post', { title, text });
          await post.save();
          return this.router.transitionTo('post', post.id);
        }
      }`,
    },
    // Controller Uses RouterService.replaceWith
    {
      filename: 'controllers/index.js',
      code: `
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';
      import { action } from '@ember/object';

      export default class NewPostController1 extends Controller {
        @service('router') router;

        @action
        async save({ title, text }) {
          let post = this.store.createRecord('post', { title, text });
          await post.save();
          return this.router.replaceWith('post', post.id);
        }
      }`,
    },
    // Rule does not fire in components or modules outside of controller/routes
    {
      filename: 'components/index.js',
      code: `
      import Component from '@ember/component';
      import { action } from '@ember/object';

      export default class NewPostComponent extends Component {
        @action
        async save({ title, text }) {
          let post = this.store.createRecord('post', { title, text });
          await post.save();
          return this.transitionTo('post', post.id);
        }
      }`,
    },
    // Test ignore rule in non Ember classes
    {
      filename: 'routes/index.js',
      code: `
      export class Settings {
        model() {
          this.transitionTo('index')
        }
      }`,
    },

    // Test rule in class returned by function
    {
      filename: 'controllers/index.js',
      code: `
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';
      import { action } from '@ember/object';

      export default function saver() {
        return class NewPostController1 extends Controller {
          @service('router') router;

          @action
          async save({ title, text }) {
            let post = this.store.createRecord('post', { title, text });
            await post.save();
            return this.router.replaceWith('post', post.id);
          }
        }
      }`,
    },

    // Test rule is not triggered by invalid nested classes
    {
      filename: 'controllers/index.js',
      code: `
      import Controller from '@ember/controller';

      export default class NewPostController1 extends Controller {
        createSetting() {
          return class Settings {
            model() {
              this.transitionTo('index');
            }
          };
        }
      }`,
    },

    // Test Multiple Classes in One File
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export class SettingsIndexRoute extends Route {
        model() {
          return [];
        }
      }

      export class SettingsDetailRoute extends Route {
        @service('settings') settingsService;

        async model(id) {
          return new Setting(await this.settingsService.find(id));
        }
      }

      export class SettingsRoute extends Route {
        @service() router;
        @service session;
        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.router.transitionTo('login');
          }
        }
      }`,
    },

    // Does not error on .create
    {
      filename: 'utils/loads-user-controller.js',
      code: `
      import Controller from '@ember/controller';

      const myObj = Controller.create();`,
    },

    // Does not error on empty .extend
    {
      filename: 'utils/loads-user-controller.js',
      code: `
      import Controller from '@ember/controller';

      const myObj = Controller.extend()`,
    },

    // Does not error when using mixin with native class (common for validations)
    {
      filename: 'controllers/index.js',
      code: `
      import Controller from '@ember/controller';
      import SomeMixin from './my-mixin';

      export default class FoobarTestError extends Controller.extend(SomeMixin) {
      }`,
    },

    // Does not error when using Mixin
    {
      filename: 'controller/index.js',
      code: `
      import Controller from '@ember/controller';
      import SomeMixin from './my-mixin';

      export default Component.extend(SomeMixin, {
      });`,
    },

    // Does not error when dot access decorator is used
    {
      filename: 'controllers/dot-access.js',
      code: `
      import Controller from '@ember/controller';
      import SomeMixin from './my-mixin';
      import EmberObject, { computed } from '@ember/object';

      export default class FoobarTestError extends Controller {
        @computed.reads('model.actors') actors;
      }`,
    },

    // Does not error when `this` is from a test context
    {
      filename: 'tests/application/output-demos-test.ts',
      code: `
      import Controller from '@ember/controller';
      import { visit } from '@ember/test-helpers';
      import { module, test } from 'qunit';
      import { setupApplicationTest } from 'ember-qunit';

      module('Output > Demos', function (hooks) {
        setupApplicationTest(hooks);

        module('The output frame renders every demo', function () {
            test('example', async function (assert) {
              class FakeController extends Controller {}
              this.owner.register('controller:edit', FakeController);
              await visit('/edit');
            });
        });
      });

      `,
    },
  ],
  invalid: [
    // Route Uses RouterService.transitionTo with different service injection types
    invalidRouteClassUsage('@service router', { methodUsed: 'transitionTo' }),
    invalidRouteClassUsage('@service() router', { methodUsed: 'transitionTo' }),
    invalidRouteClassUsage("@service('router') router", { methodUsed: 'transitionTo' }),
    invalidRouteClassUsage("@service('router') routerService", {
      methodUsed: 'transitionTo',
      routerServiceName: 'routerService',
    }),

    // Legacy .extends Route Uses RouterService.transitionTo with different service injection types
    invalidRouteExtendUsage('router: service(),', { methodUsed: 'transitionTo' }),
    invalidRouteExtendUsage("router: service('router'),", {
      methodUsed: 'transitionTo',
    }),
    invalidRouteExtendUsage("routerMcRouteFace: service('router'),", {
      methodUsed: 'transitionTo',
      routerServiceName: 'routerMcRouteFace',
    }),

    // Legacy .extends without an existing router service injection
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export default Route.extend({
        session: service(),

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.transitionTo('login');
          }
        }
      })`,
      output: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export default Route.extend({
        router: service('router'),
session: service(),

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.router.transitionTo('login');
          }
        }
      })`,
      errors: [
        {
          messageId: 'main',
          data: { methodUsed: 'transitionTo', desiredMethod: 'transitionTo', moduleType: 'Route' },
          type: 'MemberExpression',
        },
      ],
    },

    // Basic lint error in routes
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export default class SettingsRoute extends Route {
        @service session;

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.transitionTo('login');
          }
        }
      }`,
      output: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export default class SettingsRoute extends Route {
        @service('router') router;
@service session;

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.router.transitionTo('login');
          }
        }
      }`,
      errors: [
        {
          messageId: 'main',
          type: 'MemberExpression',
        },
      ],
    },
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export default class SettingsRoute extends Route {
        @service session;

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.replaceWith('login');
          }
        }
      }`,
      output: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export default class SettingsRoute extends Route {
        @service('router') router;
@service session;

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.router.replaceWith('login');
          }
        }
      }`,
      errors: [
        {
          messageId: 'main',
          type: 'MemberExpression',
        },
      ],
    },
    // Basic lint error in controllers
    {
      filename: 'controllers/new-post.js',
      code: `
      import Controller from '@ember/controller';
      import { action } from '@ember/object';

      export default class NewPostController1 extends Controller {
        @action
        async save({ title, text }) {
          let post = this.store.createRecord('post', { title, text });
          await post.save();
          return this.transitionToRoute('post', post.id);
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
      import { action } from '@ember/object';

      export default class NewPostController1 extends Controller {
        @service('router') router;
@action
        async save({ title, text }) {
          let post = this.store.createRecord('post', { title, text });
          await post.save();
          return this.router.transitionTo('post', post.id);
        }
      }`,
      errors: [
        {
          messageId: 'main',
          type: 'MemberExpression',
        },
      ],
    },
    {
      filename: 'controllers/new-post.js',
      code: `
      import Controller from '@ember/controller';
      import { action } from '@ember/object';

      export default class NewPostController1 extends Controller {
        @action
        async save({ title, text }) {
          let post = this.store.createRecord('post', { title, text });
          await post.save();
          return this.replaceRoute('post', post.id);
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
      import { action } from '@ember/object';

      export default class NewPostController1 extends Controller {
        @service('router') router;
@action
        async save({ title, text }) {
          let post = this.store.createRecord('post', { title, text });
          await post.save();
          return this.router.replaceWith('post', post.id);
        }
      }`,
      errors: [
        {
          messageId: 'main',
          type: 'MemberExpression',
        },
      ],
    },

    // Existing router service
    {
      filename: 'controllers/new-post.js',
      code: `
      import { inject as service } from '@ember/service';
      import Controller from '@ember/controller';
      import { action } from '@ember/object';

      export default class NewPostController2 extends Controller {
        @service('router') routerService;

        @action
        async save({ title, text }) {
          let post = this.store.createRecord('post', { title, text });
          await post.save();
          return this.transitionToRoute('post', post.id);
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
      import Controller from '@ember/controller';
      import { action } from '@ember/object';

      export default class NewPostController2 extends Controller {
        @service('router') routerService;

        @action
        async save({ title, text }) {
          let post = this.store.createRecord('post', { title, text });
          await post.save();
          return this.routerService.transitionTo('post', post.id);
        }
      }`,
      errors: [
        {
          messageId: 'main',
          type: 'MemberExpression',
        },
      ],
    },
    // Controller uses transitionToRoute with custom service injection import
    {
      filename: 'controllers/new-post.js',
      code: `
      import { inject as serviceInjection } from '@ember/service';
      import Controller from '@ember/controller';
      import { action } from '@ember/object';

      export default class NewPostController3 extends Controller {
        @serviceInjection('router') routerService;

        @action
        async save({ title, text }) {
          let post = this.store.createRecord('post', { title, text });
          await post.save();
          return this.transitionToRoute('post', post.id);
        }
      }`,
      output: `
      import { inject as serviceInjection } from '@ember/service';
      import Controller from '@ember/controller';
      import { action } from '@ember/object';

      export default class NewPostController3 extends Controller {
        @serviceInjection('router') routerService;

        @action
        async save({ title, text }) {
          let post = this.store.createRecord('post', { title, text });
          await post.save();
          return this.routerService.transitionTo('post', post.id);
        }
      }`,
      errors: [
        {
          messageId: 'main',
          type: 'MemberExpression',
        },
      ],
    },
    // Existing injection name other than service
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { inject as injectService } from '@ember/service';

      export default class SettingsRoute extends Route {
        @injectService session;

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.transitionTo('login');
          }
        }
      }`,
      output: `
      import Route from '@ember/routing/route';
      import { inject as injectService } from '@ember/service';

      export default class SettingsRoute extends Route {
        @injectService('router') router;
@injectService session;

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.router.transitionTo('login');
          }
        }
      }`,
      errors: [
        {
          messageId: 'main',
          type: 'MemberExpression',
        },
      ],
    },
    // Injecting with `service` export
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { service } from '@ember/service';

      export default class SettingsRoute extends Route {
        @service session;

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.transitionTo('login');
          }
        }
      }`,
      output: `
      import Route from '@ember/routing/route';
      import { service } from '@ember/service';

      export default class SettingsRoute extends Route {
        @service('router') router;
@service session;

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.router.transitionTo('login');
          }
        }
      }`,
      errors: [
        {
          messageId: 'main',
          type: 'MemberExpression',
        },
      ],
    },
    // Test multiple classes in a single file
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export class SettingsIndexRoute extends Route {
        @service session;
        @service('router') routerService;

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.transitionTo('login');
          }
        }

        model() {
          return [];
        }
      }

      export class SettingsDetailRoute extends Route {
        @service('settings') settingsService;

        async model(id) {
          return new Setting(await this.settingsService.find(id));
        }
      }

      export class SettingsRoute extends Route {
        @service() router;
        @service session;
        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.transitionTo('login');
          }
        }
      }`,

      output: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export class SettingsIndexRoute extends Route {
        @service session;
        @service('router') routerService;

        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.routerService.transitionTo('login');
          }
        }

        model() {
          return [];
        }
      }

      export class SettingsDetailRoute extends Route {
        @service('settings') settingsService;

        async model(id) {
          return new Setting(await this.settingsService.find(id));
        }
      }

      export class SettingsRoute extends Route {
        @service() router;
        @service session;
        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.router.transitionTo('login');
          }
        }
      }`,
      errors: [
        {
          messageId: 'main',
          type: 'MemberExpression',
        },
        {
          messageId: 'main',
          type: 'MemberExpression',
        },
      ],
    },

    // Test rule in class returned by function
    {
      filename: 'controllers/index.js',
      code: `
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';
      import { action } from '@ember/object';

      export default function saver() {
        return class NewPostController1 extends Controller {
          @service('router') router;

          @action
          async save({ title, text }) {
            let post = this.store.createRecord('post', { title, text });
            await post.save();
            return this.replaceRoute('post', post.id);
          }
        }
      }`,
      output: `
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';
      import { action } from '@ember/object';

      export default function saver() {
        return class NewPostController1 extends Controller {
          @service('router') router;

          @action
          async save({ title, text }) {
            let post = this.store.createRecord('post', { title, text });
            await post.save();
            return this.router.replaceWith('post', post.id);
          }
        }
      }`,
      errors: [
        {
          messageId: 'main',
          type: 'MemberExpression',
        },
      ],
    },

    // Legacy .extend Route with decorators
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { action } from '@ember/object';

      export default Route.extend({
        @action
        foo() {
          this.transitionTo('login');
        }
      });`,
      output: `
      import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
      import { action } from '@ember/object';

      export default Route.extend({
        router: service('router'),
@action
        foo() {
          this.router.transitionTo('login');
        }
      });`,
      errors: [
        {
          messageId: 'main',
          data: { methodUsed: 'transitionTo', desiredMethod: 'transitionTo', moduleType: 'Route' },
          type: 'MemberExpression',
        },
      ],
    },
  ],
});
