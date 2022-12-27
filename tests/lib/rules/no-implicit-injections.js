//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-implicit-injections');
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

ruleTester.run('no-implicit-injections', rule, {
  valid: [
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export default class IndexRoute extends Route {
        @service('store') store;
        async model() {
          return this.store.findAll('rental');
        }
      }`,
    },
    {
      filename: 'controller/index.js',
      code: `
      import Controller from '@ember/controller';
      import { action } from '@ember/object';
      import { inject as service } from '@ember/service';

      export default class IndexController extends Controller {
        @service('store') store;
        @action
        async loadUsers() {
          return this.store.findAll('user');
        }
      }`,
    },
    // Only checks for ThisExpression
    {
      filename: 'controller/index.js',
      code: `
      import Controller from '@ember/controller';
      import { action } from '@ember/object';

      export default class IndexController extends Controller {
        @action
        async loadUsers(arg) {
          return arg.store.findAll('user');
        }
      }`,
    },
    {
      filename: 'components/foobar.js',
      code: `
      import Component from '@ember/component';

      export default class FoobarTest extends Component {
        async model() {
          return this.store.isXs;
        }
      }`,
    },
    {
      filename: 'components/foobar.js',
      code: `
      import Component from '@glimmer/component';

      export default class FoobarTest extends Component {
        async model() {
          return this.store.isXs;
        }
      }`,
    },
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';

      export default class IndexRoute extends Route {
        get isSmallScreen() {
          return this.media.isXs;
        }
      }`,
      options: [
        {
          services: [{ serviceName: 'media', moduleNames: ['Component', 'Controller'] }],
        },
      ],
    },
    {
      filename: 'utils/support.js',
      code: `
      export function checkMedia() {
        return this.media.isXs;
      }`,
      options: [
        {
          services: [{ serviceName: 'media' }],
        },
      ],
    },
  ],
  invalid: [
    // Basic store lint error in routes/controllers
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';

      export default class IndexRoute extends Route {
        message = 'hello';
        async model() {
          return this.store.findAll('rental');
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

      export default class IndexRoute extends Route {
        @service('store') store;
message = 'hello';
        async model() {
          return this.store.findAll('rental');
        }
      }`,
      errors: [{ messageId: 'main', data: { serviceName: 'store' }, type: 'MemberExpression' }],
    },
    {
      filename: 'controller/index.js',
      code: `
      import Controller from '@ember/controller';
      import { action } from '@ember/object';

      export default class IndexController extends Controller {
        @action
        async loadUsers() {
          return this.store.findAll('user');
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
      import { action } from '@ember/object';

      export default class IndexController extends Controller {
        @service('store') store;
@action
        async loadUsers() {
          return this.store.findAll('user');
        }
      }`,
      errors: [{ messageId: 'main', data: { serviceName: 'store' }, type: 'MemberExpression' }],
    },
    // Existing import for service injection
    {
      filename: 'routes/index.js',
      code: `
      import { inject as service } from '@ember/service';
      import Route from '@ember/routing/route';

      export default class IndexRoute extends Route {
        @service('router') router;
        message = 'hello';
        async model() {
          return this.store.findAll('rental');
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
      import Route from '@ember/routing/route';

      export default class IndexRoute extends Route {
        @service('store') store;
@service('router') router;
        message = 'hello';
        async model() {
          return this.store.findAll('rental');
        }
      }`,
      errors: [{ messageId: 'main', data: { serviceName: 'store' }, type: 'MemberExpression' }],
    },

    {
      filename: 'routes/index.js',
      code: `
      import { inject } from '@ember/service';
      import Route from '@ember/routing/route';

      export default class IndexRoute extends Route {
        @inject('router') router;
        message = 'hello';
        async model() {
          return this.store.findAll('rental');
        }
      }`,
      output: `
      import { inject } from '@ember/service';
      import Route from '@ember/routing/route';

      export default class IndexRoute extends Route {
        @inject('store') store;
@inject('router') router;
        message = 'hello';
        async model() {
          return this.store.findAll('rental');
        }
      }`,
      errors: [{ messageId: 'main', data: { serviceName: 'store' }, type: 'MemberExpression' }],
    },

    // Custom options
    {
      filename: 'components/foobar.js',
      code: `
      import Component from '@ember/component';

      export default class FoobarTestError extends Component {
        get isSmallScreen() {
          return this.media.isXs;
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
import Component from '@ember/component';

      export default class FoobarTestError extends Component {
        @service('media') media;
get isSmallScreen() {
          return this.media.isXs;
        }
      }`,
      options: [
        {
          services: [{ serviceName: 'media', moduleNames: ['Component', 'Controller'] }],
        },
      ],
      errors: [{ messageId: 'main', data: { serviceName: 'media' }, type: 'MemberExpression' }],
    },
    // Custom options with dasherized service name
    {
      filename: 'components/foobar.js',
      code: `
      import Component from '@ember/component';

      export default class FoobarTestError extends Component {
        @action
        get save() {
          return this.flashMessages.warn('some message');
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
import Component from '@ember/component';

      export default class FoobarTestError extends Component {
        @service('flash-messages') flashMessages;
@action
        get save() {
          return this.flashMessages.warn('some message');
        }
      }`,
      options: [
        {
          services: [{ serviceName: 'flashMessages' }],
        },
      ],
      errors: [
        { messageId: 'main', data: { serviceName: 'flashMessages' }, type: 'MemberExpression' },
      ],
    },
  ],
});
