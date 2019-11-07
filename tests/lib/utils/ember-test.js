'use strict';

const babelEslint = require('babel-eslint');
const emberUtils = require('../../../lib/utils/ember');
const { FauxContext } = require('../../helpers/faux-context');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
}

function getProperty(code) {
  return parse(code).right.properties[0];
}

describe('isModule', () => {
  let node;

  it("should check if it's a proper module", () => {
    node = parse('Ember.test()');
    expect(emberUtils.isModule(node, 'test')).toBeTruthy();

    node = parse('Ember.Component()');
    expect(emberUtils.isModule(node, 'Component')).toBeTruthy();

    node = parse('DS.test()');
    expect(emberUtils.isModule(node, 'test', 'DS')).toBeTruthy();

    node = parse('DS.Model()');
    expect(emberUtils.isModule(node, 'Model', 'DS')).toBeTruthy();
  });
});

describe('isDSModel', () => {
  it("should check if it's a DS Model", () => {
    const node = parse('DS.Model()');

    expect(emberUtils.isDSModel(node)).toBeTruthy();
  });

  describe("should check if it's a DS Model even if it uses custom name", () => {
    it("it shouldn't detect Model when no file path is provided", () => {
      const node = parse('CustomModel.extend()');
      expect(emberUtils.isDSModel(node)).toBeFalsy();
    });

    it('it should detect Model when file path is provided', () => {
      const node = parse('CustomModel.extend()');
      const filePath = 'example-app/models/path/to/some-model.js';
      expect(emberUtils.isDSModel(node, filePath)).toBeTruthy();
    });
  });
});

describe('isModuleByFilePath', () => {
  it('should check if current file is a component', () => {
    const filePath = 'example-app/components/path/to/some-component.js';
    expect(emberUtils.isModuleByFilePath(filePath, 'component')).toBeTruthy();
  });

  it('should check if current file is a component in PODs structure', () => {
    const filePath = 'example-app/components/path/to/some-component/component.js';
    expect(emberUtils.isModuleByFilePath(filePath, 'component')).toBeTruthy();
  });

  it('should check if current file is a controller', () => {
    const filePath = 'example-app/controllers/path/to/some-feature.js';
    expect(emberUtils.isModuleByFilePath(filePath, 'controller')).toBeTruthy();
  });

  it('should check if current file is a controller in PODs structure', () => {
    const filePath = 'example-app/path/to/some-feature/controller.js';
    expect(emberUtils.isModuleByFilePath(filePath, 'controller')).toBeTruthy();
  });

  it('should check if current file is a route', () => {
    const filePath = 'example-app/routes/path/to/some-feature.js';
    expect(emberUtils.isModuleByFilePath(filePath, 'route')).toBeTruthy();
  });

  it('should check if current file is a route - PODs structure', () => {
    const filePath = 'example-app/routes/path/to/some-feature/route.js';
    expect(emberUtils.isModuleByFilePath(filePath, 'route')).toBeTruthy();
  });
});

describe('isTestFile', () => {
  it('detects test files', () => {
    const fileName = 'some-test.js';
    expect(emberUtils.isTestFile(fileName)).toBeTruthy();
  });

  it('does not detect other files', () => {
    expect(emberUtils.isTestFile('some-component.js')).toBeFalsy();
    expect(emberUtils.isTestFile('my-testing-component.js')).toBeFalsy();
    expect(emberUtils.isTestFile('router.js')).toBeFalsy();
    expect(emberUtils.isTestFile('my-test.html')).toBeFalsy();
  });
});

