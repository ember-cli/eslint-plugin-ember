'use strict';

const babelEslint = require('babel-eslint');
const emberUtils = require('../../../lib/utils/ember');

function parse(code) {
  return babelEslint.parse(code).body[0].expression;
}

function getProperty(code) {
  return parse(code).right.properties[0];
}

describe('isModule', () => {
  let node;

  it('should check if it\'s a proper module', () => {
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
  it('should check if it\'s a DS Model', () => {
    const node = parse('DS.Model()');

    expect(emberUtils.isDSModel(node)).toBeTruthy();
  });

  it('should check if it\'s a DS Model even if it uses custom name', () => {
    const node = parse('CustomModel.extend()');
    const filePath = 'example-app/models/path/to/some-model.js';

    expect(
      emberUtils.isDSModel(node),
      'it shouldn\'t detect Model when no file path is provided'
    ).toBeFalsy();

    expect(
      emberUtils.isDSModel(node, filePath),
      'it should detect Model when file path is provided'
    ).toBeTruthy();
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

describe('isEmberCoreModule', () => {
  it('should check if current file is a component', () => {
    const node = parse('CustomComponent.extend()');
    const filePath = 'example-app/components/path/to/some-component.js';
    expect(emberUtils.isEmberCoreModule(node, 'component', filePath)).toBeTruthy();
  });

  it('should check if current file is a component', () => {
    const node = parse('Component.extend()');
    const filePath = 'example-app/some-twisted-path/some-component.js';
    expect(emberUtils.isEmberCoreModule(node, 'component', filePath)).toBeTruthy();
  });

  it('should check if current file is a controller', () => {
    const node = parse('CustomController.extend()');
    const filePath = 'example-app/controllers/path/to/some-controller.js';
    expect(emberUtils.isEmberCoreModule(node, 'controller', filePath)).toBeTruthy();
  });

  it('should check if current file is a controller', () => {
    const node = parse('Controller.extend()');
    const filePath = 'example-app/some-twisted-path/some-controller.js';
    expect(emberUtils.isEmberCoreModule(node, 'controller', filePath)).toBeTruthy();
  });

  it('should check if current file is a route', () => {
    const node = parse('CustomRoute.extend()');
    const filePath = 'example-app/routes/path/to/some-route.js';
    expect(emberUtils.isEmberCoreModule(node, 'route', filePath)).toBeTruthy();
  });

  it('should check if current file is a route', () => {
    const node = parse('Route.extend()');
    const filePath = 'example-app/some-twisted-path/some-route.js';
    expect(emberUtils.isEmberCoreModule(node, 'route', filePath)).toBeTruthy();
  });
});

describe('isEmberComponent', () => {
  it('should check if it\'s an Ember Component', () => {
    let node;

    node = parse('Ember.Component.extend()');
    expect(
      emberUtils.isEmberComponent(node),
      'it should detect Component when using Ember.Component'
    ).toBeTruthy();

    node = parse('Component.extend()');
    expect(
      emberUtils.isEmberComponent(node),
      'it should detect Component when using local module Component'
    ).toBeTruthy();
  });

  it('should check if it\'s an Ember Component even if it uses custom name', () => {
    const node = parse('CustomComponent.extend()');
    const filePath = 'example-app/components/path/to/some-component.js';

    expect(
      emberUtils.isEmberComponent(node),
      'it shouldn\'t detect Component when no file path is provided'
    ).toBeFalsy();

    expect(
      emberUtils.isEmberComponent(node, filePath),
      'it should detect Component when file path is provided'
    ).toBeTruthy();
  });
});

describe('isEmberController', () => {
  it('should check if it\'s an Ember Controller', () => {
    let node;

    node = parse('Ember.Controller.extend()');
    expect(
      emberUtils.isEmberController(node),
      'it should detect Controller when using Ember.Controller'
    ).toBeTruthy();

    node = parse('Controller.extend()');
    expect(
      emberUtils.isEmberController(node),
      'it should detect Controller when using local module Controller'
    ).toBeTruthy();
  });

  it(
    'should check if it\'s an Ember Controller even if it uses custom name', () => {
      const node = parse('CustomController.extend()');
      const filePath = 'example-app/controllers/path/to/some-feature.js';

      expect(
        emberUtils.isEmberController(node),
        'it shouldn\'t detect Controller when no file path is provided'
      ).toBeFalsy();

      expect(
        emberUtils.isEmberController(node, filePath),
        'it should detect Controller when file path is provided'
      ).toBeTruthy();
    });
});

describe('isEmberRoute', () => {
  it('should check if it\'s an Ember Route', () => {
    let node;

    node = parse('Ember.Route.extend()');
    expect(
      emberUtils.isEmberRoute(node),
      'it should detect Route when using Ember.Route'
    ).toBeTruthy();

    node = parse('Route.extend()');
    expect(
      emberUtils.isEmberRoute(node),
      'it should detect Route when using local module Route'
    ).toBeTruthy();
  });

  it('should check if it\'s an Ember Route even if it uses custom name', () => {
    const node = parse('CustomRoute.extend()');
    const filePath = 'example-app/routes/path/to/some-feature.js';

    expect(
      emberUtils.isEmberRoute(node),
      'it shouldn\'t detect Route when no file path is provided'
    ).toBeFalsy();

    expect(
      emberUtils.isEmberRoute(node, filePath),
      'it should detect Route when file path is provided'
    ).toBeTruthy();
  });
});

describe('isEmberService', () => {
  it('should check if it\'s an Ember Service', () => {
    let node;

    node = parse('Ember.Service.extend()');
    expect(
      emberUtils.isEmberService(node),
      'it should detect Service when using Ember.Service'
    ).toBeTruthy();

    node = parse('Service.extend()');
    expect(
      emberUtils.isEmberService(node),
      'it should detect Service when using local module Service'
    ).toBeTruthy();
  });

  it('should check if it\'s an Ember Service even if it uses custom name', () => {
    const node = parse('CustomService.extend()');
    const filePath = 'example-app/services/path/to/some-feature.js';

    expect(
      emberUtils.isEmberService(node),
      'it shouldn\'t detect Service when no file path is proviced'
    ).toBeFalsy();

    expect(
      emberUtils.isEmberService(node, filePath),
      'it should detect Service when file path is provided'
    ).toBeTruthy();
  });
});

describe('isInjectedServiceProp', () => {
  let node;

  it('should check if it\'s an injected service prop', () => {
    node = parse('service()');
    expect(emberUtils.isInjectedServiceProp(node)).toBeTruthy();

    node = parse('Ember.inject.service()');
    expect(emberUtils.isInjectedServiceProp(node)).toBeTruthy();

    node = parse('inject()');
    expect(emberUtils.isInjectedServiceProp(node)).toBeTruthy();
  });
});

describe('isInjectedControllerProp', () => {
  let node;

  it('should check if it\'s an injected controller prop', () => {
    node = parse('controller()');
    expect(emberUtils.isInjectedControllerProp(node)).toBeTruthy();

    node = parse('Ember.inject.controller()');
    expect(emberUtils.isInjectedControllerProp(node)).toBeTruthy();
  });
});

describe('isComputedProp', () => {
  let node;

  it('should check if it\'s an computed prop', () => {
    node = parse('computed()');
    expect(emberUtils.isComputedProp(node)).toBeTruthy();

    node = parse('Ember.computed()');
    expect(emberUtils.isComputedProp(node)).toBeTruthy();
  });

  it(
    'should detect whitelisted computed props with MemberExpressions',
    () => {
      ['volatile', 'meta', 'readOnly', 'property'].forEach((prop) => {
        node = parse(`computed().${prop}()`);
        expect(emberUtils.isComputedProp(node)).toBeTruthy();

        node = parse(`Ember.computed().${prop}()`);
        expect(emberUtils.isComputedProp(node)).toBeTruthy();
      });
    }
  );

  it('shouldn\'t allow other MemberExpressions', () => {
    node = parse('computed().foo()');
    expect(emberUtils.isComputedProp(node)).not.toBeTruthy();

    node = parse('Ember.computed().foo()');
    expect(emberUtils.isComputedProp(node)).not.toBeTruthy();
  });
});

describe('isObserverProp', () => {
  let node;

  it('should check if it\'s an observer prop', () => {
    node = parse('observer()');
    expect(emberUtils.isObserverProp(node)).toBeTruthy();

    node = parse('Ember.observer()');
    expect(emberUtils.isObserverProp(node)).toBeTruthy();
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
    node = getProperty('test = { test: \'someLiteral\' }');
    expect(emberUtils.isCustomProp(node)).toBeTruthy();

    node = getProperty('test = { test: someIdentifier }');
    expect(emberUtils.isCustomProp(node)).toBeTruthy();

    node = getProperty('test = { test: [] }');
    expect(emberUtils.isCustomProp(node)).toBeTruthy();

    node = getProperty('test = { test: {} }');
    expect(emberUtils.isCustomProp(node)).toBeTruthy();

    node = getProperty('test = { test: foo ? \'bar\': \'baz\' }');
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

  it('returns module\'s properties', () => {
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

  it('should detect if given node is a route', () => {
    const node = parse('this.route("lorem-ipsum")');
    expect(emberUtils.isRoute(node)).toBeTruthy();
  });
});

describe('parseDependentKeys', () => {
  it('should parse dependent keys from callexpression', () => {
    const node = parse("computed('model.{foo,bar}', 'model.bar')");
    expect(emberUtils.parseDependentKeys(node)).toEqual([
      'model.foo', 'model.bar', 'model.bar',
    ]);
  });

  it('should work when no dependent keys present', () => {
    const node = parse('computed(function() {})');
    expect(emberUtils.parseDependentKeys(node)).toEqual([]);
  });

  it('should handle dependent keys and function arguments', () => {
    const node = parse("computed('model.{foo,bar}', 'model.bar', function() {})");
    expect(emberUtils.parseDependentKeys(node)).toEqual([
      'model.foo', 'model.bar', 'model.bar',
    ]);
  });

  it('should handle dependent keys and function arguments in MemberExpression', () => {
    const node = parse(`
      computed('model.{foo,bar}', 'model.bar', function() {
      }).volatile();
    `);
    expect(emberUtils.parseDependentKeys(node)).toEqual([
      'model.foo', 'model.bar', 'model.bar',
    ]);
  });
});

describe('unwrapBraceExpressions', () => {
  it('should unwrap simple dependent keys', () => {
    expect(emberUtils.unwrapBraceExpressions([
      'model.foo', 'model.bar'
    ])).toEqual(['model.foo', 'model.bar']);
  });

  it('should unwrap dependent keys with braces', () => {
    expect(emberUtils.unwrapBraceExpressions([
      'model.{foo,bar}', 'model.bar'
    ])).toEqual(['model.foo', 'model.bar', 'model.bar']);
  });

  it('should unwrap more complex dependent keys', () => {
    expect(emberUtils.unwrapBraceExpressions([
      'model.{foo,bar}', 'model.bar', 'data.{foo,baz,qux}'
    ])).toEqual([
      'model.foo', 'model.bar', 'model.bar', 'data.foo', 'data.baz', 'data.qux',
    ]);
  });

  it('should unwrap multi-level keys', () => {
    expect(emberUtils.unwrapBraceExpressions([
      'model.bar.{foo,qux}', 'model.bar.baz'
    ])).toEqual([
      'model.bar.foo', 'model.bar.qux', 'model.bar.baz'
    ]);
  });

  it('should unwrap @each with extensions', () => {
    expect(emberUtils.unwrapBraceExpressions([
      'collection.@each.{foo,bar}', 'collection.@each.qux'
    ])).toEqual([
      'collection.@each.foo', 'collection.@each.bar', 'collection.@each.qux'
    ]);
  });

  it('should unwrap complicated mixed dependent keys', () => {
    expect(emberUtils.unwrapBraceExpressions([
      'a.b.c.{d.@each.qwe.zxc,f,g.[]}'
    ])).toEqual([
      'a.b.c.d.@each.qwe.zxc', 'a.b.c.f', 'a.b.c.g.[]',
    ]);
  });

  it('should unwrap complicated mixed repeated dependent keys', () => {
    expect(emberUtils.unwrapBraceExpressions([
      'a.b.{d.@each.qux,f,d.@each.foo}'
    ])).toEqual([
      'a.b.d.@each.qux', 'a.b.f', 'a.b.d.@each.foo',
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
