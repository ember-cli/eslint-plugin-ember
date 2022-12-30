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
    // Basic use in Route and Controller in single file
    {
      filename: 'pods/index.js',
      code: `
      import Route from '@ember/routing/route';
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export class IndexController extends Controller {
        @service('store') store;
        async loadData() {
          return this.store.findAll('rental');
        }
      }

      export class IndexRoute extends Route {
        @service('store') store;
        async model() {
          return this.store.findAll('rental');
        }
      }`,
    },
    // Basic use in Controller
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
    // Ignores if some other property getter is defined
    {
      filename: 'controller/index.js',
      code: `
      import Controller from '@ember/controller';
      import { action } from '@ember/object';
      import { inject as service } from '@ember/service';
      import storeMock from './my-mock';

      export default class IndexController extends Controller {
        store = storeMock;

        @action
        async loadUsers() {
          return this.store.findAll('user');
        }
      }`,
    },
    // Ignores if some other property getter is defined
    {
      filename: 'controller/index.js',
      code: `
      import Controller from '@ember/controller';
      import { action } from '@ember/object';
      import { inject as service } from '@ember/service';

      export default class IndexController extends Controller {
        get store() {
          return {}
        }
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
    // Does not check for Store use in Components
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
    // Does not check for Store use in GlimmerComponents
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
    // Checks custom config
    {
      filename: 'controllers/index.js',
      code: `
      import Controller from '@ember/controller';

      export default class IndexController extends Controller {
        @service('media') media;

        get isSmallScreen() {
          return this.media.isXs;
        }
      }`,
      options: [
        {
          denyList: [{ service: 'media', moduleNames: ['Component', 'Controller'] }],
        },
      ],
    },
    // Can ignore non-matching module types for custom config
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
          denyList: [{ service: 'media', moduleNames: ['Component', 'Controller'] }],
        },
      ],
    },
    // Ignores use outside of classes
    {
      filename: 'utils/support.js',
      code: `
      export function checkMedia() {
        return this.media.isXs;
      }`,
      options: [
        {
          denyList: [{ service: 'media' }],
        },
      ],
    },
    // Custom Configs work with multiple class/module types both matching and not
    {
      filename: 'pods/user.js',
      code: `
      import Route from '@ember/routing/route';
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export class User {
        get mediaAccount() {
          return this.media.account;
        }
      }

      export class UserController extends Controller {
        @service('media') media;

        get isSmallScreen() {
          return this.media.isXs;
        }
      }

      export class UserRoute extends Route {
        get isSmallScreen() {
          return this.media.isXs;
        }
      }`,
      options: [
        {
          denyList: [{ service: 'media', moduleNames: ['Component', 'Controller'] }],
        },
      ],
    },

    // Reassesses Module Type for Nested Classes
    {
      filename: 'controllers/register.js',
      code: `
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export class RegisterController extends Controller {
        @service('store') store;
        async loadData() {
          return this.store.findAll('rental');
        }

        getMediaUser() {
          return class Register {
            get storeInfo() {
              return this.store.address;
            }
          }
        }
      }`,
    },

    // Nested Ember Module Definition (used in some meta programming instances or decorators)
    {
      filename: 'utils/loads-user-controller.js',
      code: `
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export function mediaAwareRoute() {
        return class UserController extends Controller {
          @inject('store') store;
          async loadData() {
            return this.store.findAll('rental');
          }
        }
      }`,
      errors: [{ messageId: 'main', data: { serviceName: 'store' }, type: 'MemberExpression' }],
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
      import Component from '@glimmer/component';

      export default class IndexRoute extends Route {
        @service('router') router;
        message = 'hello';
        async model() {
          return this.store.findAll('rental');
        }
      }

      export class IndexRow extends Component {
        @service('store') storeService;

        navigate() {
          this.store.find(this.args.id);
        }
      }


      export class IndexTable extends Component {
        loadData() {
          this.store.find(this.args.id);
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
      import Route from '@ember/routing/route';
      import Component from '@glimmer/component';

      export default class IndexRoute extends Route {
        @service('store') store;
@service('router') router;
        message = 'hello';
        async model() {
          return this.store.findAll('rental');
        }
      }

      export class IndexRow extends Component {
        @service('store') storeService;

        navigate() {
          this.store.find(this.args.id);
        }
      }


      export class IndexTable extends Component {
        loadData() {
          this.store.find(this.args.id);
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
          denyList: [{ service: 'media', moduleNames: ['Component', 'Controller'] }],
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
          denyList: [{ service: 'flash-messages' }],
        },
      ],
      errors: [
        { messageId: 'main', data: { serviceName: 'flash-messages' }, type: 'MemberExpression' },
      ],
    },
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export class IndexController extends Controller {
        async loadData() {
          return this.store.findAll('rental');
        }
      }

      export default class IndexRoute extends Route {
        async model() {
          return this.store.findAll('rental');
        }
      }`,
      output: `
      import Route from '@ember/routing/route';
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export class IndexController extends Controller {
        @service('store') store;
async loadData() {
          return this.store.findAll('rental');
        }
      }

      export default class IndexRoute extends Route {
        @service('store') store;
async model() {
          return this.store.findAll('rental');
        }
      }`,
      errors: [
        { messageId: 'main', data: { serviceName: 'store' }, type: 'MemberExpression' },
        { messageId: 'main', data: { serviceName: 'store' }, type: 'MemberExpression' },
      ],
    },
    // Works for modules with multiple module types
    {
      filename: 'pods/user.js',
      code: `
      import Route from '@ember/routing/route';
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export class User {
        get mediaAccount() {
          return this.media.account;
        }
      }

      export class UserController extends Controller {
        get isSmallScreen() {
          return this.media.isXs;
        }
      }

      export class UserRoute extends Route {
        get isSmallScreen() {
          return this.media.isXs;
        }
      }`,
      output: `
      import Route from '@ember/routing/route';
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export class User {
        get mediaAccount() {
          return this.media.account;
        }
      }

      export class UserController extends Controller {
        @service('media') media;
get isSmallScreen() {
          return this.media.isXs;
        }
      }

      export class UserRoute extends Route {
        get isSmallScreen() {
          return this.media.isXs;
        }
      }`,
      options: [
        {
          denyList: [{ service: 'media', moduleNames: ['Component', 'Controller'] }],
        },
      ],
      errors: [{ messageId: 'main', data: { serviceName: 'media' }, type: 'MemberExpression' }],
    },

    // Reassesses Module Type for Nested Classes
    {
      filename: 'controllers/register.js',
      code: `
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export class RegisterController extends Controller {
        async loadData() {
          return this.store.findAll('rental');
        }

        getMediaUser() {
          return class Register {
            get storeInfo() {
              return this.store.address;
            }
          }
        }
      }`,
      output: `
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export class RegisterController extends Controller {
        @service('store') store;
async loadData() {
          return this.store.findAll('rental');
        }

        getMediaUser() {
          return class Register {
            get storeInfo() {
              return this.store.address;
            }
          }
        }
      }`,
      errors: [{ messageId: 'main', data: { serviceName: 'store' }, type: 'MemberExpression' }],
    },

    // Nested Ember Module Definition (used in some meta programming instances or decorators)
    {
      filename: 'utils/loads-user-controller.js',
      code: `
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export function mediaAwareRoute() {
        return class UserController extends Controller {
          async loadData() {
            return this.store.findAll('rental');
          }
        }
      }`,
      output: `
      import Controller from '@ember/controller';
      import { inject as service } from '@ember/service';

      export function mediaAwareRoute() {
        return class UserController extends Controller {
          @service('store') store;
async loadData() {
            return this.store.findAll('rental');
          }
        }
      }`,
      errors: [{ messageId: 'main', data: { serviceName: 'store' }, type: 'MemberExpression' }],
    },
  ],
});