describe('isEmberCoreModule', () => {
  it('should check if current file is a component', () => {
    const context = new FauxContext(
      'CustomComponent.extend()',
      'example-app/components/path/to/some-component.js'
    );
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberCoreModule(context, node, 'Component')).toBeTruthy();
  });

  it('should check if current file is a component', () => {
    const context = new FauxContext(
      'Component.extend()',
      'example-app/some-twisted-path/some-component.js'
    );
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberCoreModule(context, node, 'Component')).toBeTruthy();
  });

  it('should check if current file is a controller', () => {
    const context = new FauxContext(
      'CustomController.extend()',
      'example-app/controllers/path/to/some-controller.js'
    );
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberCoreModule(context, node, 'Controller')).toBeTruthy();
  });

  it('should check if current file is a controller', () => {
    const context = new FauxContext(
      'Controller.extend()',
      'example-app/some-twisted-path/some-controller.js'
    );
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberCoreModule(context, node, 'Controller')).toBeTruthy();
  });

  it('should check if current file is a route', () => {
    const context = new FauxContext(
      'CustomRoute.extend()',
      'example-app/routes/path/to/some-route.js'
    );
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberCoreModule(context, node, 'Route')).toBeTruthy();
  });

  it('should check if current file is a route', () => {
    const context = new FauxContext(
      'Route.extend()',
      'example-app/some-twisted-path/some-route.js'
    );
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberCoreModule(context, node, 'Route')).toBeTruthy();
  });
});

