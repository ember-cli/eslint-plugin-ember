'use strict';

const assert = require('chai').assert;
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
    assert.ok(emberUtils.isModule(node, 'test'));

    node = parse('Ember.Component()');
    assert.ok(emberUtils.isModule(node, 'Component'));

    node = parse('DS.test()');
    assert.ok(emberUtils.isModule(node, 'test', 'DS'));

    node = parse('DS.Model()');
    assert.ok(emberUtils.isModule(node, 'Model', 'DS'));
  });
});

describe('isDSModel', () => {
  const node = parse('DS.Model()');

  it('should check if it\'s a DS Model', () => {
    assert.ok(emberUtils.isDSModel(node));
  });
});

describe('isModuleByFilePath', () => {
  it('should check if current file is a component', () => {
    const filePath = 'example-app/components/path/to/some-component.js';
    assert.ok(emberUtils.isModuleByFilePath(filePath, 'component'));
  });

  it('should check if current file is a component in PODs structure', () => {
    const filePath = 'example-app/components/path/to/some-component/component.js';
    assert.ok(emberUtils.isModuleByFilePath(filePath, 'component'));
  });

  it('should check if current file is a controller', () => {
    const filePath = 'example-app/controllers/path/to/some-feature.js';
    assert.ok(emberUtils.isModuleByFilePath(filePath, 'controller'));
  });

  it('should check if current file is a controller in PODs structure', () => {
    const filePath = 'example-app/path/to/some-feature/controller.js';
    assert.ok(emberUtils.isModuleByFilePath(filePath, 'controller'));
  });

  it('should check if current file is a route', () => {
    const filePath = 'example-app/routes/path/to/some-feature.js';
    assert.ok(emberUtils.isModuleByFilePath(filePath, 'route'));
  });

  it('should check if current file is a route - PODs structure', () => {
    const filePath = 'example-app/routes/path/to/some-feature/route.js';
    assert.ok(emberUtils.isModuleByFilePath(filePath, 'route'));
  });
});

describe('isEmberCoreModule', () => {
  it('should check if current file is a component', () => {
    const node = parse('CustomComponent.extend()');
    const filePath = 'example-app/components/path/to/some-component.js';
    assert.ok(emberUtils.isEmberCoreModule(node, 'component', filePath));
  });

  it('should check if current file is a component', () => {
    const node = parse('Component.extend()');
    const filePath = 'example-app/some-twisted-path/some-component.js';
    assert.ok(emberUtils.isEmberCoreModule(node, 'component', filePath));
  });

  it('should check if current file is a controller', () => {
    const node = parse('CustomController.extend()');
    const filePath = 'example-app/controllers/path/to/some-controller.js';
    assert.ok(emberUtils.isEmberCoreModule(node, 'controller', filePath));
  });

  it('should check if current file is a controller', () => {
    const node = parse('Controller.extend()');
    const filePath = 'example-app/some-twisted-path/some-controller.js';
    assert.ok(emberUtils.isEmberCoreModule(node, 'controller', filePath));
  });

  it('should check if current file is a route', () => {
    const node = parse('CustomRoute.extend()');
    const filePath = 'example-app/routes/path/to/some-route.js';
    assert.ok(emberUtils.isEmberCoreModule(node, 'route', filePath));
  });

  it('should check if current file is a route', () => {
    const node = parse('Route.extend()');
    const filePath = 'example-app/some-twisted-path/some-route.js';
    assert.ok(emberUtils.isEmberCoreModule(node, 'route', filePath));
  });
});

describe('isEmberComponent', () => {
  it('should check if it\'s an Ember Component', () => {
    let node;

    node = parse('Ember.Component.extend()');
    assert.ok(
      emberUtils.isEmberComponent(node),
      'it should detect Component when using Ember.Component'
    );

    node = parse('Component.extend()');
    assert.ok(
      emberUtils.isEmberComponent(node),
      'it should detect Component when using local module Component'
    );
  });

  it('should check if it\'s an Ember Component even if it uses custom name', () => {
    const node = parse('CustomComponent.extend()');
    const filePath = 'example-app/components/path/to/some-component.js';

    assert.notOk(
      emberUtils.isEmberComponent(node),
      'it shouldn\'t detect Component when no file path is provided'
    );

    assert.ok(
      emberUtils.isEmberComponent(node, filePath),
      'it should detect Component when file path is provided'
    );
  });
});

describe('isEmberController', () => {
  it('should check if it\'s an Ember Controller', () => {
    let node;

    node = parse('Ember.Controller.extend()');
    assert.ok(
      emberUtils.isEmberController(node),
      'it should detect Controller when using Ember.Controller'
    );

    node = parse('Controller.extend()');
    assert.ok(
      emberUtils.isEmberController(node),
      'it should detect Controller when using local module Controller'
    );
  });

  it('should check if it\'s an Ember Controller even if it uses custom name', () => {
    const node = parse('CustomController.extend()');
    const filePath = 'example-app/controllers/path/to/some-feature.js';

    assert.notOk(
      emberUtils.isEmberController(node),
      'it shouldn\'t detect Controller when no file path is provided'
    );

    assert.ok(
      emberUtils.isEmberController(node, filePath),
      'it should detect Controller when file path is provided'
    );
  });
});

