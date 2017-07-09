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
  const node = parse('DS.Model()');

  it('should check if it\'s a DS Model', () => {
    expect(emberUtils.isDSModel(node)).toBeTruthy();
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

describe('isInjectedServiceProp', () => {
  let node;

  it('should check if it\'s an injected service prop', () => {
    node = parse('service()');
    expect(emberUtils.isInjectedServiceProp(node)).toBeTruthy();

    node = parse('Ember.service()');
    expect(emberUtils.isInjectedServiceProp(node)).toBeTruthy();
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
  });
});

describe('isModelProp', () => {
  let node;

  it('should be a model prop', () => {
    node = getProperty('test = { model() {} }');
    expect(emberUtils.isModelProp(node)).toBeTruthy();

    node = getProperty('test = { model: function() {} }');
    expect(emberUtils.isModelProp(node)).toBeTruthy();
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