describe('isEmberComponent', () => {
  describe("should check if it's an Ember Component", () => {
    it('it should detect Component when using Ember.Component', () => {
      const context = new FauxContext('Ember.Component.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberComponent(context, node)).toBeTruthy();
    });

    it('it should detect Component when using local module Component', () => {
      const context = new FauxContext('Component.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberComponent(context, node)).toBeTruthy();
    });

    it('should detect Component when using native classes', () => {
      const context = new FauxContext(`
        import Component from '@ember/component';
        class MyComponent extends Component {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberComponent(context, node)).toBeTruthy();
    });

    it('shouldnt detect Component when using native classes if the import path is incorrect', () => {
      const context = new FauxContext(`
        import Component from '@something-else/component';
        class MyComponent extends Component {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberComponent(context, node)).toBeFalsy();
    });
  });

  describe("should check if it's an Ember Component even if it uses custom name", () => {
    it("it shouldn't detect Component when no file path is provided", () => {
      const context = new FauxContext('CustomComponent.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberComponent(context, node)).toBeFalsy();
    });

    it('it should detect Component when file path is provided', () => {
      const context = new FauxContext(
        'CustomComponent.extend()',
        'example-app/components/path/to/some-component.js'
      );
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberComponent(context, node)).toBeTruthy();
    });

    it('should detect Component when using native classes if the import path is correct', () => {
      const context = new FauxContext(`
        import CustomComponent from '@ember/component';
        class MyComponent extends CustomComponent {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberComponent(context, node)).toBeTruthy();
    });
  });
});

describe('isEmberController', () => {
  describe("should check if it's an Ember Controller", () => {
    it('it should detect Controller when using Ember.Controller', () => {
      const context = new FauxContext('Ember.Controller.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberController(context, node)).toBeTruthy();
    });

    it('it should detect Controller when using local module Controller', () => {
      const context = new FauxContext('Controller.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberController(context, node)).toBeTruthy();
    });

    it('should detect Controller when using native classes', () => {
      const context = new FauxContext(`
        import Controller from '@ember/controller';
        class MyController extends Controller {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberController(context, node)).toBeTruthy();
    });

    it('shouldnt detect Controller when using native classes if the import path is incorrect', () => {
      const context = new FauxContext(`
        import Controller from '@something-else/controller';
        class MyController extends Controller {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberController(context, node)).toBeFalsy();
    });
  });

  describe("should check if it's an Ember Controller even if it uses custom name", () => {
    it("it shouldn't detect Controller when no file path is provided", () => {
      const context = new FauxContext('CustomController.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberController(context, node)).toBeFalsy();
    });

    it('it should detect Controller when file path is provided', () => {
      const context = new FauxContext(
        'CustomController.extend()',
        'example-app/controllers/path/to/some-feature.js'
      );
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberController(context, node)).toBeTruthy();
    });

    it('should detect Controller when using native classes if the import path is correct', () => {
      const context = new FauxContext(`
        import CustomController from '@ember/controller';
        class MyController extends CustomController {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberController(context, node)).toBeTruthy();
    });
  });
});

describe('isEmberRoute', () => {
  describe("should check if it's an Ember Route", () => {
    it('should detect Route when using Ember.Route', () => {
      const context = new FauxContext('Ember.Route.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberRoute(context, node)).toBeTruthy();
    });

    it('should detect Route when using local module Route', () => {
      const context = new FauxContext('Route.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberRoute(context, node)).toBeTruthy();
    });

    it('should detect Route when using native classes', () => {
      const context = new FauxContext(`
        import Route from '@ember/routing/route';
        class MyRoute extends Route {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberRoute(context, node)).toBeTruthy();
    });

    it('shouldnt detect Route when using native classes if the import path is incorrect', () => {
      const context = new FauxContext(`
        import Route from '@something-else/routing/route';
        class MyRoute extends Route {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberRoute(context, node)).toBeFalsy();
    });
  });

  describe("should check if it's an Ember Route even if it uses custom name", () => {
    it("it shouldn't detect Route when no file path is provided", () => {
      const context = new FauxContext('CustomRoute.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberRoute(context, node)).toBeFalsy();
    });

    it('it should detect Route when file path is provided', () => {
      const context = new FauxContext(
        'CustomRoute.extend()',
        'example-app/routes/path/to/some-feature.js'
      );
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberRoute(context, node)).toBeTruthy();
    });

    it('should detect Route when using native classes if the import path is correct', () => {
      const context = new FauxContext(`
        import CustomRoute from '@ember/routing/route';
        class MyRoute extends CustomRoute {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberRoute(context, node)).toBeTruthy();
    });
  });
});

describe('isEmberMixin', () => {
  describe("should check if it's an Ember Mixin", () => {
    it('should detect Mixin when using native classes', () => {
      const context = new FauxContext(`
        import Mixin from '@ember/object/mixin';
        class MyMixin extends Mixin {}
      `);

      const node = context.ast.body[1];
      expect(emberUtils.isEmberMixin(context, node)).toBeTruthy();
    });

    it('shouldnt detect Mixin when using native classes if the import path is incorrect', () => {
      const context = new FauxContext(`
        import Mixin from '@something-else/object/mixin';
        class MyMixin extends Mixin {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberMixin(context, node)).toBeFalsy();
    });
  });

  describe("should check if it's an Ember Mixin even if it uses custom name", () => {
    it('should detect Mixin when using native classes if the import path is correct', () => {
      const context = new FauxContext(`
        import CustomMixin from '@ember/object/mixin';
        class MyMixin extends CustomMixin {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberMixin(context, node)).toBeTruthy();
    });
  });
});

describe('isEmberService', () => {
  describe("should check if it's an Ember Service", () => {
    it('should detect Service when using Ember.Service', () => {
      const context = new FauxContext('Ember.Service.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberService(context, node)).toBeTruthy();
    });

    it('should detect Service when using local module Service', () => {
      const context = new FauxContext('Service.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberService(context, node)).toBeTruthy();
    });

    it('should detect Service when using native classes', () => {
      const context = new FauxContext(`
        import Service from '@ember/service';
        class MyService extends Service {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberService(context, node)).toBeTruthy();
    });

    it('shouldnt detect Service when using native classes if the import path is incorrect', () => {
      const context = new FauxContext(`
        import Service from '@something-else/service';
        class MyService extends Service {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberService(context, node)).toBeFalsy();
    });
  });

  describe("should check if it's an Ember Service even if it uses custom name", () => {
    it("shouldn't detect Service when no file path is provided", () => {
      const context = new FauxContext('CustomService.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberService(context, node)).toBeFalsy();
    });

    it('it should detect Service when file path is provided', () => {
      const context = new FauxContext(
        'CustomService.extend()',
        'example-app/services/path/to/some-feature.js'
      );
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberService(context, node)).toBeTruthy();
    });

    it('should detect Service when using native classes if the import path is correct', () => {
      const context = new FauxContext(`
        import CustomService from '@ember/service';
        class MyService extends CustomService {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isEmberService(context, node)).toBeTruthy();
    });
  });
});

describe('isInjectedServiceProp', () => {
  describe('classic classes', () => {
    it("should check if it's an injected service prop with renamed import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          currentUser: service()
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node)).toBeTruthy();
    });

    it("should check if it's an injected service prop with full import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          currentUser: Ember.inject.service()
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node)).toBeTruthy();
    });

    it("should check if it's an injected service prop with destructured import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          currentUser: inject()
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node)).toBeTruthy();
    });

    it("should check that it's not an injected service prop", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          currentUser: otherFunction()
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node)).toBeFalsy();
    });

    it("should check that it's not an injected service prop when 'service' is not a function", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          currentUser: service.otherFunction()
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node)).toBeFalsy();
    });
  });

  describe('native classes', () => {
    it("should check if it's an injected service prop when using renamed import", () => {
      const context = new FauxContext(`
        class MyController extends Controller {
          @service currentUser;
        }
      `);
      const node = context.ast.body[0].body.body[0];
      expect(emberUtils.isInjectedServiceProp(node)).toBeTruthy();
    });

    it("should check if it's an injected service prop when using decorator", () => {
      const context = new FauxContext(`
        class MyController extends Controller {
          @inject currentUser;
        }
      `);
      const node = context.ast.body[0].body.body[0];
      expect(emberUtils.isInjectedServiceProp(node)).toBeTruthy();
    });

    it("should check that it's not an injected service prop when using another decorator", () => {
      const context = new FauxContext(`
        class MyController extends Controller {
          @otherDecorator currentUser;
        }
      `);
      const node = context.ast.body[0].body.body[0];
      expect(emberUtils.isInjectedServiceProp(node)).toBeFalsy();
    });
  });
});