describe('isEmberRoute', () => {
  it('should check if it\'s an Ember Route', () => {
    let node;

    node = parse('Ember.Route.extend()');
    assert.ok(
      emberUtils.isEmberRoute(node),
      'it should detect Route when using Ember.Route'
    );

    node = parse('Route.extend()');
    assert.ok(
      emberUtils.isEmberRoute(node),
      'it should detect Route when using local module Route'
    );
  });

  it('should check if it\'s an Ember Route even if it uses custom name', () => {
    const node = parse('CustomRoute.extend()');
    const filePath = 'example-app/routes/path/to/some-feature.js';

    assert.notOk(
      emberUtils.isEmberRoute(node),
      'it shouldn\'t detect Route when no file path is provided'
    );

    assert.ok(
      emberUtils.isEmberRoute(node, filePath),
      'it should detect Route when file path is provided'
    );
  });
});

describe('isInjectedServiceProp', () => {
  let node;

  it('should check if it\'s an injected service prop', () => {
    node = parse('service()');
    assert.ok(emberUtils.isInjectedServiceProp(node));

    node = parse('Ember.service()');
    assert.ok(emberUtils.isInjectedServiceProp(node));
  });
});

describe('isComputedProp', () => {
  let node;

  it('should check if it\'s an computed prop', () => {
    node = parse('computed()');
    assert.ok(emberUtils.isComputedProp(node));

    node = parse('Ember.computed()');
    assert.ok(emberUtils.isComputedProp(node));
  });
});

describe('isObserverProp', () => {
  let node;

  it('should check if it\'s an observer prop', () => {
    node = parse('observer()');
    assert.ok(emberUtils.isObserverProp(node));

    node = parse('Ember.observer()');
    assert.ok(emberUtils.isObserverProp(node));
  });
});

describe('isArrayProp', () => {
  let node;

  it('should be an array', () => {
    node = getProperty('test = { test: new Ember.A() }');
    assert.ok(emberUtils.isArrayProp(node));

    node = getProperty('test = { test: new A() }');
    assert.ok(emberUtils.isArrayProp(node));

    node = getProperty('test = { test: [] }');
    assert.ok(emberUtils.isArrayProp(node));
  });
});

describe('isObjectProp', () => {
  let node;

  it('should be an object', () => {
    node = getProperty('test = { test: new Ember.Object() }');
    assert.ok(emberUtils.isObjectProp(node));

    node = getProperty('test = { test: new Object() }');
    assert.ok(emberUtils.isObjectProp(node));

    node = getProperty('test = { test: {} }');
    assert.ok(emberUtils.isObjectProp(node));
  });
});

describe('isCustomProp', () => {
  let node;

  it('should be custom property', () => {
    node = getProperty('test = { test: \'someLiteral\' }');
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty('test = { test: someIdentifier }');
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty('test = { test: [] }');
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty('test = { test: {} }');
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty('test = { test: foo ? \'bar\': \'baz\' }');
    assert.ok(emberUtils.isCustomProp(node));

    node = getProperty('test = { actions: {} }');
    assert.notOk(emberUtils.isCustomProp(node));
  });
});

describe('isModelProp', () => {
  let node;

  it('should be a model prop', () => {
    node = getProperty('test = { model() {} }');
    assert.ok(emberUtils.isModelProp(node));

    node = getProperty('test = { model: function() {} }');
    assert.ok(emberUtils.isModelProp(node));
  });
});

describe('isActionsProp', () => {
  const node = getProperty('test = { actions: {} }');

  it('should be actions prop', () => {
    assert.ok(emberUtils.isActionsProp(node));
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
    assert.equal(properties.length, 3);
  });
});

describe('isSingleLineFn', () => {
  const property = getProperty(`test = {
    test: computed.or('asd', 'qwe')
  }`);

  it('should check if given function has one line', () => {
    assert.ok(emberUtils.isSingleLineFn(property));
  });
});

describe('isMultiLineFn', () => {
  const property = getProperty(`test = {
    test: computed('asd', function() {
      return get(this, 'asd') + 'test';
    })
  }`);

  it('should check if given function has more than one line', () => {
    assert.ok(emberUtils.isMultiLineFn(property));
  });
});

describe('isFunctionExpression', () => {
  let property;

  it('should check if given property is a function expression', () => {
    property = getProperty(`test = {
      test: someFn(function() {})
    }`);
    assert.ok(emberUtils.isFunctionExpression(property.value));

    property = getProperty(`test = {
      test() {}
    }`);
    assert.ok(emberUtils.isFunctionExpression(property.value));

    property = getProperty(`test = {
      test: function() {}
    }`);
    assert.ok(emberUtils.isFunctionExpression(property.value));

    property = getProperty(`test = {
      test: () => {}
    }`);
    assert.ok(emberUtils.isFunctionExpression(property.value));
  });
});

describe('isRelation', () => {
  let property;

  it('should detect hasMany relation', () => {
    property = getProperty(`test = {
      test: hasMany()
    }`);
    assert.ok(emberUtils.isRelation(property));

    property = getProperty(`test = {
      test: DS.hasMany()
    }`);
    assert.ok(emberUtils.isRelation(property));
  });

  it('should detect belongsTo relation', () => {
    property = getProperty(`test = {
      test: belongsTo()
    }`);
    assert.ok(emberUtils.isRelation(property));

    property = getProperty(`test = {
      test: DS.belongsTo()
    }`);
    assert.ok(emberUtils.isRelation(property));
  });
});
