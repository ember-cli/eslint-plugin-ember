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
    ecmaVersion: 2022,
    sourceType: 'module',
    babelOptions: {
      configFile: require.resolve('../../../.babelrc'),
      plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
    },
  },
});

const FLASH_MESSAGES_CONFIG = {
  denyList: [{ service: 'flash-messages' }],
};
const MEDIA_CONFIG = {
  denyList: [{ service: 'media', moduleNames: ['Component', 'Controller'] }],
};
const FEATURE_CHECKER_CONFIG = {
  denyList: [{ service: 'feature', propertyName: 'featureChecker' }],
};
const NESTED_SERVICE_CONFIG = {
  denyList: [{ service: 'cart/checkout', propertyName: 'checkout' }],
};

function createClassUsage(serviceDefinition) {
  return {
    filename: 'pods/index.js',
    code: `
    import { inject as service } from '@ember/service';
    import Component from '@ember/component';

    export default class FoobarTestError extends Component {
      ${serviceDefinition}

      @action
      save() {
        return this.flashMessages.warn('some message');
      }
    }`,
    options: [FLASH_MESSAGES_CONFIG],
  };
}

function createExtendUsage(serviceDefinition) {
  return {
    filename: 'pods/index.js',
    code: `
    import { inject as service } from '@ember/service';
    import Component from '@ember/component';

    export default Component.extend({
      ${serviceDefinition}

      actions: {

        save() {
          return this.flashMessages.warn('some message');
        }
      }
    });`,
    options: [FLASH_MESSAGES_CONFIG],
  };
}

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
      options: [MEDIA_CONFIG],
    },
    // Ignores use when property name is modified from 1:1 mapping
    {
      filename: 'controllers/index.js',
      code: `
      import Controller from '@ember/controller';

      export default class IndexController extends Controller {
        get isSmallScreen() {
          return this.feature.isXs;
        }
      }`,
      options: [FEATURE_CHECKER_CONFIG],
    },
    // Can detect changed property mapping
    {
      filename: 'routes/index.js',
      code: `
      import { inject as service } from '@ember/service';
      import Route from '@ember/routing/route';

      export default class IndexRoute extends Route {
        @service('feature') featureChecker;

        get canVisitCheckout() {
          return this.featureChecker.isEnabled('checkout');
        }
      }`,
      options: [FEATURE_CHECKER_CONFIG],
    },
    // Can work with services with nested module paths
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export default class IndexRoute extends Route {
        @service('cart/checkout') checkout;

        model() {
          return this.checkout.viewCart();
        }
      }`,
      options: [NESTED_SERVICE_CONFIG],
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
      options: [MEDIA_CONFIG],
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
    },

    // Exhaustive check for property definition type
    createClassUsage('@service flashMessages'),
    createClassUsage('@service() flashMessages'),
    createClassUsage("@service('flashMessages') flashMessages"),
    createClassUsage("@service('flash-messages') flashMessages"),

    createExtendUsage('flashMessages: service(),'),
    createExtendUsage("flashMessages: service('flashMessages'),"),
    createExtendUsage("flashMessages: service('flash-messages'),"),

    // Does not error on .create
    {
      filename: 'utils/loads-user-controller.js',
      code: `
      import EmberObject from '@ember/object';

      const myObj = EmberObject.create();`,
    },

    // Does not error on empty .extend
    {
      filename: 'utils/loads-user-controller.js',
      code: `
      import EmberObject from '@ember/object';

      const myObj = EmberObject.extend()`,
    },

    // Does not error when using mixin with native class (common for validations)
    {
      filename: 'controller-mixin/index.js',
      code: `
      import { inject as service } from '@ember/service';
      import Component from '@ember/component';
      import SomeMixin from './my-mixin';

      export default class FoobarTestError extends Component.extend(SomeMixin) {
        @service flashMessages;

        @action
        save() {
          return this.flashMessages.warn('some message');
        }
      }`,
      options: [FLASH_MESSAGES_CONFIG],
    },

    // Does not error when using Mixin
    {
      filename: 'controller/index.js',
      code: `
      import { inject as service } from '@ember/service';
      import Component from '@ember/component';
      import SomeMixin from './my-mixin';

      export default Component.extend(SomeMixin, {
        flashMessages: service(),

        actions: {

          save() {
            return this.flashMessages.warn('some message');
          }
        }
      });`,
      options: [FLASH_MESSAGES_CONFIG],
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
      options: [MEDIA_CONFIG],
      errors: [{ messageId: 'main', data: { serviceName: 'media' }, type: 'MemberExpression' }],
    },
    // Custom options with dasherized service name
    {
      filename: 'components/foobar.js',
      code: `
      import Component from '@ember/component';

      export default class FoobarTestError extends Component {
        @action
        save() {
          return this.flashMessages.warn('some message');
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
import Component from '@ember/component';

      export default class FoobarTestError extends Component {
        @service('flash-messages') flashMessages;
@action
        save() {
          return this.flashMessages.warn('some message');
        }
      }`,
      options: [FLASH_MESSAGES_CONFIG],
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
      options: [MEDIA_CONFIG],
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

    {
      code: `
      import { inject as service } from '@ember/service';
      import Component from '@ember/component';

      export default class FoobarTestError extends Component {
        @action
        save() {
          return this.flashMessages.warn('some message');
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
      import Component from '@ember/component';

      export default class FoobarTestError extends Component {
        @service('flash-messages') flashMessages;
@action
        save() {
          return this.flashMessages.warn('some message');
        }
      }`,
      options: [FLASH_MESSAGES_CONFIG],
      errors: [
        { messageId: 'main', data: { serviceName: 'flash-messages' }, type: 'MemberExpression' },
      ],
    },
    // Can detect changed property mapping
    {
      filename: 'routes/checkout.js',
      code: `
      import { inject as service } from '@ember/service';
      import Route from '@ember/routing/route';

      export default class CheckoutRoute extends Route {
        get canVisitCheckout() {
          return this.featureChecker.isEnabled('checkout');
        }
      }`,
      output: `
      import { inject as service } from '@ember/service';
      import Route from '@ember/routing/route';

      export default class CheckoutRoute extends Route {
        @service('feature') featureChecker;
get canVisitCheckout() {
          return this.featureChecker.isEnabled('checkout');
        }
      }`,
      options: [FEATURE_CHECKER_CONFIG],
      errors: [{ messageId: 'main', data: { serviceName: 'feature' }, type: 'MemberExpression' }],
    },

    // Can work with services with nested module paths
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export default class IndexRoute extends Route {
        model() {
          return this.checkout.viewCart();
        }
      }`,
      output: `
      import Route from '@ember/routing/route';
      import { inject as service } from '@ember/service';

      export default class IndexRoute extends Route {
        @service('cart/checkout') checkout;
model() {
          return this.checkout.viewCart();
        }
      }`,
      options: [NESTED_SERVICE_CONFIG],
      errors: [
        { messageId: 'main', data: { serviceName: 'cart/checkout' }, type: 'MemberExpression' },
      ],
    },

    // Check use and fix in legacy ember components
    {
      filename: 'pods/index.js',
      code: `
        import { inject as service } from '@ember/service';
        import Component from '@ember/component';

        export default Component.extend({
          actions: {
            save() {
              return this.flashMessages.warn('some message');
            }
          }
        });`,
      output: `
        import { inject as service } from '@ember/service';
        import Component from '@ember/component';

        export default Component.extend({
          flashMessages: service('flash-messages'),
actions: {
            save() {
              return this.flashMessages.warn('some message');
            }
          }
        });`,
      options: [FLASH_MESSAGES_CONFIG],
      errors: [
        { messageId: 'main', data: { serviceName: 'flash-messages' }, type: 'MemberExpression' },
      ],
    },

    // Legacy .extend class with decorators
    {
      filename: 'routes/index.js',
      code: `
      import Route from '@ember/routing/route';
      import { action } from '@ember/object';

      export default Route.extend({
        @action
        foo() {
          this.store.find('test');
        }
      });`,
      output: `
      import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
      import { action } from '@ember/object';

      export default Route.extend({
        store: service('store'),
@action
        foo() {
          this.store.find('test');
        }
      });`,
      errors: [{ messageId: 'main', data: { serviceName: 'store' }, type: 'MemberExpression' }],
    },
  ],
});