describe('isInjectedControllerProp', () => {
  describe('classic classes', () => {
    it("should check if it's an injected controller prop with destructed import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          application: controller(),
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedControllerProp(node)).toBeTruthy();
    });

    it("should check if it's an injected controller prop with full import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          application: Ember.inject.controller(),
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedControllerProp(node)).toBeTruthy();
    });
  });

  describe('native classes', () => {
    it("should check if it's an injected controller prop with decorator", () => {
      const context = new FauxContext(`
        class MyController extends Controller {
          @controller application;
        }
      `);
      const node = context.ast.body[0].body.body[0];
      expect(emberUtils.isInjectedControllerProp(node)).toBeTruthy();
    });

    it("should check that it's not an injected controller prop", () => {
      const context = new FauxContext(`
        class MyController extends Controller {
          @otherDecorator application;
        }
      `);
      const node = context.ast.body[0].body.body[0];
      expect(emberUtils.isInjectedControllerProp(node)).toBeFalsy();
    });
  });
});

describe('isComputedProp', () => {
  let node;

  it("should check if it's an computed prop", () => {
    node = parse('computed()');
    expect(emberUtils.isComputedProp(node)).toBeTruthy();

    node = parse('Ember.computed()');
    expect(emberUtils.isComputedProp(node)).toBeTruthy();
  });

  it('should detect whitelisted computed props with MemberExpressions', () => {
    ['volatile', 'meta', 'readOnly', 'property'].forEach(prop => {
      node = parse(`computed().${prop}()`);
      expect(emberUtils.isComputedProp(node)).toBeTruthy();

      node = parse(`Ember.computed().${prop}()`);
      expect(emberUtils.isComputedProp(node)).toBeTruthy();
    });
  });

  it("shouldn't allow other MemberExpressions", () => {
    node = parse('computed().foo()');
    expect(emberUtils.isComputedProp(node)).not.toBeTruthy();

    node = parse('Ember.computed().foo()');
    expect(emberUtils.isComputedProp(node)).not.toBeTruthy();
  });
});

