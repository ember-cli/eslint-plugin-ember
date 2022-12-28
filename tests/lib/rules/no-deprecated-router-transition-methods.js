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
    ecmaVersion: 2020,
    sourceType: 'module',
    babelOptions: {
      configFile: require.resolve('../../../.babelrc'),
    },
  },
});

ruleTester.run('no-deprecated-router-transition-methods', rule, {
  valid: [
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
            this.router.transitionTo('login');
          }
        }
      }`,
    },
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';
      export default class SettingsRoute extends Route {
        @service() router;
        @service session;
        beforeModel() {
          if (!this.session.isAuthenticated) {
            this.router.transitionTo('login');
          }
        }
      }`,
    },
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
  ],
  invalid: [
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
  ],
});
