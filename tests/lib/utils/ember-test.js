'use strict';

const { parse: babelESLintParse, parseForESLint } = require('../../helpers/babel-eslint-parser');
const emberUtils = require('../../../lib/utils/ember');
const { FauxContext } = require('../../helpers/faux-context');

function parse(code) {
  return babelESLintParse(code).body[0].expression;
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
    it("shouldn't detect Model when no file path is provided", () => {
      const node = parse('CustomModel.extend()');
      expect(emberUtils.isDSModel(node)).toBeFalsy();
    });

    it('should detect Model when file path is provided', () => {
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

  it('should handle TypeScript files', () => {
    const filePath = 'example-app/components/path/to/some-component.ts';
    expect(emberUtils.isModuleByFilePath(filePath, 'component')).toBeTruthy();
  });

  // Avoid false positives:
  it('should not detect a component in a folder named `fake-components`', () => {
    const filePath = 'example-app/fake-components/path/to/file.js';
    expect(emberUtils.isModuleByFilePath(filePath, 'component')).toBeFalsy();
  });

  it('should not detect a component with a file named `components`', () => {
    const filePath = 'example-app/some-folder/path/to/components';
    expect(emberUtils.isModuleByFilePath(filePath, 'component')).toBeFalsy();
  });

  it('should not detect a component with a directory named `component.js`', () => {
    const filePath = 'example-app/component.js/path/to/file.js';
    expect(emberUtils.isModuleByFilePath(filePath, 'component')).toBeFalsy();
  });

  it('should not detect a component with a directory named `component.ts`', () => {
    const filePath = 'example-app/component.ts/path/to/file.js';
    expect(emberUtils.isModuleByFilePath(filePath, 'component')).toBeFalsy();
  });
});

describe('isMirageDirectory', () => {
  it('detects the mirage directory', () => {
    expect(emberUtils.isMirageDirectory('example-app/mirage/config.js')).toBeTruthy();
    expect(emberUtils.isMirageDirectory('example-app/mirage/scenarios/foo.js')).toBeTruthy();
  });

  it('does not detect other directories', () => {
    expect(emberUtils.isMirageDirectory('example-app/app/app.js')).toBeFalsy();
    expect(emberUtils.isMirageDirectory('example-app/tests/test.js')).toBeFalsy();
    expect(emberUtils.isMirageDirectory('example-addon/addon/addon.js')).toBeFalsy();
  });
});

describe('isMirageConfig', () => {
  it('detects the mirage config file', () => {
    expect(emberUtils.isMirageConfig('example-app/mirage/config.js')).toBeTruthy();
  });

  it('does not detect other directories', () => {
    expect(emberUtils.isMirageConfig('example-app/app/app.js')).toBeFalsy();
    expect(emberUtils.isMirageConfig('example-app/tests/test.js')).toBeFalsy();
    expect(emberUtils.isMirageConfig('example-addon/addon/addon.js')).toBeFalsy();
    expect(emberUtils.isMirageConfig('example-app/mirage/scenarios/foo.js')).toBeFalsy();
  });
});

describe('isTestFile', () => {
  it('detects test files', () => {
    expect(emberUtils.isTestFile('some-test.js')).toBeTruthy();
    expect(emberUtils.isTestFile('some-test.ts')).toBeTruthy();
  });

  it('does not detect other files', () => {
    expect(emberUtils.isTestFile('some-component.js')).toBeFalsy();
    expect(emberUtils.isTestFile('my-testing-component.js')).toBeFalsy();
    expect(emberUtils.isTestFile('router.js')).toBeFalsy();
    expect(emberUtils.isTestFile('my-test.html')).toBeFalsy();
  });
});

describe('isEmberCoreModule', () => {
  it('should check if current file is a component (custom)', () => {
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

  it('should check if current file is a controller (custom)', () => {
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

  it('should check if current file is a route (custom)', () => {
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

  it('should handle native class with mixin', () => {
    const context = new FauxContext(
      "import Route from '@ember/routing/route'; class MyRoute extends Route.extend(SomeMixin) {}",
      'example-app/routes/path/to/some-route.js'
    );
    const node = context.ast.body[1];
    expect(emberUtils.isEmberCoreModule(context, node, 'Route')).toBeTruthy();
  });

  it('should check if current file is a route with native class', () => {
    const context = new FauxContext(
      "import Route from '@ember/routing/route'; class MyRoute extends Route {}",
      'example-app/some-twisted-path/some-route.js'
    );
    const node = context.ast.body[1];
    expect(emberUtils.isEmberCoreModule(context, node, 'Route')).toBeTruthy();
  });

  it('should check core modules from ClassExpressions', () => {
    const context = new FauxContext(
      `import Route from '@ember/routing/route';

      (class MyRoute extends Route {})`,
      'example-app/some-twisted-path/some-route.js'
    );
    const node = context.ast.body[1].expression;
    expect(emberUtils.isEmberCoreModule(context, node, 'Route')).toBeTruthy();
  });

  it('ignores a native class with a non-identifier super class', () => {
    const context = new FauxContext(
      'class MyRoute extends this.ContainerObject {}',
      'example-app/some-twisted-path/some-route.js'
    );
    const node = context.ast.body[0];
    expect(emberUtils.isEmberCoreModule(context, node, 'Route')).toBeFalsy();
  });

  it('throws when called on wrong type of node', () => {
    const context = new FauxContext('const x = 123;');
    const node = context.ast.body[0];
    expect(() => emberUtils.isEmberCoreModule(context, node, 'Route')).toThrow(
      'Function should only be called on a `CallExpression` (classic class) or `ClassDeclaration`/`ClassExpression` (native class)'
    );
  });
});

describe('isEmberComponent', () => {
  describe("should check if it's an Ember Component", () => {
    it('should detect Component when using Ember.Component', () => {
      const context = new FauxContext('Ember.Component.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberComponent(context, node)).toBeTruthy();
    });

    it('should detect Component when using local module Component', () => {
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
    it("shouldn't detect Component when no file path is provided", () => {
      const context = new FauxContext('CustomComponent.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberComponent(context, node)).toBeFalsy();
    });

    it('should detect Component when file path is provided', () => {
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

describe('isGlimerComponent', () => {
  describe("should check if it's a Glimmer Component", () => {
    it('should detect Component when using native classes', () => {
      const context = new FauxContext(`
        import Component from '@glimmer/component';
        class MyComponent extends Component {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isGlimmerComponent(context, node)).toBeTruthy();
    });

    it('shouldnt detect Component when using native classes if the import path is incorrect', () => {
      const context = new FauxContext(`
        import Component from '@something-else/component';
        class MyComponent extends Component {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isGlimmerComponent(context, node)).toBeFalsy();
    });

    it('shouldnt confuse Glimmer Components with Ember Components', () => {
      const context = new FauxContext(`
        import Component from '@ember/component';
        class MyComponent extends Component {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isGlimmerComponent(context, node)).toBeFalsy();
    });
  });

  describe("should check if it's a Glimmer Component even if it uses a custom name", () => {
    it('should detect Component when using native classes if the import path is correct', () => {
      const context = new FauxContext(`
        import CustomComponent from '@glimmer/component';
        class MyComponent extends CustomComponent {}
      `);
      const node = context.ast.body[1];
      expect(emberUtils.isGlimmerComponent(context, node)).toBeTruthy();
    });
  });
});

describe('isEmberController', () => {
  describe("should check if it's an Ember Controller", () => {
    it('should detect Controller when using Ember.Controller', () => {
      const context = new FauxContext('Ember.Controller.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberController(context, node)).toBeTruthy();
    });

    it('should detect Controller when using local module Controller', () => {
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
    it("shouldn't detect Controller when no file path is provided", () => {
      const context = new FauxContext('CustomController.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberController(context, node)).toBeFalsy();
    });

    it('should detect Controller when file path is provided', () => {
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
    it("shouldn't detect Route when no file path is provided", () => {
      const context = new FauxContext('CustomRoute.extend()');
      const node = context.ast.body[0].expression;
      expect(emberUtils.isEmberRoute(context, node)).toBeFalsy();
    });

    it('should detect Route when file path is provided', () => {
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

    it('should detect Service when file path is provided', () => {
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

describe('isExtendObject', () => {
  it('should detect using extend function name', () => {
    const node = parse('foo.extend()');
    expect(emberUtils.isExtendObject(node)).toBeTruthy();
  });

  it('should detect using extend string name', () => {
    const node = parse('foo["extend"]()');
    expect(emberUtils.isExtendObject(node)).toBeTruthy();
  });

  it('should detect using nested object', () => {
    const node = parse('foo.bar.extend()');
    expect(emberUtils.isExtendObject(node)).toBeTruthy();
  });

  it('should not detect a potential jQuery usage with `$`', () => {
    const node = parse('$.extend()');
    expect(emberUtils.isExtendObject(node)).toBeFalsy();
  });

  it('should not detect a potential jQuery usage with `jQuery`', () => {
    const node = parse('jQuery.extend()');
    expect(emberUtils.isExtendObject(node)).toBeFalsy();
  });

  it('should not detect a potential lodash usage', () => {
    expect(emberUtils.isExtendObject(parse('_.extend()'))).toBeFalsy();
    expect(emberUtils.isExtendObject(parse('lodash.extend()'))).toBeFalsy();
  });

  it('should not detect with non-extend name', () => {
    const node = parse('foo.notExtend()');
    expect(emberUtils.isExtendObject(node)).toBeFalsy();
  });

  it('should not detect with no object', () => {
    const node = parse('extend()');
    expect(emberUtils.isExtendObject(node)).toBeFalsy();
  });

  it('should not detect with wrong function', () => {
    const node = parse('extend.foo()');
    expect(emberUtils.isExtendObject(node)).toBeFalsy();
  });
});

describe('isEmberArrayProxy', () => {
  it('should detect using old module style', () => {
    const context = new FauxContext('Ember.ArrayProxy.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberArrayProxy(context, node)).toBeTruthy();
  });

  it('should not detect using old module style with wrong name', () => {
    const context = new FauxContext('Ember.SomethingElse.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberArrayProxy(context, node)).toBeFalsy();
  });

  it('should detect when using local module', () => {
    const context = new FauxContext('ArrayProxy.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberArrayProxy(context, node)).toBeTruthy();
  });

  it('should not detect when using local module with wrong name', () => {
    const context = new FauxContext('SomethingElse.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberArrayProxy(context, node)).toBeFalsy();
  });

  it('should detect when using native classes', () => {
    const context = new FauxContext(`
      import ArrayProxy from '@ember/array/proxy';
      class MyProxy extends ArrayProxy {}
    `);
    const node = context.ast.body[1];
    expect(emberUtils.isEmberArrayProxy(context, node)).toBeTruthy();
  });

  it('should detect when using native classes with other name but correct import path', () => {
    const context = new FauxContext(`
      import OtherName from '@ember/array/proxy';
      class MyProxy extends OtherName {}
    `);
    const node = context.ast.body[1];
    expect(emberUtils.isEmberArrayProxy(context, node)).toBeTruthy();
  });

  it('should not detect when using native classes if the import path is incorrect', () => {
    const context = new FauxContext(`
      import ArrayProxy from '@something-else/service';
      class MyProxy extends ArrayProxy {}
    `);
    const node = context.ast.body[1];
    expect(emberUtils.isEmberArrayProxy(context, node)).toBeFalsy();
  });
});

describe('isEmberObjectProxy', () => {
  it('should detect using old module style', () => {
    const context = new FauxContext('Ember.ObjectProxy.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberObjectProxy(context, node)).toBeTruthy();
  });

  it('should not detect using old module style with wrong name', () => {
    const context = new FauxContext('Ember.SomethingElse.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberObjectProxy(context, node)).toBeFalsy();
  });

  it('should detect when using local module', () => {
    const context = new FauxContext('ObjectProxy.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberObjectProxy(context, node)).toBeTruthy();
  });

  it('should not detect when using local module with wrong name', () => {
    const context = new FauxContext('SomethingElse.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberObjectProxy(context, node)).toBeFalsy();
  });

  it('should detect when using native classes', () => {
    const context = new FauxContext(`
      import ObjectProxy from '@ember/object/proxy';
      class MyProxy extends ObjectProxy {}
    `);
    const node = context.ast.body[1];
    expect(emberUtils.isEmberObjectProxy(context, node)).toBeTruthy();
  });

  it('should detect when using native classes with other name but correct import path', () => {
    const context = new FauxContext(`
      import OtherName from '@ember/object/proxy';
      class MyProxy extends OtherName {}
    `);
    const node = context.ast.body[1];
    expect(emberUtils.isEmberObjectProxy(context, node)).toBeTruthy();
  });

  it('should not detect when using native classes if the import path is incorrect', () => {
    const context = new FauxContext(`
      import ObjectProxy from '@something-else/service';
      class MyProxy extends ObjectProxy {}
    `);
    const node = context.ast.body[1];
    expect(emberUtils.isEmberObjectProxy(context, node)).toBeFalsy();
  });
});

describe('isEmberObject', () => {
  it('should detect when using local module', () => {
    const context = new FauxContext('EmberObject.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberObject(context, node)).toBeTruthy();
  });

  it('should not detect when using local module with wrong name', () => {
    const context = new FauxContext('SomethingElse.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberObject(context, node)).toBeFalsy();
  });

  it('should detect when using native classes', () => {
    const context = new FauxContext(`
      import EmberObject from '@ember/object';
      class MyObject extends EmberObject {}
    `);

    const node = context.ast.body[1];
    expect(emberUtils.isEmberObject(context, node)).toBeTruthy();
  });

  it('should not detect when using native classes if the import path is incorrect', () => {
    const context = new FauxContext(`
      import EmberObject from '@something-else/object';
      class MyObject extends EmberObject {}
    `);
    const node = context.ast.body[1];
    expect(emberUtils.isEmberObject(context, node)).toBeFalsy();
  });
});

describe('isEmberHelper', () => {
  it('should detect when using local module', () => {
    const context = new FauxContext('Helper.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberHelper(context, node)).toBeTruthy();
  });

  it('should not detect when using local module with wrong name', () => {
    const context = new FauxContext('SomethingElse.extend()');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberHelper(context, node)).toBeFalsy();
  });

  it('should detect when using native classes', () => {
    const context = new FauxContext(`
      import Helper from '@ember/component/helper';
      class MyHelper extends Helper {}
    `);

    const node = context.ast.body[1];
    expect(emberUtils.isEmberHelper(context, node)).toBeTruthy();
  });

  it('should not detect when using native classes if the import path is incorrect', () => {
    const context = new FauxContext(`
      import Helper from '@something-else/component/helper';
      class MyHelper extends Helper {}
    `);
    const node = context.ast.body[1];
    expect(emberUtils.isEmberHelper(context, node)).toBeFalsy();
  });
});

describe('isEmberProxy', () => {
  it('should detect ArrayProxy example', () => {
    const context = new FauxContext(`
      import ArrayProxy from '@ember/array/proxy';
      class MyProxy extends ArrayProxy {}
    `);
    const node = context.ast.body[1];
    expect(emberUtils.isEmberProxy(context, node)).toBeTruthy();
  });

  it('should detect ObjectProxy example', () => {
    const context = new FauxContext(`
      import ObjectProxy from '@ember/object/proxy';
      class MyProxy extends ObjectProxy {}
    `);
    const node = context.ast.body[1];
    expect(emberUtils.isEmberProxy(context, node)).toBeTruthy();
  });

  it('should detect ObjectProxy with mixin', () => {
    const context = new FauxContext(`
      import ObjectProxy from '@ember/object/proxy';
      class MyProxy extends ObjectProxy.extend(SomeMixin) {}
    `);
    const node = context.ast.body[1];
    expect(emberUtils.isEmberProxy(context, node)).toBeTruthy();
  });

  it('should detect ObjectProxy with classic class', () => {
    const context = new FauxContext(`
      import ObjectProxy from '@ember/object/proxy';
      ObjectProxy.extend({});
    `);
    const node = context.ast.body[1].expression;
    expect(emberUtils.isEmberProxy(context, node)).toBeTruthy();
  });

  it('should not detect random code', () => {
    const context = new FauxContext('someFunctionCall();');
    const node = context.ast.body[0].expression;
    expect(emberUtils.isEmberProxy(context, node)).toBeFalsy();
  });
});

describe('isInjectedServiceProp', () => {
  describe('classic classes', () => {
    it("should check if it's an injected service prop with renamed import", () => {
      const context = new FauxContext(`
        import {inject as service} from '@ember/service';
        export default Controller.extend({
          currentUser: service()
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node, undefined, importName)).toBeTruthy();
    });

    it("should check if it's an injected service prop with full import", () => {
      const context = new FauxContext(`
        import Ember from 'ember';
        export default Controller.extend({
          currentUser: Ember.inject.service()
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node, importName, undefined)).toBeTruthy();
    });

    it("should check if it's an injected service prop with destructured import", () => {
      const context = new FauxContext(`
        import {inject} from '@ember/service';
        export default Controller.extend({
          currentUser: inject()
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node, undefined, importName)).toBeTruthy();
    });

    it("should check that it's not an injected service prop with foo.service", () => {
      const context = new FauxContext(`
        import {inject as service} from '@ember/service';
        export default Controller.extend({
          currentUser: foo.service()
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node, undefined, importName)).toBeFalsy();
    });

    it("should check that it's not an injected service prop with foo.service.inject", () => {
      const context = new FauxContext(`
        import {inject as service} from '@ember/service';
        export default Controller.extend({
          currentUser: foo.service.inject()
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node, undefined, importName)).toBeFalsy();
    });

    it("should check that it's not an injected service prop without the renamed import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          currentUser: service()
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node)).toBeFalsy();
    });

    it("should check that it's not an injected service prop without the full import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          currentUser: Ember.inject.service()
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node)).toBeFalsy();
    });

    it("should check that it's not an injected service prop with Ember.inject", () => {
      const context = new FauxContext(`
        import Ember from 'ember';
        export default Controller.extend({
          currentUser: Ember.inject()
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node, importName, undefined)).toBeFalsy();
    });

    it("should check that it's not an injected service prop with Ember.inject.foo", () => {
      const context = new FauxContext(`
        import Ember from 'ember';
        export default Controller.extend({
          currentUser: Ember.inject.foo()
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node, importName, undefined)).toBeFalsy();
    });

    it("should check that it's not an injected service prop with Ember.foo.service", () => {
      const context = new FauxContext(`
        import Ember from 'ember';
        export default Controller.extend({
          currentUser: Ember.foo.service()
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node, importName, undefined)).toBeFalsy();
    });

    it("should check that it's not an injected service prop with Ember.service.foo", () => {
      const context = new FauxContext(`
        import Ember from 'ember';
        export default Controller.extend({
          currentUser: Ember.service.foo()
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node, importName, undefined)).toBeFalsy();
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
        import {inject as service} from '@ember/service';
        export default Controller.extend({
          currentUser: service.otherFunction()
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedServiceProp(node, undefined, importName)).toBeFalsy();
    });
  });

  describe('native classes', () => {
    it("should check if it's an injected service prop when using renamed import", () => {
      const context = new FauxContext(`
        import {inject as service} from '@ember/service';
        class MyController extends Controller {
          @service currentUser;
        }
      `);
      const node = context.ast.body[1].body.body[0];
      expect(emberUtils.isInjectedServiceProp(node, undefined, 'service')).toBeTruthy();
    });

    it("should check if it's an injected service prop when service is from another object", () => {
      const context = new FauxContext(`
        import {inject as service} from '@ember/service';
        class MyController extends Controller {
          @foo.service currentUser;
        }
      `);
      const node = context.ast.body[1].body.body[0];
      expect(emberUtils.isInjectedServiceProp(node, undefined, 'service')).toBeFalsy();
    });

    it("should check if it's an injected service prop when another function from service", () => {
      const context = new FauxContext(`
        import {inject as service} from '@ember/service';
        class MyController extends Controller {
          @service.foo currentUser;
        }
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].body.body[0];
      expect(emberUtils.isInjectedServiceProp(node, undefined, importName)).toBeFalsy();
    });

    it("should check if it's an injected service prop when using decorator", () => {
      const context = new FauxContext(`
        import {inject} from '@ember/service';
        class MyController extends Controller {
          @inject currentUser;
        }
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].body.body[0];
      expect(emberUtils.isInjectedServiceProp(node, undefined, importName)).toBeTruthy();
    });

    it("should check that it's not an injected service prop without an import", () => {
      const context = new FauxContext(`
        class MyController extends Controller {
          @service currentUser;
        }
      `);
      const node = context.ast.body[0].body.body[0];
      expect(emberUtils.isInjectedServiceProp(node)).toBeFalsy();
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
        import {inject as controller} from '@ember/controller';
        export default Controller.extend({
          application: controller(),
        });
      `);
      const importControllerName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(
        emberUtils.isInjectedControllerProp(node, undefined, importControllerName)
      ).toBeTruthy();
    });

    it("should check if it's an injected controller prop with full import", () => {
      const context = new FauxContext(`
        import Ember from 'ember';
        export default Controller.extend({
          application: Ember.inject.controller(),
        });
      `);
      const importEmberName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedControllerProp(node, importEmberName)).toBeTruthy();
    });

    it("should check if it's not an injected controller prop without import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          application: controller(),
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedControllerProp(node)).toBeFalsy();
    });

    it("should check if it's not an injected controller prop without full import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          application: Ember.inject.controller(),
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedControllerProp(node)).toBeFalsy();
    });

    it("should check if it's not an injected controller prop with foo.controller", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          application: foo.controller(),
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isInjectedControllerProp(node)).toBeFalsy();
    });
  });

  describe('native classes', () => {
    it("should check if it's an injected controller prop with decorator", () => {
      const context = new FauxContext(`
        import {inject as controller} from '@ember/controller';
        class MyController extends Controller {
          @controller application;
        }
      `);
      const importControllerName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].body.body[0];
      expect(
        emberUtils.isInjectedControllerProp(node, undefined, importControllerName)
      ).toBeTruthy();
    });

    it("should check if it's not an injected controller prop with decorator without import", () => {
      const context = new FauxContext(`
        class MyController extends Controller {
          @controller application;
        }
      `);
      const node = context.ast.body[0].body.body[0];
      expect(emberUtils.isInjectedControllerProp(node)).toBeFalsy();
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
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeTruthy();

    node = parse('Ember.computed()');
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeTruthy();

    node = parse('foo()');
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeFalsy();

    node = parse('Ember.foo()');
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeFalsy();

    node = parse('Foo.computed()');
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeFalsy();

    // Non-standard names:
    node = parse('c()');
    expect(emberUtils.isComputedProp(node, 'E', 'c')).toBeTruthy();

    // Non-standard names:
    node = parse('E.computed()');
    expect(emberUtils.isComputedProp(node, 'E', 'c')).toBeTruthy();
  });

  it('should detect allow-listed computed props with MemberExpressions', () => {
    for (const prop of ['volatile', 'meta', 'readOnly', 'property']) {
      // With includeSuffix

      node = parse(`computed().${prop}()`);
      expect(
        emberUtils.isComputedProp(node, 'Ember', 'computed', { includeSuffix: true })
      ).toBeTruthy();

      node = parse(`Ember.computed().${prop}()`);
      expect(
        emberUtils.isComputedProp(node, 'Ember', 'computed', { includeSuffix: true })
      ).toBeTruthy();

      // Without includeSuffix

      node = parse(`computed().${prop}()`);
      expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeFalsy();

      node = parse(`Ember.computed().${prop}()`);
      expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeFalsy();
    }
  });

  it("shouldn't allow other MemberExpressions", () => {
    node = parse('computed().foo()');
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).not.toBeTruthy();

    node = parse('Ember.computed().foo()');
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).not.toBeTruthy();

    node = parse('computed.foo()');
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).not.toBeTruthy();

    node = parse('Ember.computed.foo()');
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).not.toBeTruthy();
  });

  it('should detect the computed annotation', () => {
    const program = babelESLintParse('class Object { @computed() get foo() {} }');
    node = program.body[0].body.body[0].decorators[0].expression;
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeTruthy();
  });

  it('should detect the computed annotation without parentheses', () => {
    const program = babelESLintParse('class Object { @computed get foo() {} }');
    node = program.body[0].body.body[0].decorators[0].expression;
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeTruthy();
  });

  it('should not detect a sub-module decorator', () => {
    const program = babelESLintParse('class Object { @computed.foo() get foo() {} }');
    node = program.body[0].body.body[0].decorators[0].expression;
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeFalsy();
  });

  it('should not detect the wrong decorator', () => {
    const program = babelESLintParse('class Object { @foo() get foo() {} }');
    node = program.body[0].body.body[0].decorators[0].expression;
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeFalsy();
  });

  it('should detect macros', () => {
    // With includeMacro

    node = parse('computed.someMacro()');
    expect(
      emberUtils.isComputedProp(node, 'Ember', 'computed', { includeMacro: true })
    ).toBeTruthy();

    node = parse('Ember.computed.someMacro()');
    expect(
      emberUtils.isComputedProp(node, 'Ember', 'computed', { includeMacro: true })
    ).toBeTruthy();

    // Without includeMacro

    node = parse('computed.someMacro()');
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeFalsy();

    node = parse('Ember.computed.someMacro()');
    expect(emberUtils.isComputedProp(node, 'Ember', 'computed')).toBeFalsy();
  });
});

describe('isObserverProp', () => {
  describe('classic classes', () => {
    it("should check if it's an observer prop using destructured import", () => {
      const context = new FauxContext(`
        import {observer} from '@ember/object';
        export default Controller.extend({
          someObserver: observer(),
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isObserverProp(node, undefined, importName)).toBeTruthy();
    });

    it("should check if it's an observer prop with full import", () => {
      const context = new FauxContext(`
        import Ember from 'ember';
        export default Controller.extend({
          someObserver: Ember.observer(),
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isObserverProp(node, importName)).toBeTruthy();
    });

    it("should check that it's not an observer prop without import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          someObserver: observer(),
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isObserverProp(node)).toBeFalsy();
    });

    it("should check that it's not an observer prop without full import", () => {
      const context = new FauxContext(`
        export default Controller.extend({
          someObserver: Ember.observer(),
        });
      `);
      const node = context.ast.body[0].declaration.arguments[0].properties[0];
      expect(emberUtils.isObserverProp(node)).toBeFalsy();
    });

    it("should check if it's an observer prop with multi-line observer", () => {
      const context = new FauxContext(`
        import {observer} from '@ember/object';
        export default Component.extend({
          levelOfHappiness: observer("attitude", "health", () => {
          }),
          vehicle: alias("car")
        });
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].declaration.arguments[0].properties[0];
      expect(emberUtils.isObserverProp(node, undefined, importName)).toBeTruthy();
    });
  });

  describe('native classes', () => {
    it("should check if it's an observer prop using decorator", () => {
      const context = new FauxContext(`
        import {observer} from '@ember/object';
        class MyController extends Controller {
          @observer someObserver;
        }
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].body.body[0];
      expect(emberUtils.isObserverProp(node, undefined, importName)).toBeTruthy();
    });

    it("should check if it's an observer prop using decorator with arg", () => {
      const context = new FauxContext(`
        import {observer} from '@ember/object';
        class MyController extends Controller {
          @observer("someArg") someObserver() {};
        }
      `);
      const importName = context.ast.body[0].specifiers[0].local.name;
      const node = context.ast.body[1].body.body[0];
      expect(emberUtils.isObserverProp(node, undefined, importName)).toBeTruthy();
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

    node = getProperty("test = { test: `foo${'bar'}` }"); // eslint-disable-line no-template-curly-in-string
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
  it("returns module's properties", () => {
    const code = `
    Ember.Component.extend(SomeMixin, {
      asd: 'qwe',
      actions: {},
      someMethod() {}
    })`;
    const parsed = parseForESLint(code);
    const moduleNode = parsed.ast.body[0].expression;
    const properties = emberUtils.getModuleProperties(moduleNode, parsed.scopeManager);
    expect(properties).toHaveLength(3);
  });

  it("returns module's properties when object is not last argument", () => {
    const code = `
    Ember.Component.extend({
      asd: 'qwe',
      actions: {},
      someMethod() {}
    }, SomeMixin)
  `;
    const parsed = parseForESLint(code);
    const moduleNode = parsed.ast.body[0].expression;
    const properties = emberUtils.getModuleProperties(moduleNode, parsed.scopeManager);
    expect(properties).toHaveLength(3);
  });

  it("returns module's properties when there are multiple objects", () => {
    const code = `
    Ember.Component.extend({
      asd: 'qwe',
      actions: {},
      someMethod() {}
    }, {
      asd: 'abc'
    })
  `;
    const parsed = parseForESLint(code);
    const moduleNode = parsed.ast.body[0].expression;
    const properties = emberUtils.getModuleProperties(moduleNode, parsed.scopeManager);
    expect(properties).toHaveLength(4);
  });

  it("returns module's properties when object from a variable", () => {
    const code = `
    const body = {
      asd: 'qwe',
      actions: {},
      someMethod() {}
    };
    Ember.Component.extend(body)
  `;
    const parsed = parseForESLint(code);
    const moduleNode = parsed.ast.body[1].expression;
    const properties = emberUtils.getModuleProperties(moduleNode, parsed.scopeManager);
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
  it('should parse dependent keys from CallExpression', () => {
    const node = parse("computed('model.{foo,bar}', 'model.bar')");
    expect(emberUtils.parseDependentKeys(node)).toStrictEqual([
      'model.foo',
      'model.bar',
      'model.bar',
    ]);
  });

  it('should work when no dependent keys present', () => {
    const node = parse('computed(function() {})');
    expect(emberUtils.parseDependentKeys(node)).toStrictEqual([]);
  });

  it('should handle dependent keys and function arguments', () => {
    const node = parse("computed('model.{foo,bar}', 'model.bar', function() {})");
    expect(emberUtils.parseDependentKeys(node)).toStrictEqual([
      'model.foo',
      'model.bar',
      'model.bar',
    ]);
  });

  it('should handle dependent keys and function arguments in MemberExpression', () => {
    const node = parse(`
      computed('model.{foo,bar}', 'model.bar', function() {
      }).volatile();
    `);
    expect(emberUtils.parseDependentKeys(node)).toStrictEqual([
      'model.foo',
      'model.bar',
      'model.bar',
    ]);
  });
});

describe('unwrapBraceExpressions', () => {
  it('should unwrap simple dependent keys', () => {
    expect(emberUtils.unwrapBraceExpressions(['model.foo', 'model.bar'])).toStrictEqual([
      'model.foo',
      'model.bar',
    ]);
  });

  it('should unwrap dependent keys with braces', () => {
    expect(emberUtils.unwrapBraceExpressions(['model.{foo,bar}', 'model.bar'])).toStrictEqual([
      'model.foo',
      'model.bar',
      'model.bar',
    ]);
  });

  it('should unwrap more complex dependent keys', () => {
    expect(
      emberUtils.unwrapBraceExpressions(['model.{foo,bar}', 'model.bar', 'data.{foo,baz,qux}'])
    ).toStrictEqual(['model.foo', 'model.bar', 'model.bar', 'data.foo', 'data.baz', 'data.qux']);
  });

  it('should unwrap multi-level keys', () => {
    expect(
      emberUtils.unwrapBraceExpressions(['model.bar.{foo,qux}', 'model.bar.baz'])
    ).toStrictEqual(['model.bar.foo', 'model.bar.qux', 'model.bar.baz']);
  });

  it('should unwrap @each with extensions', () => {
    expect(
      emberUtils.unwrapBraceExpressions(['collection.@each.{foo,bar}', 'collection.@each.qux'])
    ).toStrictEqual(['collection.@each.foo', 'collection.@each.bar', 'collection.@each.qux']);
  });

  it('should unwrap complicated mixed dependent keys', () => {
    expect(emberUtils.unwrapBraceExpressions(['a.b.c.{d.@each.qwe.zxc,f,g.[]}'])).toStrictEqual([
      'a.b.c.d.@each.qwe.zxc',
      'a.b.c.f',
      'a.b.c.g.[]',
    ]);
  });

  it('should unwrap complicated mixed repeated dependent keys', () => {
    expect(emberUtils.unwrapBraceExpressions(['a.b.{d.@each.qux,f,d.@each.foo}'])).toStrictEqual([
      'a.b.d.@each.qux',
      'a.b.f',
      'a.b.d.@each.foo',
    ]);
  });
});

describe('hasDuplicateDependentKeys', () => {
  it('reports duplicate dependent keys in computed calls', () => {
    let node = parse("computed('model.{foo,bar}', 'model.bar')");
    expect(emberUtils.hasDuplicateDependentKeys(node, 'Ember', 'computed')).toBeTruthy();
    node = parse("Ember.computed('model.{foo,bar}', 'model.bar')");
    expect(emberUtils.hasDuplicateDependentKeys(node, 'Ember', 'computed')).toBeTruthy();
  });

  it('ignores not repeated dependentKeys', () => {
    let node = parse("computed('model.{foo,bar}', 'model.qux')");
    expect(emberUtils.hasDuplicateDependentKeys(node, 'Ember', 'computed')).not.toBeTruthy();
    node = parse("Ember.computed('model.{foo,bar}', 'model.qux')");
    expect(emberUtils.hasDuplicateDependentKeys(node, 'Ember', 'computed')).not.toBeTruthy();
    node = parse("computed('model.{foo,bar}', 'model.qux').volatile()");
    expect(emberUtils.hasDuplicateDependentKeys(node, 'Ember', 'computed')).not.toBeTruthy();
  });

  it('ignores non-computed calls', () => {
    const node = parse("foo('model.{foo,bar}', 'model.bar')");
    expect(emberUtils.hasDuplicateDependentKeys(node, 'Ember', 'computed')).not.toBeTruthy();
  });
});

describe('getEmberImportAliasName', () => {
  it('should get the proper name of default import', () => {
    const node = babelESLintParse("import foo from 'ember'").body[0];
    expect(emberUtils.getEmberImportAliasName(node)).toBe('foo');
  });
});

describe('isEmberObjectImplementingUnknownProperty', () => {
  it('should be true for a classic class EmberObject with `unknownProperty`', () => {
    const node = babelESLintParse('EmberObject.extend({ unknownProperty() {} });').body[0]
      .expression;
    expect(emberUtils.isEmberObjectImplementingUnknownProperty(node)).toBeTruthy();
  });

  it('should be false for a classic class EmberObject without `unknownProperty`', () => {
    const node = babelESLintParse('EmberObject.extend({ somethingElse() {} });').body[0].expression;
    expect(emberUtils.isEmberObjectImplementingUnknownProperty(node)).toBeFalsy();
  });

  it('should be true for a native class EmberObject with `unknownProperty`', () => {
    const node = babelESLintParse('class MyClass extends EmberObject { unknownProperty() {} }')
      .body[0];
    expect(emberUtils.isEmberObjectImplementingUnknownProperty(node)).toBeTruthy();
  });

  it('should be true for a classic class EmberObject with `unknownProperty` in an object variable', () => {
    const parsed = parseForESLint(
      'const body = { unknownProperty() {} }; EmberObject.extend(body);'
    );
    const node = parsed.ast.body[1].expression;
    expect(
      emberUtils.isEmberObjectImplementingUnknownProperty(node, parsed.scopeManager)
    ).toBeTruthy();
  });

  it('should be false for a native class EmberObject without `unknownProperty`', () => {
    const node = babelESLintParse('class MyClass extends EmberObject { somethingElse() {} }')
      .body[0];
    expect(emberUtils.isEmberObjectImplementingUnknownProperty(node)).toBeFalsy();
  });

  it('throws when called on wrong type of node', () => {
    const node = babelESLintParse('const x = 123;').body[0];
    expect(() => emberUtils.isEmberObjectImplementingUnknownProperty(node)).toThrow(
      'Function should only be called on a `CallExpression` (classic class) or `ClassDeclaration` (native class)'
    );
  });
});

describe('isObserverDecorator', () => {
  it('should be true for an observer decorator', () => {
    const node = babelESLintParse(`
    import { observes } from '@ember-decorators/object';
    class FooComponent extends Component {
      @observes('baz')
      bar() {}
    }`).body[1].body.body[0].decorators[0];
    expect(emberUtils.isObserverDecorator(node, 'observes')).toBeTruthy();
  });

  it('should be true for an observer decorator with renamed import', () => {
    const node = babelESLintParse(`
    import { observes as observesRenamed } from '@ember-decorators/object';
    class FooComponent extends Component {
      @observesRenamed('baz')
      bar() {}
    }`).body[1].body.body[0].decorators[0];
    expect(emberUtils.isObserverDecorator(node, 'observesRenamed')).toBeTruthy();
  });

  it('should be false for another type of decorator', () => {
    const node = babelESLintParse(`
    import { action } from '@ember/object';
    class FooComponent extends Component {
      @action
      clickHandler() {}
    }`).body[1].body.body[0].decorators[0];
    expect(emberUtils.isObserverDecorator(node, 'observes')).toBeFalsy();
  });

  it('throws when called on a non-decorator', () => {
    const node = babelESLintParse('const x = 123;').body[0];
    expect(() => emberUtils.isObserverDecorator(node, 'observes')).toThrow(
      'Should only call this function on a Decorator'
    );
  });
});