describe('isObserverProp', () => {
  describe('classic classes', () => {
    it("should check if it's an observer prop using destructured import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          someObserver: observer(),
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isObserverProp(node)).toBeTruthy();
    });

    it("should check if it's an observer prop with full import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          someObserver: Ember.observer(),
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isObserverProp(node)).toBeTruthy();
    });

    it("should check if it's an observer prop with multi-line observer", () => {
      const context = new FauxContext(`
        export default Component.extend({
          levelOfHappiness: observer("attitude", "health", () => {
          }),
          vehicle: alias("car")
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isObserverProp(node)).toBeTruthy();
    });
  });

  describe('native classes', () => {
    it("should check if it's an observer prop using decorator", () => {
      const context = new FauxContext(`
        class MyController extends Controller {
          @observer someObserver;
        }
      `);
      const node = context.ast.body[0].body.body[0];
      expect(emberUtils.isObserverProp(node)).toBeTruthy();
    });

    it("should check if it's an observer prop using decorator with arg", () => {
      const context = new FauxContext(`
        class MyController extends Controller {
          @observer("someArg") someObserver() {};
        }
      `);
      const node = context.ast.body[0].body.body[0];
      expect(emberUtils.isObserverProp(node)).toBeTruthy();
    });

    it("should check that it's not an observer prop", () => {
      const context = new FauxContext(`
        class MyController extends Controller {
          @otherDecorator someObserver;
        }
      `);
      const node = context.ast.body[0].body.body[0];
      expect(emberUtils.isObserverProp(node)).toBeFalsy();
    });
  });
});

describe('isArrayProp', () => {
  let node;

  it('should be an array', () => {
    node = getProperty('test = { test: new Ember.A() }');
    expect(emberUtils.isArrayProp(node)).toBeTruthy();

    node = getProperty('test = { test: new A() }');
    expect(emberUtils.isArrayProp(node)).toBeTruthy();

    node = getProperty('test = { test: [] }');
    expect(emberUtils.isArrayProp(node)).toBeTruthy();
  });
});

describe('isObjectProp', () => {
  let node;

  it('should be an object', () => {
    node = getProperty('test = { test: new Ember.Object() }');
    expect(emberUtils.isObjectProp(node)).toBeTruthy();

    node = getProperty('test = { test: new Object() }');
    expect(emberUtils.isObjectProp(node)).toBeTruthy();

    node = getProperty('test = { test: {} }');
    expect(emberUtils.isObjectProp(node)).toBeTruthy();
  });
});

describe('isCustomProp', () => {
  let node;

  it('should be custom property', () => {
    node = getProperty("test = { test: 'someLiteral' }");
    expect(emberUtils.isCustomProp(node)).toBeTruthy();

    node = getProperty('test = { test: someIdentifier }');
    expect(emberUtils.isCustomProp(node)).toBeTruthy();

    node = getProperty('test = { test: [] }');
    expect(emberUtils.isCustomProp(node)).toBeTruthy();

    node = getProperty('test = { test: {} }');
    expect(emberUtils.isCustomProp(node)).toBeTruthy();

    node = getProperty("test = { test: foo ? 'bar': 'baz' }");
    expect(emberUtils.isCustomProp(node)).toBeTruthy();

    node = getProperty('test = { test: hbs`lorem ipsum` }');
    expect(emberUtils.isCustomProp(node)).toBeTruthy();

    node = getProperty('test = { actions: {} }');
    expect(emberUtils.isCustomProp(node)).toBeFalsy();

    node = getProperty('test = { test: -1 }');
    expect(emberUtils.isCustomProp(node)).toBeTruthy();
  });
});

describe('isRouteLifecycleHook', () => {
  let node;

  it('should be a route lifecycle hook', () => {
    node = getProperty('test = { beforeModel() {} }');
    expect(emberUtils.isRouteLifecycleHook(node)).toBeTruthy();

    node = getProperty('test = { model() {} }');
    expect(emberUtils.isRouteLifecycleHook(node)).toBeTruthy();

    node = getProperty('test = { afterModel() {} }');
    expect(emberUtils.isRouteLifecycleHook(node)).toBeTruthy();

    node = getProperty('test = { serialize() {} }');
    expect(emberUtils.isRouteLifecycleHook(node)).toBeTruthy();

    node = getProperty('test = { redirect() {} }');
    expect(emberUtils.isRouteLifecycleHook(node)).toBeTruthy();

    node = getProperty('test = { activate() {} }');
    expect(emberUtils.isRouteLifecycleHook(node)).toBeTruthy();

    node = getProperty('test = { setupController() {} }');
    expect(emberUtils.isRouteLifecycleHook(node)).toBeTruthy();

    node = getProperty('test = { renderTemplate() {} }');
    expect(emberUtils.isRouteLifecycleHook(node)).toBeTruthy();

    node = getProperty('test = { resetController() {} }');
    expect(emberUtils.isRouteLifecycleHook(node)).toBeTruthy();

    node = getProperty('test = { deactivate() {} }');
    expect(emberUtils.isRouteLifecycleHook(node)).toBeTruthy();
  });
});

describe('isActionsProp', () => {
  const node = getProperty('test = { actions: {} }');

  it('should be actions prop', () => {
    expect(emberUtils.isActionsProp(node)).toBeTruthy();
  });
});

describe('getModuleProperties', () => {
  const module = parse(`
    Ember.Component.extend(SomeMixin, {
      asd: 'qwe',
      actions: {},
      someMethod() {}
    })
  `);

  it("returns module's properties", () => {
    const properties = emberUtils.getModuleProperties(module);
    expect(properties).toHaveLength(3);
  });
});

describe('isSingleLineFn', () => {
  const property = getProperty(`test = {
    test: computed.or('asd', 'qwe')
  }`);

  it('should check if given function has one line', () => {
    expect(emberUtils.isSingleLineFn(property)).toBeTruthy();

    let context = new FauxContext(`
      class MyController extends Controller {
        @computed("someProp") someFunction() {}
      }
    `);
    let node = context.ast.body[0].body.body[0];
    expect(emberUtils.isSingleLineFn(node)).toBeTruthy();

    context = new FauxContext(`
      class MyController extends Controller {
        @computed("someProp") someFunction() {
          console.log("hello");
        }
      }
    `);
    node = context.ast.body[0].body.body[0];
    expect(emberUtils.isSingleLineFn(node)).toBeFalsy();
  });
});

describe('isMultiLineFn', () => {
  const property = getProperty(`test = {
    test: computed('asd', function() {
      return get(this, 'asd') + 'test';
    })
  }`);

  it('should check if given function has more than one line', () => {
    expect(emberUtils.isMultiLineFn(property)).toBeTruthy();

    let context = new FauxContext(`
      class MyController extends Controller {
        @computed("someProp") someFunction() {
          console.log("hello");
        }
      }
    `);
    let node = context.ast.body[0].body.body[0];
    expect(emberUtils.isMultiLineFn(node)).toBeTruthy();

    context = new FauxContext(`
      class MyController extends Controller {
        @computed("someProp") someFunction() {}
      }
    `);
    node = context.ast.body[0].body.body[0];
    expect(emberUtils.isMultiLineFn(node)).toBeFalsy();
  });
});

describe('isFunctionExpression', () => {
  let property;

  it('should check if given property is a function expression', () => {
    property = getProperty(`test = {
      test: someFn(function() {})
    }`);
    expect(emberUtils.isFunctionExpression(property.value)).toBeTruthy();

    property = getProperty(`test = {
      test() {}
    }`);
    expect(emberUtils.isFunctionExpression(property.value)).toBeTruthy();

    property = getProperty(`test = {
      test: function() {}
    }`);
    expect(emberUtils.isFunctionExpression(property.value)).toBeTruthy();

    property = getProperty(`test = {
      test: () => {}
    }`);
    expect(emberUtils.isFunctionExpression(property.value)).toBeTruthy();
  });
});

describe('isRelation', () => {
  let property;

  it('should detect hasMany relation', () => {
    property = getProperty(`test = {
      test: hasMany()
    }`);
    expect(emberUtils.isRelation(property)).toBeTruthy();

    property = getProperty(`test = {
      test: DS.hasMany()
    }`);
    expect(emberUtils.isRelation(property)).toBeTruthy();
  });

  it('should detect belongsTo relation', () => {
    property = getProperty(`test = {
      test: belongsTo()
    }`);
    expect(emberUtils.isRelation(property)).toBeTruthy();

    property = getProperty(`test = {
      test: DS.belongsTo()
    }`);
    expect(emberUtils.isRelation(property)).toBeTruthy();
  });
});

describe('parseDependentKeys', () => {
  it('should parse dependent keys from callexpression', () => {
    const node = parse("computed('model.{foo,bar}', 'model.bar')");
    expect(emberUtils.parseDependentKeys(node)).toEqual(['model.foo', 'model.bar', 'model.bar']);
  });

  it('should work when no dependent keys present', () => {
    const node = parse('computed(function() {})');
    expect(emberUtils.parseDependentKeys(node)).toEqual([]);
  });

  it('should handle dependent keys and function arguments', () => {
    const node = parse("computed('model.{foo,bar}', 'model.bar', function() {})");
    expect(emberUtils.parseDependentKeys(node)).toEqual(['model.foo', 'model.bar', 'model.bar']);
  });

  it('should handle dependent keys and function arguments in MemberExpression', () => {
    const node = parse(`
      computed('model.{foo,bar}', 'model.bar', function() {
      }).volatile();
    `);
    expect(emberUtils.parseDependentKeys(node)).toEqual(['model.foo', 'model.bar', 'model.bar']);
  });
});

describe('unwrapBraceExpressions', () => {
  it('should unwrap simple dependent keys', () => {
    expect(emberUtils.unwrapBraceExpressions(['model.foo', 'model.bar'])).toEqual([
      'model.foo',
      'model.bar',
    ]);
  });

  it('should unwrap dependent keys with braces', () => {
    expect(emberUtils.unwrapBraceExpressions(['model.{foo,bar}', 'model.bar'])).toEqual([
      'model.foo',
      'model.bar',
      'model.bar',
    ]);
  });

  it('should unwrap more complex dependent keys', () => {
    expect(
      emberUtils.unwrapBraceExpressions(['model.{foo,bar}', 'model.bar', 'data.{foo,baz,qux}'])
    ).toEqual(['model.foo', 'model.bar', 'model.bar', 'data.foo', 'data.baz', 'data.qux']);
  });

  it('should unwrap multi-level keys', () => {
    expect(emberUtils.unwrapBraceExpressions(['model.bar.{foo,qux}', 'model.bar.baz'])).toEqual([
      'model.bar.foo',
      'model.bar.qux',
      'model.bar.baz',
    ]);
  });

  it('should unwrap @each with extensions', () => {
    expect(
      emberUtils.unwrapBraceExpressions(['collection.@each.{foo,bar}', 'collection.@each.qux'])
    ).toEqual(['collection.@each.foo', 'collection.@each.bar', 'collection.@each.qux']);
  });

  it('should unwrap complicated mixed dependent keys', () => {
    expect(emberUtils.unwrapBraceExpressions(['a.b.c.{d.@each.qwe.zxc,f,g.[]}'])).toEqual([
      'a.b.c.d.@each.qwe.zxc',
      'a.b.c.f',
      'a.b.c.g.[]',
    ]);
  });

  it('should unwrap complicated mixed repeated dependent keys', () => {
    expect(emberUtils.unwrapBraceExpressions(['a.b.{d.@each.qux,f,d.@each.foo}'])).toEqual([
      'a.b.d.@each.qux',
      'a.b.f',
      'a.b.d.@each.foo',
    ]);
  });
});

describe('hasDuplicateDependentKeys', () => {
  it('reports duplicate dependent keys in computed calls', () => {
    let node = parse("computed('model.{foo,bar}', 'model.bar')");
    expect(emberUtils.hasDuplicateDependentKeys(node)).toBeTruthy();
    node = parse("Ember.computed('model.{foo,bar}', 'model.bar')");
    expect(emberUtils.hasDuplicateDependentKeys(node)).toBeTruthy();
  });

  it('ignores not repeated dependentKeys', () => {
    let node = parse("computed('model.{foo,bar}', 'model.qux')");
    expect(emberUtils.hasDuplicateDependentKeys(node)).not.toBeTruthy();
    node = parse("Ember.computed('model.{foo,bar}', 'model.qux')");
    expect(emberUtils.hasDuplicateDependentKeys(node)).not.toBeTruthy();
    node = parse("computed('model.{foo,bar}', 'model.qux').volatile()");
    expect(emberUtils.hasDuplicateDependentKeys(node)).not.toBeTruthy();
  });

  it('ignores non-computed calls', () => {
    const node = parse("foo('model.{foo,bar}', 'model.bar')");
    expect(emberUtils.hasDuplicateDependentKeys(node)).not.toBeTruthy();
  });

  it('reports duplicate dependent keys in computed calls with MemberExp', () => {
    let node = parse("Ember.computed('model.{foo,bar}', 'model.bar').volatile()");
    expect(emberUtils.hasDuplicateDependentKeys(node)).toBeTruthy();
    node = parse("computed('model.{foo,bar}', 'model.bar').volatile()");
    expect(emberUtils.hasDuplicateDependentKeys(node)).toBeTruthy();
  });
});

describe('getEmberImportAliasName', () => {
  it('should get the proper name of default import', () => {
    const node = babelEslint.parse("import foo from 'ember'").body[0];
    expect(emberUtils.getEmberImportAliasName(node)).toEqual('foo');
  });
});
